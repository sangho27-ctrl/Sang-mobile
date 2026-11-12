import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  dbAddToCart,
  dbClearCart,
  dbGetCart,
  dbRemoveFromCart,
  dbSetCartQuantity,
  initDatabase,
  type DbCartItem,
} from '@/database/db';

export type CartItem = DbCartItem;

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // Tải giỏ hàng từ SQLite theo userId của người đang đăng nhập
  useEffect(() => {
    let isMounted = true;
    if (user) {
      initDatabase()
        .then(() => dbGetCart(user.id))
        .then((cartRows) => {
          if (isMounted) {
            setItems(cartRows);
          }
        })
        .catch((e) => console.error('Lỗi khi tải giỏ hàng từ SQLite:', e));
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const visibleItems = user ? items : [];

  const addItem = (productId: string, quantity = 1) => {
    if (!user) return;

    void dbAddToCart(user.id, productId, quantity).then(async () => {
      const refreshed = await dbGetCart(user.id);
      setItems(refreshed);
    });
  };

  const setQuantity = (productId: string, quantity: number) => {
    if (!user) return;

    void dbSetCartQuantity(user.id, productId, quantity).then(async () => {
      const refreshed = await dbGetCart(user.id);
      setItems(refreshed);
    });
  };

  const removeItem = (productId: string) => {
    if (!user) return;

    void dbRemoveFromCart(user.id, productId).then(async () => {
      const refreshed = await dbGetCart(user.id);
      setItems(refreshed);
    });
  };

  const clearCart = () => {
    if (!user) return;

    void dbClearCart(user.id).then(() => {
      setItems([]);
    });
  };

  const itemCount = visibleItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: visibleItems,
        itemCount,
        addItem,
        setQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart phải được dùng bên trong CartProvider.');
  }
  return context;
}
