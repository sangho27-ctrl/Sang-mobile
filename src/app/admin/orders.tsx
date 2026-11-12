import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertBanner } from '@/components/AlertBanner';
import { Header } from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
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

const STATUS_ORDER: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipping',
  'completed',
  'cancelled',
];

type FilterId = 'all' | OrderStatus;

export default function AdminOrdersScreen() {
  const { users } = useAuth();
  const { allOrders, updateOrderStatus } = useOrders();
  const [filter, setFilter] = useState<FilterId>('all');
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const visibleOrders =
    filter === 'all' ? allOrders : allOrders.filter((order) => order.status === filter);

  const userName = (userId: string) => {
    const found = users.find((item) => item.id === userId);
    return found ? `${found.name} (${found.email})` : 'Người dùng không tồn tại';
  };

  const handleUpdate = async (orderId: string, status: OrderStatus) => {
    setBusyId(orderId);
    setNotice(null);
    setError(null);
    try {
      await updateOrderStatus(orderId, status);
      setNotice(`Đã cập nhật đơn ${orderId} sang "${ORDER_STATUS_LABELS[status]}".`);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Không thể cập nhật tình trạng đơn hàng.',
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header subtitle="Quản lý đơn hàng của khách" />

        <View style={styles.heading}>
          <Text style={styles.title}>Quản trị đơn hàng</Text>
          <Text style={styles.subtitle}>
            Xem danh sách đơn hàng và cập nhật tình trạng xử lý.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{allOrders.length}</Text>
            <Text style={styles.statLabel}>Tổng đơn</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.accent }]}>
              {allOrders.filter((order) => order.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Chờ xác nhận</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#1570EF' }]}>
              {allOrders.filter((order) => order.status === 'shipping').length}
            </Text>
            <Text style={styles.statLabel}>Đang giao</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {allOrders.filter((order) => order.status === 'completed').length}
            </Text>
            <Text style={styles.statLabel}>Hoàn thành</Text>
          </View>
        </View>

        {error ? <AlertBanner message={error} style={styles.banner} /> : null}
        {notice ? <AlertBanner message={notice} tone="success" style={styles.banner} /> : null}

        <Text style={styles.filterLabel}>Lọc theo tình trạng</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <Pressable
            onPress={() => setFilter('all')}
            style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              Tất cả ({allOrders.length})
            </Text>
          </Pressable>
          {STATUS_ORDER.map((status) => {
            const count = allOrders.filter((order) => order.status === status).length;
            const active = filter === status;
            return (
              <Pressable
                key={status}
                onPress={() => setFilter(status)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {ORDER_STATUS_LABELS[status]} ({count})
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {visibleOrders.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={42} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Chưa có đơn hàng</Text>
            <Text style={styles.emptyText}>
              Đơn hàng của khách sẽ xuất hiện tại đây sau khi đặt mua.
            </Text>
          </View>
        ) : null}

        {visibleOrders.map((order) => {
          const statusStyle = STATUS_COLORS[order.status];
          const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
          const isBusy = busyId === order.id;

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

              <View style={styles.customerBox}>
                <Ionicons name="person-circle-outline" size={18} color={colors.primary} />
                <Text style={styles.customerText} numberOfLines={2}>
                  {userName(order.userId)}
                </Text>
              </View>

              <View style={styles.divider} />

              {order.items.map((item) => (
                <View key={`${order.id}-${item.productId}`} style={styles.itemRow}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
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
                <Text style={styles.metaText}>
                  {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                </Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng thanh toán ({itemCount} sản phẩm)</Text>
                <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
              </View>

              <Text style={styles.updateLabel}>Cập nhật tình trạng đơn hàng</Text>
              <View style={styles.statusActions}>
                {STATUS_ORDER.map((status) => {
                  const active = order.status === status;
                  return (
                    <Pressable
                      key={status}
                      onPress={() => void handleUpdate(order.id, status)}
                      disabled={isBusy || active}
                      accessibilityRole="button"
                      accessibilityLabel={`Chuyển đơn ${order.id} sang ${ORDER_STATUS_LABELS[status]}`}
                      style={[
                        styles.statusButton,
                        active && styles.statusButtonActive,
                        (isBusy || active) && styles.statusButtonDisabled,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusButtonText,
                          active && styles.statusButtonTextActive,
                        ]}
                      >
                        {ORDER_STATUS_LABELS[status]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
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
  heading: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 8.5,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  banner: {
    marginTop: spacing.md,
  },
  filterLabel: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  filterRow: {
    gap: 6,
    paddingBottom: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  empty: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    marginTop: spacing.md,
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  emptyText: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  orderCard: {
    marginTop: spacing.md,
    padding: spacing.md,
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
    gap: spacing.sm,
  },
  orderHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  orderId: {
    fontSize: 11.5,
    fontWeight: '800',
    color: colors.text,
  },
  orderDate: {
    marginTop: 2,
    fontSize: 9,
    color: colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  customerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: spacing.sm,
  },
  customerText: {
    flex: 1,
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    marginVertical: spacing.sm,
    backgroundColor: colors.border,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 3,
  },
  itemName: {
    flex: 1,
    fontSize: 10,
    lineHeight: 14,
    color: colors.text,
  },
  itemQuantity: {
    fontSize: 9.5,
    color: colors.textSecondary,
  },
  itemPrice: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 5,
  },
  metaText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  updateLabel: {
    marginTop: spacing.md,
    marginBottom: 6,
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  statusActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  statusButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  statusButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  statusButtonDisabled: {
    opacity: 0.65,
  },
  statusButtonText: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusButtonTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
});
