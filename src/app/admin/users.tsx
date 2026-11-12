import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { AlertBanner } from '@/components/AlertBanner';
import { ADMIN_ACCOUNT } from '@/constants/accounts';
import {
  useAuth,
  type AuthUser,
  type UserRole,
} from '@/context/AuthContext';
import { cardShadow, colors, radius, spacing } from '@/theme';
import { confirmAction } from '@/utils/confirm';
import { formatDate, getInitials } from '@/utils/format';

export default function AdminUsersScreen() {
  const { users, user: currentUser, updateUserRole, deleteUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const runAction = async (userId: string, task: () => Promise<void>) => {
    setError(null);
    setNotice(null);
    setBusyId(userId);
    try {
      await task();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : 'Không thể thực hiện thao tác. Vui lòng thử lại.',
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleRoleChange = (target: AuthUser, role: UserRole) => {
    void runAction(target.id, async () => {
      await updateUserRole(target.id, role);
      setNotice(
        role === 'admin'
          ? `Đã cấp quyền admin cho ${target.name}.`
          : `Đã chuyển ${target.name} về vai trò người dùng.`,
      );
    });
  };

  const handleDelete = (target: AuthUser) => {
    confirmAction({
      title: 'Xóa người dùng',
      message: `Bạn có chắc muốn xóa tài khoản ${target.email}? Thao tác này không thể hoàn tác.`,
      confirmLabel: 'Xóa',
      destructive: true,
      onConfirm: () => {
        void runAction(target.id, async () => {
          await deleteUser(target.id);
          setNotice(`Đã xóa tài khoản ${target.email}.`);
        });
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header subtitle="Quản lý tài khoản người dùng" />

        {error ? <AlertBanner message={error} style={styles.banner} /> : null}

        {notice ? (
          <AlertBanner message={notice} tone="success" style={styles.banner} />
        ) : null}

        <View style={styles.summaryRow}>
          <Text style={styles.sectionTitle}>Danh sách người dùng</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{users.length}</Text>
          </View>
        </View>

        {users.map((item) => {
          const isSelf = item.id === currentUser?.id;
          const isSystem = item.email === ADMIN_ACCOUNT.email;
          const isLocked = isSelf || isSystem;
          const isBusy = busyId === item.id;
          const nextRole: UserRole = item.role === 'admin' ? 'user' : 'admin';

          return (
            <View key={item.id} style={styles.userCard}>
              <View style={styles.userTop}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
                </View>
                <View style={styles.userInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {isSelf ? (
                      <View style={styles.selfPill}>
                        <Text style={styles.selfText}>BẠN</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.userEmail} numberOfLines={1}>
                    {item.email}
                  </Text>
                  <Text style={styles.userMeta}>
                    {item.phone} · Tham gia {formatDate(item.createdAt)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.roleBadge,
                    item.role === 'admin' ? styles.roleAdmin : styles.roleUser,
                  ]}
                >
                  <Text
                    style={[
                      styles.roleText,
                      item.role === 'admin' ? styles.roleAdminText : styles.roleUserText,
                    ]}
                  >
                    {item.role === 'admin' ? 'ADMIN' : 'USER'}
                  </Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <Pressable
                  onPress={() => handleRoleChange(item, nextRole)}
                  disabled={isBusy || isLocked}
                  accessibilityRole="button"
                  accessibilityLabel={
                    nextRole === 'admin'
                      ? `Cấp quyền admin cho ${item.name}`
                      : `Hạ quyền ${item.name} về user`
                  }
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.roleButton,
                    pressed && !isBusy && !isLocked && styles.pressed,
                    (isBusy || isLocked) && styles.disabled,
                  ]}
                >
                  <Ionicons
                    name={nextRole === 'admin' ? 'shield-checkmark-outline' : 'person-outline'}
                    size={15}
                    color={colors.primary}
                  />
                  <Text style={styles.roleButtonText}>
                    {nextRole === 'admin' ? 'Cấp quyền admin' : 'Chuyển thành user'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleDelete(item)}
                  disabled={isBusy || isLocked}
                  accessibilityRole="button"
                  accessibilityLabel={`Xóa người dùng ${item.name}`}
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.deleteButton,
                    pressed && !isBusy && !isLocked && styles.pressed,
                    (isBusy || isLocked) && styles.disabled,
                  ]}
                >
                  <Ionicons name="trash-outline" size={15} color={colors.danger} />
                  <Text style={styles.deleteButtonText}>Xóa</Text>
                </Pressable>
              </View>

              {isLocked ? (
                <Text style={styles.selfHint}>
                  {isSystem
                    ? 'Tài khoản admin gốc của hệ thống không thể đổi vai trò hoặc xóa.'
                    : 'Không thể tự hạ quyền hoặc tự xóa tài khoản đang đăng nhập.'}
                </Text>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  banner: {
    marginTop: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  countPill: {
    minWidth: 30,
    height: 26,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: colors.primarySoft,
  },
  countText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  userCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  userTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    flexShrink: 1,
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.text,
  },
  selfPill: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: colors.surfaceMuted,
  },
  selfText: {
    fontSize: 7.5,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: colors.textSecondary,
  },
  userEmail: {
    marginTop: 2,
    fontSize: 10.5,
    color: colors.textSecondary,
  },
  userMeta: {
    marginTop: 2,
    fontSize: 9.5,
    color: colors.textMuted,
  },
  roleBadge: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  roleAdmin: {
    backgroundColor: colors.primarySoft,
  },
  roleUser: {
    backgroundColor: colors.surfaceMuted,
  },
  roleText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  roleAdminText: {
    color: colors.primary,
  },
  roleUserText: {
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    minHeight: 38,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  roleButton: {
    flex: 1,
    borderColor: '#C7D2FE',
    backgroundColor: colors.primarySoft,
  },
  roleButtonText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primary,
  },
  deleteButton: {
    borderColor: '#FEE4E2',
    backgroundColor: colors.dangerSoft,
  },
  deleteButtonText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.danger,
  },
  selfHint: {
    marginTop: 8,
    fontSize: 9.5,
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});
