import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategorySelector } from '@/components/CategorySelector';
import { EmptyState } from '@/components/EmptyState';
import { ProductCard } from '@/components/ProductCard';
import { useCatalog } from '@/context/CatalogContext';
import { useFavorites } from '@/context/FavoritesContext';
import {
  isFilterCategoryId,
  type FilterCategoryId,
} from '@/data/categories';
import { colors, radius, spacing } from '@/theme';

export default function ProductListScreen() {
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const { getCategory, getProductsByCategory } = useCatalog();
  const routeCategory: FilterCategoryId = isFilterCategoryId(params.categoryId)
    ? params.categoryId
    : 'all';

  const { isFavorite, toggleFavorite } = useFavorites();
  const selectedId = routeCategory;
  const category = getCategory(selectedId);
  const products = getProductsByCategory(selectedId);

  const openProduct = (productId: string) => {
    router.push({ pathname: '/product/[id]', params: { id: productId } });
  };

  const selectCategory = (categoryId: FilterCategoryId) => {
    router.setParams({ categoryId });
  };

  return (
    <>
      <Stack.Screen
        options={{ title: selectedId === 'all' ? 'Tất cả sản phẩm' : category.name }}
      />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={[styles.summary, { backgroundColor: category.softColor }]}>
                <View style={styles.summaryIcon}>
                  <Ionicons name={category.icon} size={27} color={category.color} />
                </View>
                <View style={styles.summaryTextWrap}>
                  <Text style={[styles.summaryEyebrow, { color: category.color }]}>
                    DANH MỤC
                  </Text>
                  <Text style={styles.summaryTitle}>{category.name}</Text>
                  <Text style={styles.summaryDescription}>
                    {category.description} · {products.length} sản phẩm
                  </Text>
                </View>
              </View>

              <View style={styles.filterBlock}>
                <Text style={styles.filterLabel}>Lọc theo danh mục</Text>
                <CategorySelector selectedId={selectedId} onSelect={selectCategory} />
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultText}>{products.length} sản phẩm</Text>
                <View style={styles.sortPill}>
                  <Ionicons name="swap-vertical" size={13} color={colors.textSecondary} />
                  <Text style={styles.sortText}>Phổ biến</Text>
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => openProduct(item.id)}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              style={styles.card}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="cube-outline"
              title="Danh mục đang trống"
              description="Hiện chưa có sản phẩm nào trong danh mục này. Hãy quay lại sau nhé."
            />
          }
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
    flexGrow: 1,
  },
  column: {
    gap: spacing.md,
  },
  header: {
    paddingTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  summaryIcon: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  summaryTextWrap: {
    flex: 1,
  },
  summaryEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  summaryTitle: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  summaryDescription: {
    marginTop: 3,
    fontSize: 11.5,
    color: colors.textSecondary,
  },
  filterBlock: {
    marginTop: spacing.xl,
  },
  filterLabel: {
    marginBottom: spacing.sm,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  resultText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  card: {
    flex: 1,
  },
});
