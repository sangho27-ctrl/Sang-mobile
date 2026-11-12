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
import { AlertBanner } from '@/components/AlertBanner';
import { Header } from '@/components/Header';
import { ProductImage } from '@/components/ProductImage';
import { useCatalog } from '@/context/CatalogContext';
import { cardShadow, colors, radius, spacing } from '@/theme';
import { confirmAction } from '@/utils/confirm';
import { formatPrice, normalizeText } from '@/utils/format';

export default function AdminProductsScreen() {
  const { products, deleteProduct, getCategory } = useCatalog();
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const keyword = normalizeText(query);
  const filteredProducts = !keyword
    ? products
    : products.filter((product) => {
        const category = getCategory(product.categoryId);
        return (
          normalizeText(product.name).includes(keyword) ||
          normalizeText(category.name).includes(keyword)
        );
      });

  const handleDelete = (id: string, name: string) => {
    confirmAction({
      title: 'Xóa sản phẩm',
      message: `Bạn có chắc muốn xóa sản phẩm "${name}" khỏi cửa hàng?`,
      confirmLabel: 'Xóa',
      destructive: true,
      onConfirm: () => {
        setError(null);
        setNotice(null);
        setBusyId(id);
        void deleteProduct(id)
          .then(() => setNotice(`Đã xóa sản phẩm ${name}.`))
          .catch((deleteError: unknown) => {
            setError(
              deleteError instanceof Error
                ? deleteError.message
                : 'Không thể xóa sản phẩm. Vui lòng thử lại.',
            );
          })
          .finally(() => setBusyId(null));
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Header subtitle="Quản lý toàn bộ sản phẩm" />

        <Pressable
          onPress={() => router.push('/admin/product-form')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        >
          <Ionicons name="add-circle-outline" size={19} color={colors.white} />
          <Text style={styles.addButtonText}>Thêm sản phẩm</Text>
        </Pressable>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm theo tên sản phẩm hoặc danh mục..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            accessibilityLabel="Tìm sản phẩm quản trị"
          />
          {query ? (
            <Pressable
              onPress={() => setQuery('')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Xóa tìm kiếm"
            >
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        {error ? <AlertBanner message={error} style={styles.banner} /> : null}

        {notice ? (
          <AlertBanner message={notice} tone="success" style={styles.banner} />
        ) : null}

        <View style={styles.summaryRow}>
          <Text style={styles.sectionTitle}>Danh sách sản phẩm</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{filteredProducts.length}</Text>
          </View>
        </View>

        {filteredProducts.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="cube-outline" size={42} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Không có sản phẩm</Text>
            <Text style={styles.emptyText}>
              {query
                ? 'Không tìm thấy sản phẩm phù hợp. Hãy thử từ khóa khác.'
                : 'Cửa hàng chưa có sản phẩm. Hãy thêm sản phẩm đầu tiên.'}
            </Text>
          </View>
        ) : null}

        {filteredProducts.map((product) => {
          const category = getCategory(product.categoryId);
          const isBusy = busyId === product.id;

          return (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productTop}>
                <View style={styles.thumb}>
                  <ProductImage product={product} iconSize={24} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <View style={styles.categoryPill}>
                    <Ionicons name={category.icon} size={11} color={category.color} />
                    <Text style={[styles.categoryText, { color: category.color }]}>
                      {category.name}
                    </Text>
                  </View>
                  <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
                  <Text style={styles.productMeta}>
                    Đã bán {product.sold} · ⭐ {product.rating.toFixed(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/admin/product-form',
                      params: { id: product.id },
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Sửa sản phẩm ${product.name}`}
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.editButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="create-outline" size={15} color={colors.primary} />
                  <Text style={styles.editButtonText}>Sửa</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleDelete(product.id, product.name)}
                  disabled={isBusy}
                  accessibilityRole="button"
                  accessibilityLabel={`Xóa sản phẩm ${product.name}`}
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.deleteButton,
                    pressed && !isBusy && styles.pressed,
                    isBusy && styles.disabled,
                  ]}
                >
                  <Ionicons name="trash-outline" size={15} color={colors.danger} />
                  <Text style={styles.deleteButtonText}>Xóa</Text>
                </Pressable>
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    minHeight: 48,
    marginTop: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  addButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 46,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 9,
    fontSize: 12.5,
    color: colors.text,
  },
  banner: {
    marginTop: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  countPill: {
    minWidth: 30,
    height: 26,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: colors.successSoft,
  },
  countText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.success,
  },
  empty: {
    alignItems: 'center',
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
    marginTop: 5,
    fontSize: 11.5,
    lineHeight: 17,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  productCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  productTop: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  thumb: {
    width: 88,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  productInfo: {
    flex: 1,
    minWidth: 0,
  },
  productName: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.text,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  categoryText: {
    fontSize: 8.5,
    fontWeight: '700',
  },
  productPrice: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  productMeta: {
    marginTop: 2,
    fontSize: 9.5,
    color: colors.textMuted,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    minHeight: 37,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  editButton: {
    borderColor: '#C7D2FE',
    backgroundColor: colors.primarySoft,
  },
  editButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  deleteButton: {
    borderColor: '#FEE4E2',
    backgroundColor: colors.dangerSoft,
  },
  deleteButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.danger,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});
