import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useCatalog } from '@/context/CatalogContext';
import { useFavorites } from '@/context/FavoritesContext';
import { getProductImageSource } from '@/data/products';
import { colors, radius, spacing } from '@/theme';
import { discountPercent, formatPrice, formatSold } from '@/utils/format';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const { getProductById, getCategory } = useCatalog();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const insets = useSafeAreaInsets();
  const [addedNotice, setAddedNotice] = useState(false);

  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Sản phẩm' }} />
        <EmptyState
          icon="cube-outline"
          title="Không tìm thấy sản phẩm"
          description="Sản phẩm này có thể đã bị xoá hoặc không tồn tại."
          actionLabel="Về trang chủ"
          onAction={() => router.replace('/')}
        />
      </SafeAreaView>
    );
  }

  const category = getCategory(product.categoryId);
  const favorite = isFavorite(product.id);
  const discount = discountPercent(product.price, product.originalPrice);
  const imageSource = getProductImageSource(product);

  const handleAddToCart = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    addItem(product.id);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    addItem(product.id);
    router.push('/checkout');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Khung ảnh & Nút điều hướng */}
        <View style={styles.imageContainer}>
          {imageSource ? (
            <Image source={imageSource} style={styles.productImage} resizeMode="contain" />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={60} color={colors.textMuted} />
            </View>
          )}

          {/* Top Bar Nút Back và Yêu thích */}
          <View style={[styles.topBar, { top: insets.top + 6 }]}>
            <Pressable
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
              style={styles.iconCircle}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </Pressable>
            <Pressable onPress={() => toggleFavorite(product.id)} style={styles.iconCircle}>
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={20}
                color={favorite ? colors.primary : colors.text}
              />
            </Pressable>
          </View>
        </View>

        {/* Nội dung chi tiết */}
        <View style={styles.contentCard}>
          {/* Tag danh mục */}
          <View style={styles.categoryRow}>
            <View style={[styles.categoryPill, { backgroundColor: category.softColor }]}>
              <Ionicons name={category.icon} size={14} color={category.color} />
              <Text style={[styles.categoryText, { color: category.color }]}>{category.name}</Text>
            </View>
            <Text style={styles.stockText}>• Còn hàng</Text>
          </View>

          {/* Tên sản phẩm */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Đánh giá và số lượng bán */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.star} />
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            <Text style={styles.reviewText}>({product.reviewCount} đánh giá)</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.soldText}>Đã bán {formatSold(product.sold)}</Text>
          </View>

          {/* Giá tiền & Giảm giá */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {product.originalPrice ? (
              <Text style={styles.originalPrice}>{formatPrice(product.originalPrice)}</Text>
            ) : null}
            {discount ? (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discount}%</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.divider} />

          {/* Mô tả */}
          <Text style={styles.sectionHeading}>Mô tả sản phẩm</Text>
          <Text style={styles.descriptionText}>{product.description || product.shortDescription}</Text>

          {/* Màu sắc nếu có */}
          {product.colors && product.colors.length > 0 ? (
            <View style={styles.specSection}>
              <Text style={styles.sectionHeading}>Màu sắc</Text>
              <View style={styles.colorRow}>
                {product.colors.map((c) => (
                  <View key={c.name} style={styles.colorChip}>
                    <View style={[styles.colorDot, { backgroundColor: c.hex }]} />
                    <Text style={styles.colorName}>{c.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* Thông số kỹ thuật nếu có */}
          {product.specs && product.specs.length > 0 ? (
            <View style={styles.specSection}>
              <Text style={styles.sectionHeading}>Thông số kỹ thuật</Text>
              <View style={styles.specTable}>
                {product.specs.map((item, idx) => (
                  <View key={item.label} style={[styles.specRow, idx % 2 === 1 && styles.specRowAlt]}>
                    <Text style={styles.specLabel}>{item.label}</Text>
                    <Text style={styles.specValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Thông báo thêm giỏ hàng thành công */}
      {addedNotice ? (
        <View style={[styles.addedToast, { bottom: insets.bottom + 70 }]}>
          <Ionicons name="checkmark-circle" size={18} color={colors.white} />
          <Text style={styles.addedToastText}>Đã thêm vào giỏ hàng!</Text>
        </View>
      ) : null}

      {/* Bottom Bar: Nút mua hàng */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable onPress={handleAddToCart} style={styles.addToCartBtn}>
          <Ionicons name="cart-outline" size={20} color={colors.primary} />
          <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
        </Pressable>

        <Pressable onPress={handleBuyNow} style={styles.buyNowBtn}>
          <Text style={styles.buyNowText}>Mua ngay</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  imageContainer: {
    width: '100%',
    height: 320,
    backgroundColor: colors.surface,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '85%',
    height: '85%',
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  contentCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    marginTop: -12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.xs,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stockText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 24,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  reviewText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  dot: {
    color: colors.textMuted,
    fontSize: 12,
  },
  soldText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: spacing.md,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  specSection: {
    marginTop: spacing.lg,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  colorName: {
    fontSize: 12,
    color: colors.text,
  },
  specTable: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
    marginTop: 6,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  specRowAlt: {
    backgroundColor: colors.surfaceMuted,
  },
  specLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  specValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
  addedToast: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  addedToastText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  addToCartBtn: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addToCartText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  buyNowBtn: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
