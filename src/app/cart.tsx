import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { useCart } from '@/context/CartContext';
import { useCatalog } from '@/context/CatalogContext';
import { getProductImageSource } from '@/data/products';
import { colors, radius, spacing } from '@/theme';
import { confirmAction } from '@/utils/confirm';
import { formatPrice } from '@/utils/format';

export default function CartScreen() {
  const { items, setQuantity, removeItem, clearCart } = useCart();
  const { getProductById } = useCatalog();

  const subtotal = items.reduce((total, item) => {
    const product = getProductById(item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  const handleClear = () => {
    confirmAction({
      title: 'Xóa giỏ hàng',
      message: 'Bạn có chắc chắn muốn xóa toàn bộ sản phẩm?',
      confirmLabel: 'Xóa tất cả',
      destructive: true,
      onConfirm: clearCart,
    });
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <EmptyState
          icon="cart-outline"
          title="Giỏ hàng đang trống"
          description="Hãy chọn một số sản phẩm và thêm vào giỏ hàng nhé."
          actionLabel="Tiếp tục mua sắm"
          onAction={() => router.replace('/')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tiêu đề & nút xóa tất cả */}
        <View style={styles.header}>
          <Text style={styles.title}>Sản phẩm trong giỏ ({items.length})</Text>
          <Pressable onPress={handleClear} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
            <Text style={styles.clearBtnText}>Xóa tất cả</Text>
          </Pressable>
        </View>

        {/* Danh sách món hàng */}
        <View style={styles.list}>
          {items.map((item) => {
            const product = getProductById(item.productId);
            const imageSource = product ? getProductImageSource(product) : undefined;

            return (
              <View key={item.productId} style={styles.cartItem}>
                <View style={styles.itemImageWrap}>
                  {imageSource ? (
                    <Image source={imageSource} style={styles.itemImage} resizeMode="contain" />
                  ) : (
                    <Ionicons name="image-outline" size={24} color={colors.textMuted} />
                  )}
                </View>

                <View style={styles.itemInfo}>
                  <Text numberOfLines={2} style={styles.itemName}>
                    {product?.name ?? 'Sản phẩm không tồn tại'}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {product ? formatPrice(product.price) : '--'}
                  </Text>

                  {/* Tăng / Giảm số lượng */}
                  <View style={styles.actionRow}>
                    <View style={styles.quantityControl}>
                      <Pressable
                        onPress={() => setQuantity(item.productId, item.quantity - 1)}
                        style={styles.qtyBtn}
                        accessibilityRole="button"
                        accessibilityLabel={`Giảm số lượng ${product?.name ?? ''}`}
                      >
                        <Ionicons name="remove" size={14} color={colors.text} />
                      </Pressable>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <Pressable
                        onPress={() => setQuantity(item.productId, item.quantity + 1)}
                        style={styles.qtyBtn}
                        accessibilityRole="button"
                        accessibilityLabel={`Tăng số lượng ${product?.name ?? ''}`}
                      >
                        <Ionicons name="add" size={14} color={colors.text} />
                      </Pressable>
                    </View>

                    <Pressable
                      onPress={() => removeItem(item.productId)}
                      style={styles.removeBtn}
                      accessibilityRole="button"
                      accessibilityLabel={`Xóa ${product?.name ?? 'sản phẩm'} khỏi giỏ`}
                    >
                      <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Thanh thanh toán dưới cùng */}
      <View style={styles.footer}>
        <View style={styles.totalWrap}>
          <Text style={styles.totalLabel}>Tổng tạm tính:</Text>
          <Text style={styles.totalPrice}>{formatPrice(subtotal)}</Text>
        </View>

        <Pressable
          onPress={() => router.push('/checkout')}
          style={({ pressed }) => [styles.checkoutBtn, pressed && styles.pressed]}
        >
          <Text style={styles.checkoutBtnText}>Đặt hàng ngay</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </Pressable>
      </View>
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
    paddingBottom: 90,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearBtnText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    gap: spacing.sm,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  itemImageWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: '90%',
    height: '90%',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    paddingHorizontal: 8,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  removeBtn: {
    padding: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalWrap: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  checkoutBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
