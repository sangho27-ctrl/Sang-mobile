import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  dbCreateUser,
  dbDeleteUser,
  dbGetAllUsers,
  dbGetSessionUserId,
  dbGetUserByEmail,
  dbSetSessionUserId,
  dbUpdateUserProfile,
  dbUpdateUserRole,
  initDatabase,
  type StoredDbUser,
} from '@/database/db';

export type UserRole = 'admin' | 'user';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
};

export type SignUpInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type ProfileInput = {
  name: string;
  phone: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  users: AuthUser[];
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signUp: (input: SignUpInput) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  updateProfile: (input: ProfileInput) => Promise<AuthUser>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toPublicUser(user: StoredDbUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<StoredDbUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Khởi tạo Database SQLite và khôi phục phiên đăng nhập
  useEffect(() => {
    async function loadData() {
      try {
        await initDatabase();
        const all = await dbGetAllUsers();
        setUsers(all);

        const currentSessionId = await dbGetSessionUserId();
        if (currentSessionId) {
          const found = all.find((u) => u.id === currentSessionId);
          if (found) {
            setUser(toPublicUser(found));
          }
        }
      } catch (e) {
        console.error('Lỗi khi tải dữ liệu người dùng từ SQLite:', e);
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, []);

  // Đăng nhập
  const signIn = async (email: string, password: string): Promise<AuthUser> => {
    const cleanEmail = email.trim().toLowerCase();
    const found = await dbGetUserByEmail(cleanEmail);

    if (!found || found.password !== password) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    await dbSetSessionUserId(found.id);
    const authUser = toPublicUser(found);
    setUser(authUser);
    return authUser;
  };

  // Đăng ký tài khoản mới vào SQLite
  const signUp = async (input: SignUpInput): Promise<AuthUser> => {
    const cleanEmail = input.email.trim().toLowerCase();
    const existing = await dbGetUserByEmail(cleanEmail);
    if (existing) {
      throw new Error('Email này đã được sử dụng.');
    }

    const newUser: StoredDbUser = {
      id: `user_${Date.now()}`,
      name: input.name.trim(),
      email: cleanEmail,
      phone: input.phone.trim(),
      password: input.password,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    await dbCreateUser(newUser);
    await dbSetSessionUserId(newUser.id);

    const nextUsers = [...users, newUser];
    setUsers(nextUsers);

    const authUser = toPublicUser(newUser);
    setUser(authUser);
    return authUser;
  };

  // Đăng xuất
  const signOut = async () => {
    await dbSetSessionUserId(null);
    setUser(null);
  };

  // Cập nhật thông tin cá nhân
  const updateProfile = async (input: ProfileInput): Promise<AuthUser> => {
    if (!user) throw new Error('Chưa đăng nhập.');

    const name = input.name.trim();
    const phone = input.phone.trim();
    await dbUpdateUserProfile(user.id, name, phone);

    const updated = { ...user, name, phone };
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, name, phone } : u)));
    setUser(updated);
    return updated;
  };

  // Cập nhật vai trò (Admin/User)
  const updateUserRole = async (userId: string, role: UserRole) => {
    if (userId === user?.id && role !== 'admin') {
      throw new Error('Bạn không thể tự hạ quyền của chính mình.');
    }

    await dbUpdateUserRole(userId, role);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    if (user?.id === userId) {
      setUser((prev) => (prev ? { ...prev, role } : null));
    }
  };

  // Xóa người dùng
  const deleteUser = async (userId: string) => {
    if (userId === user?.id) {
      throw new Error('Không thể tự xóa tài khoản đang đăng nhập.');
    }
    await dbDeleteUser(userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users: users.map(toPublicUser),
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        updateUserRole,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng trong AuthProvider.');
  }
  return context;
}
