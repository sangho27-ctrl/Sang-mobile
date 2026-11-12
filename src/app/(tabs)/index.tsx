import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategorySelector } from '@/components/CategorySelector';
import { EmptyState } from '@/components/EmptyState';
import { ProductCard } from '@/components/ProductCard';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useCatalog } from '@/context/CatalogContext';
import { useFavorites } from '@/context/FavoritesContext';
import { colors, radius, spacing } from '@/theme';
import { getInitials, normalizeText } from '@/utils/format';

type PriceRange = {
  id: string;
  label: string;
  min: number;
  max: number;
};

const PRICE_RANGES: PriceRange[] = [
  { id: 'all', label: 'Tất cả giá', min: 0, max: Number.POSITIVE_INFINITY },
  { id: 'under8', label: 'Dưới 8 triệu', min: 0, max: 8_000_000 },
  { id: '8to20', label: '8 - 20 triệu', min: 8_000_000, max: 20_000_000 },
  { id: '20to30', label: '20 - 30 triệu', min: 20_000_000, max: 30_000_000 },
  { id: 'over30', label: 'Trên 30 triệu', min: 30_000_000, max: Number.POSITIVE_INFINITY },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const { products, getCategory } = useCatalog();
  const { itemCount } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const [priceRangeId, setPriceRangeId] = useState('all');

  const selectedPriceRange =
    PRICE_RANGES.find((range) => range.id === priceRangeId) ?? PRICE_RANGES[0];

  // Lọc sản phẩm theo từ khóa (tên, mô tả, danh mục) và khoảng giá
  const keyword = normalizeText(query);
  const filteredProducts = products.filter((product) => {
    const matchesKeyword =
      !keyword ||
      normalizeText(product.name).includes(keyword) ||
      normalizeText(product.shortDescription).includes(keyword) ||
      normalizeText(getCategory(product.categoryId).name).includes(keyword);
    const matchesPrice =
      product.price >= selectedPriceRange.min &&
      product.price <= selectedPriceRange.max;
    return matchesKeyword && matchesPrice;
  });

  const isFiltering = Boolean(query) || priceRangeId !== 'all';

  const openProduct = (productId: string) => {
    router.push({ pathname: '/product/[id]', params: { id: productId } });
  };

  const openCategory = (categoryId: string) => {
    router.push({
      pathname: '/category/[categoryId]',
      params: { categoryId },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header trên cùng */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{user ? 'Xin chào,' : 'Chào mừng đến'}</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name ?? 'MiniShop'}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              onPress={() => router.push(user ? '/cart' : '/login')}
              style={styles.cartBtn}
              accessibilityLabel={`Giỏ hàng có ${itemCount} món`}
            >
              <Ionicons name="cart-outline" size={22} color={colors.primary} />
              {itemCount > 0 ? (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{itemCount > 99 ? '99+' : itemCount}</Text>
                </View>
              ) : null}
            </Pressable>

            <Pressable
              onPress={() => router.navigate(user ? '/profile' : '/login')}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{getInitials(user?.name ?? 'MiniShop')}</Text>
            </Pressable>
          </View>
        </View>

        {/* Thanh tìm kiếm theo tên hoặc danh mục */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên sản phẩm hoặc danh mục..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        {/* Banner khuyến mãi đơn giản */}
        <Pressable
          onPress={() => openCategory('accessory')}
          style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
        >
          <View style={styles.bannerInfo}>
            <View style={styles.bannerTag}>
              <Text style={styles.bannerTagText}>⚡ ƯU ĐÃI ĐẶC BIỆT</Text>
            </View>
            <Text style={styles.bannerTitle}>Giảm giá đến 30%</Text>
            <Text style={styles.bannerDesc}>Phụ kiện công nghệ chính hãng</Text>
          </View>
          <Ionicons name="gift-outline" size={48} color={colors.white} />
        </Pressable>

        {/* Menu điều hướng: Home, Danh mục sản phẩm */}
        <View style={styles.navMenu}>
          <Pressable
            onPress={() => router.navigate('/')}
            style={[styles.navItem, styles.navItemActive]}
          >
            <Ionicons name="home" size={15} color={colors.white} />
            <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
          </Pressable>
          <Pressable
            onPress={() => router.navigate('/categories')}
            style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}
          >
            <Ionicons name="grid-outline" size={15} color={colors.primary} />
            <Text style={styles.navText}>Danh mục sản phẩm</Text>
          </Pressable>
        </View>

        {/* Lọc sản phẩm theo khoảng giá */}
        <View style={styles.priceFilter}>
          <View style={styles.priceHeader}>
            <Ionicons name="pricetag-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.priceTitle}>Lọc theo khoảng giá</Text>
            {priceRangeId !== 'all' ? (
              <Pressable onPress={() => setPriceRangeId('all')} hitSlop={6}>
                <Text style={styles.clearFilterText}>Bỏ lọc</Text>
              </Pressable>
            ) : null}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.priceChips}
          >
            {PRICE_RANGES.map((range) => {
              const active = range.id === priceRangeId;
              return (
                <Pressable
                  key={range.id}
                  onPress={() => setPriceRangeId(range.id)}
                  style={[styles.priceChip, active && styles.priceChipActive]}
                >
                  <Text style={[styles.priceChipText, active && styles.priceChipTextActive]}>
                    {range.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Danh mục sản phẩm */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh mục</Text>
            <Pressable onPress={() => router.navigate('/categories')}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </Pressable>
          </View>
          <CategorySelector onSelect={openCategory} />
        </View>

        {/* Danh sách sản phẩm */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isFiltering
                ? `Kết quả lọc (${filteredProducts.length})`
                : 'Sản phẩm nổi bật'}
            </Text>
          </View>

          {isFiltering ? (
            <Text style={styles.activeFilterText}>
              {query ? `Từ khóa: "${query}"` : 'Từ khóa: tất cả'}
              {'  ·  '}
              {selectedPriceRange.label}
            </Text>
          ) : null}

          {filteredProducts.length > 0 ? (
            <View style={styles.productGrid}>
              {filteredProducts.map((p) => (
                <View key={p.id} style={styles.gridItem}>
                  <ProductCard
                    product={p}
                    onPress={() => openProduct(p.id)}
                    isFavorite={isFavorite(p.id)}
                    onToggleFavorite={() => toggleFavorite(p.id)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              icon="search-outline"
              title="Không tìm thấy sản phẩm"
              description="Hãy thử từ khóa khác hoặc xóa bộ lọc tìm kiếm/giá."
              actionLabel="Xóa bộ lọc"
              onAction={() => {
                setQuery('');
                setPriceRangeId('all');
              }}
            />
          )}
        </View>
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
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cartBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  banner: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
    marginBottom: 4,
  },
  bannerTagText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
  },
  bannerDesc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 2,
  },
  navMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  navText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  navTextActive: {
    color: colors.white,
  },
  priceFilter: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  priceTitle: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.text,
  },
  clearFilterText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  priceChips: {
    gap: 6,
  },
  priceChip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  priceChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  priceChipTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  activeFilterText: {
    marginBottom: spacing.sm,
    fontSize: 11,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridItem: {
    width: '47.5%',
  },
  pressed: {
    opacity: 0.85,
  },
});
