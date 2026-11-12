import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { ProductImage } from '@/components/ProductImage';
import { useOrders } from '@/context/OrdersContext';
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  type OrderStatus,
} from '@/data/orders';
import { cardShadow, colors, radius, spacing } from '@/theme';
import { formatDateTime, formatPrice } from '@/utils/format';

const STATUS_COLORS: Record<OrderStatus, { color: string; backgroundColor: string }> = {
  pending: { color: colors.accent, backgroundColor: colors.accentSoft },
  confirmed: { color: colors.primary, backgroundColor: colors.primarySoft },
  shipping: { color: '#1570EF', backgroundColor: '#EFF8FF' },
  completed: { color: colors.success, backgroundColor: colors.successSoft },
  cancelled: { color: colors.danger, backgroundColor: colors.dangerSoft },
};

export default function OrdersScreen() {
  const { orders } = useOrders();
  const params = useLocalSearchParams<{ placed?: string }>();
  const justPlaced = params.placed === '1';

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="receipt-outline"
            title="Chưa có đơn hàng nào"
            description="Lịch sử mua hàng của bạn sẽ xuất hiện tại đây sau khi đặt đơn đầu tiên."
            actionLabel="Mua sắm ngay"
            onAction={() => router.navigate('/')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {justPlaced ? (
          <View style={styles.successBanner}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={26} color={colors.success} />
            </View>
            <View style={styles.successTextWrap}>
              <Text style={styles.successTitle}>Đặt hàng thành công!</Text>
              <Text style={styles.successText}>
                Đơn hàng của bạn đã được ghi nhận và đang chờ xác nhận.
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.header}>
          <Text style={styles.title}>Lịch sử mua hàng</Text>
          <Text style={styles.subtitle}>{orders.length} đơn hàng đã đặt tại MiniShop</Text>
        </View>

        {orders.map((order) => {
          const statusStyle = STATUS_COLORS[order.status];
          const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);

          return (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.orderHeaderText}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderDate}>{formatDateTime(order.createdAt)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                  <Text style={[styles.statusText, { color: statusStyle.color }]}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              {order.items.map((item) => (
                <View key={`${order.id}-${item.productId}`} style={styles.itemRow}>
                  <View style={styles.thumb}>
                    <ProductImage
                      product={{ id: item.productId, imageUrl: item.imageUrl }}
                      iconSize={20}
                    />
                  </View>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                  <Text style={styles.itemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                <Text style={styles.metaText} numberOfLines={2}>
                  {order.recipientName} · {order.phone}
                  {'\n'}
                  {order.address}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons
                  name={order.paymentMethod === 'cod' ? 'cash-outline' : 'card-outline'}
                  size={14}
                  color={colors.textMuted}
                />
                <Text style={styles.metaText}>{PAYMENT_METHOD_LABELS[order.paymentMethod]}</Text>
              </View>
              {order.note ? (
                <View style={styles.metaRow}>
                  <Ionicons name="chatbox-ellipses-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.metaText}>Ghi chú: {order.note}</Text>
                </View>
              ) : null}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Tổng thanh toán ({itemCount} sản phẩm)
                </Text>
                <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
              </View>
            </View>
          );
        })}

        <Pressable
          onPress={() => router.navigate('/')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.continueButton, pressed && styles.pressed]}
        >
          <Ionicons name="storefront-outline" size={17} color={colors.primary} />
          <Text style={styles.continueText}>Tiếp tục mua sắm</Text>
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
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.successSoft,
    borderWidth: 1,
    borderColor: '#A6F4C5',
  },
  successIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  successTextWrap: {
    flex: 1,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  successText: {
    marginTop: 2,
    fontSize: 10.5,
    lineHeight: 15,
    color: colors.textSecondary,
  },
  orderCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  orderHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  orderId: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  orderDate: {
    marginTop: 2,
    fontSize: 9.5,
    color: colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  statusText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
    backgroundColor: '#F2F4F7',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 5,
  },
  thumb: {
    width: 44,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  itemName: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 15,
    color: colors.text,
  },
  itemQuantity: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  itemPrice: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 6,
  },
  metaText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 15,
    color: colors.textSecondary,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    flex: 1,
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  continueText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
});
