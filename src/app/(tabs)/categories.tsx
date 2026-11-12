import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategorySelector } from '@/components/CategorySelector';
import { useCatalog } from '@/context/CatalogContext';
import { colors, spacing } from '@/theme';

export default function CategoriesScreen() {
  const { categories, products } = useCatalog();

  const openCategory = (categoryId: string) => {
    router.push({
      pathname: '/category/[categoryId]',
      params: { categoryId },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Danh mục sản phẩm</Text>
          <Text style={styles.subtitle}>
            {categories.length} danh mục · {products.length} sản phẩm
          </Text>
        </View>

        <CategorySelector variant="grid" onSelect={openCategory} />
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
    marginBottom: spacing.md,
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
});
