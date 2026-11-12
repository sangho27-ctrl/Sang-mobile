export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
export type PaymentMethod = 'cod' | 'bank';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  bank: 'Chuyển khoản ngân hàng',
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  recipientName: string;
  phone: string;
  address: string;
  note?: string;
  createdAt: string;
};

export type CheckoutInput = {
  items: OrderItem[];
  shippingFee: number;
  paymentMethod: PaymentMethod;
  recipientName: string;
  phone: string;
  address: string;
  note?: string;
};
