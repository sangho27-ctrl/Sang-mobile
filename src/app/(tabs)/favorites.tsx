import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { ProductCard } from '@/components/ProductCard';
import { useCatalog } from '@/context/CatalogContext';
import { useFavorites } from '@/context/FavoritesContext';
import { colors, spacing } from '@/theme';

export default function FavoritesScreen() {
  const { products } = useCatalog();
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();
  const favoriteProducts = products.filter((product) => favoriteIds.includes(product.id));

  const openProduct = (productId: string) => {
    router.push({ pathname: '/product/[id]', params: { id: productId } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Yêu thích</Text>
          <Text style={styles.subtitle}>
            {favoriteProducts.length > 0
              ? `${favoriteProducts.length} sản phẩm bạn đã lưu`
              : 'Những sản phẩm bạn muốn mua sau'}
          </Text>
        </View>
        {favoriteProducts.length > 0 ? (
          <View style={styles.countPill}>
            <Text style={styles.countText}>{favoriteProducts.length}</Text>
          </View>
        ) : null}
      </View>

      {favoriteProducts.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="heart-outline"
            title="Chưa có sản phẩm yêu thích"
            description="Chạm biểu tượng trái tim trên sản phẩm hoặc trong trang chi tiết để lưu lại tại đây."
            actionLabel="Khám phá sản phẩm"
            onAction={() => router.navigate('/')}
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => openProduct(product.id)}
                isFavorite={isFavorite(product.id)}
                onToggleFavorite={() => toggleFavorite(product.id)}
                style={styles.gridCard}
              />
            ))}
          </View>
          <Text style={styles.hint}>Chạm trái tim lần nữa để bỏ khỏi danh sách yêu thích.</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12.5,
    color: colors.textSecondary,
  },
  countPill: {
    minWidth: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: colors.dangerSoft,
  },
  countText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.danger,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.lg,
  },
  gridCard: {
    width: '48%',
  },
  hint: {
    marginTop: spacing.xxl,
    fontSize: 11,
    textAlign: 'center',
    color: colors.textMuted,
  },
});
