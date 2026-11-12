import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { getProductImageSource, type Product } from '@/data/products';
import { colors, radius, spacing } from '@/theme';
import { discountPercent, formatPrice, formatSold } from '@/utils/format';

type ProductCardProps = {
  product: Product;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ProductCard({
  product,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  style,
}: ProductCardProps) {
  const imageSource = getProductImageSource(product);
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}
    >
      {/* Khung ảnh & Nút yêu thích */}
      <View style={styles.imageWrap}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={28} color={colors.textMuted} />
          </View>
        )}

        {product.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        ) : null}

        {onToggleFavorite ? (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            hitSlop={8}
            style={styles.favoriteButton}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorite ? colors.primary : colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {/* Thông tin sản phẩm */}
      <View style={styles.body}>
        <Text numberOfLines={2} style={styles.name}>
          {product.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {product.originalPrice ? (
            <Text style={styles.originalPrice}>{formatPrice(product.originalPrice)}</Text>
          ) : null}
        </View>

        <View style={styles.metaRow}>
          {discount ? (
            <View style={styles.discountTag}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          ) : null}
          <View style={styles.rating}>
            <Ionicons name="star" size={11} color={colors.star} />
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.sold}>Đã bán {formatSold(product.sold)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.white,
  },
  favoriteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    minHeight: 34,
    lineHeight: 17,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 10,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  discountTag: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  discountText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sold: {
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 'auto',
  },
});
