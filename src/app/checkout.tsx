import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { FormField } from '@/components/FormField';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/constants/shipping';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useCatalog } from '@/context/CatalogContext';
import { useOrders } from '@/context/OrdersContext';
import {
  PAYMENT_METHOD_LABELS,
  type OrderItem,
  type PaymentMethod,
} from '@/data/orders';
import { colors, radius, spacing } from '@/theme';
import { formatPrice } from '@/utils/format';
import { isValidPhone } from '@/utils/validation';

export default function CheckoutScreen() {
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const { getProductById } = useCatalog();
  const { createOrder } = useOrders();

  const [recipientName, setRecipientName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Chuẩn bị danh sách sản phẩm đặt mua
  const orderItems: OrderItem[] = items.flatMap((item) => {
    const product = getProductById(item.productId);
    if (!product) return [];
    return [
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        imageUrl: product.imageUrl,
      },
    ];
  });

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  if (orderItems.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <EmptyState
          icon="cart-outline"
          title="Không có sản phẩm để thanh toán"
          description="Giỏ hàng trống. Vui lòng chọn sản phẩm trước."
          actionLabel="Về giỏ hàng"
          onAction={() => router.replace('/cart')}
        />
      </SafeAreaView>
    );
  }

  const handlePlaceOrder = async () => {
    if (!recipientName.trim()) {
      setError('Vui lòng nhập họ tên người nhận.');
      return;
    }
    if (!phone.trim() || !isValidPhone(phone)) {
      setError('Số điện thoại không hợp lệ (cần 10 chữ số).');
      return;
    }
    if (address.trim().length < 6) {
      setError('Vui lòng nhập địa chỉ giao hàng cụ thể.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await createOrder({
        items: orderItems,
        shippingFee,
        paymentMethod,
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        note: note.trim() || undefined,
      });

      clearCart();
      router.replace({ pathname: '/orders', params: { placed: '1' } });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Đặt hàng thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Thông tin giao hàng */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin giao hàng</Text>
          <FormField
            label="Họ tên người nhận"
            icon="person-outline"
            placeholder="Ví dụ: Nguyễn Văn A"
            value={recipientName}
            onChangeText={setRecipientName}
          />
          <FormField
            label="Số điện thoại"
            icon="call-outline"
            placeholder="Ví dụ: 0901234567"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <FormField
            label="Địa chỉ nhận hàng"
            icon="location-outline"
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành..."
            value={address}
            onChangeText={setAddress}
            multiline
            minHeight={65}
          />
          <FormField
            label="Ghi chú giao hàng (tùy chọn)"
            icon="document-text-outline"
            placeholder="Lời dặn cho shipper..."
            value={note}
            onChangeText={setNote}
          />
        </View>

        {/* Phương thức thanh toán */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Phương thức thanh toán</Text>
          <Pressable
            onPress={() => setPaymentMethod('cod')}
            style={[styles.paymentOption, paymentMethod === 'cod' && styles.paymentOptionActive]}
          >
            <Ionicons
              name={paymentMethod === 'cod' ? 'radio-button-on' : 'radio-button-off'}
              size={18}
              color={paymentMethod === 'cod' ? colors.primary : colors.textMuted}
            />
            <Text style={styles.paymentText}>{PAYMENT_METHOD_LABELS.cod}</Text>
          </Pressable>

          <Pressable
            onPress={() => setPaymentMethod('bank')}
            style={[styles.paymentOption, paymentMethod === 'bank' && styles.paymentOptionActive]}
          >
            <Ionicons
              name={paymentMethod === 'bank' ? 'radio-button-on' : 'radio-button-off'}
              size={18}
              color={paymentMethod === 'bank' ? colors.primary : colors.textMuted}
            />
            <Text style={styles.paymentText}>{PAYMENT_METHOD_LABELS.bank}</Text>
          </Pressable>
        </View>

        {/* Tóm tắt đơn hàng */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tóm tắt thanh toán</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tiền hàng ({orderItems.length} món):</Text>
            <Text style={styles.summaryVal}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
            <Text style={styles.summaryVal}>
              {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalVal}>{formatPrice(total)}</Text>
          </View>
        </View>

        {/* Nút đặt hàng */}
        <Pressable
          onPress={handlePlaceOrder}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.submitBtn,
            isSubmitting && styles.btnDisabled,
            pressed && styles.pressed,
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitBtnText}>Xác nhận đặt hàng ({formatPrice(total)})</Text>
          )}
        </Pressable>
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
    padding: spacing.md,
    gap: spacing.md,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.dangerSoft,
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  paymentOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  paymentText: {
    fontSize: 13,
    color: colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
