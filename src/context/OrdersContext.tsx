import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { useAuth } from '@/context/AuthContext';
import type { CheckoutInput, Order, OrderStatus } from '@/data/orders';
import {
  dbCreateOrder,
  dbGetAllOrders,
  dbGetOrders,
  dbUpdateOrderStatus,
  initDatabase,
} from '@/database/db';

type OrdersContextValue = {
  orders: Order[];
  allOrders: Order[];
  createOrder: (input: CheckoutInput) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

function createOrderId(): string {
  return `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;
}

export function OrdersProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  // Tải danh sách đơn hàng từ SQLite theo userId (admin tải thêm toàn bộ đơn)
  useEffect(() => {
    let isMounted = true;

    if (!user) {
      return () => {
        isMounted = false;
      };
    }

    (async () => {
      try {
        await initDatabase();
        const data = await dbGetOrders(user.id);
        if (isMounted) {
          setOrders(data);
        }

        if (user.role === 'admin') {
          const everything = await dbGetAllOrders();
          if (isMounted) {
            setAllOrders(everything);
          }
        }
      } catch (e) {
        console.error('Lỗi tải danh sách đơn hàng từ SQLite:', e);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const visibleOrders = user ? orders : [];

  const createOrder = async (input: CheckoutInput): Promise<Order> => {
    if (!user) {
      throw new Error('Bạn cần đăng nhập để đặt hàng.');
    }

    const subtotal = input.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const newOrder: Order = {
      id: createOrderId(),
      userId: user.id,
      items: input.items,
      subtotal,
      shippingFee: input.shippingFee,
      total: subtotal + input.shippingFee,
      status: 'pending',
      paymentMethod: input.paymentMethod,
      recipientName: input.recipientName,
      phone: input.phone,
      address: input.address,
      note: input.note,
      createdAt: new Date().toISOString(),
    };

    await dbCreateOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev]);
    if (user.role === 'admin') {
      setAllOrders((prev) => [newOrder, ...prev]);
    }
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await dbUpdateOrderStatus(orderId, status);
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order)),
    );
    setAllOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order)),
    );
  };

  return (
    <OrdersContext.Provider
      value={{ orders: visibleOrders, allOrders, createOrder, updateOrderStatus }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders(): OrdersContextValue {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders phải được dùng bên trong OrdersProvider.');
  }
  return context;
}
