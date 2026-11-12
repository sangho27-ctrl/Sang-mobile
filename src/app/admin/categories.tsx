import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertBanner } from '@/components/AlertBanner';
import { Header } from '@/components/Header';
import { useCatalog } from '@/context/CatalogContext';
import { cardShadow, colors, radius, spacing } from '@/theme';
import { confirmAction } from '@/utils/confirm';

export default function AdminCategoriesScreen() {
  const { categories, deleteCategory, countProductsByCategory } = useCatalog();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleDelete = (id: string, name: string) => {
    confirmAction({
      title: 'Xóa danh mục',
      message: `Bạn có chắc muốn xóa danh mục "${name}"? Danh mục chỉ có thể xóa khi không còn sản phẩm.`,
      confirmLabel: 'Xóa',
      destructive: true,
      onConfirm: () => {
        setError(null);
        setNotice(null);
        setBusyId(id);
        void deleteCategory(id)
          .then(() => setNotice(`Đã xóa danh mục ${name}.`))
          .catch((deleteError: unknown) => {
            setError(
              deleteError instanceof Error
                ? deleteError.message
                : 'Không thể xóa danh mục. Vui lòng thử lại.',
            );
          })
          .finally(() => setBusyId(null));
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header subtitle="Quản lý loại sản phẩm" />

        <Pressable
          onPress={() => router.push('/admin/category-form')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        >
          <Ionicons name="add-circle-outline" size={19} color={colors.white} />
          <Text style={styles.addButtonText}>Thêm loại sản phẩm</Text>
        </Pressable>

        {error ? <AlertBanner message={error} style={styles.banner} /> : null}

        {notice ? (
          <AlertBanner message={notice} tone="success" style={styles.banner} />
        ) : null}

        <View style={styles.summaryRow}>
          <Text style={styles.sectionTitle}>Danh sách loại sản phẩm</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{categories.length}</Text>
          </View>
        </View>

        {categories.map((category) => {
          const productCount = countProductsByCategory(category.id);
          const isBusy = busyId === category.id;

          return (
            <View key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryTop}>
                <View style={[styles.categoryIcon, { backgroundColor: category.softColor }]}>
                  <Ionicons name={category.icon} size={25} color={category.color} />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription} numberOfLines={2}>
                    {category.description}
                  </Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="cube-outline" size={12} color={colors.textMuted} />
                    <Text style={styles.categoryMeta}>{productCount} sản phẩm</Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/admin/category-form',
                      params: { id: category.id },
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Sửa danh mục ${category.name}`}
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
                  onPress={() => handleDelete(category.id, category.name)}
                  disabled={isBusy}
                  accessibilityRole="button"
                  accessibilityLabel={`Xóa danh mục ${category.name}`}
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

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/admin/product-form',
                    params: { categoryId: category.id },
                  })
                }
                accessibilityRole="button"
                accessibilityLabel={`Thêm sản phẩm cho loại ${category.name}`}
                style={({ pressed }) => [styles.addProductButton, pressed && styles.pressed]}
              >
                <Ionicons name="add-outline" size={16} color={colors.primary} />
                <Text style={styles.addProductText}>Thêm sản phẩm cho loại này</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.primary} />
              </Pressable>
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
  banner: {
    marginTop: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
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
    backgroundColor: colors.accentSoft,
  },
  countText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
  },
  categoryCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  categoryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  categoryIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
  categoryInfo: {
    flex: 1,
    minWidth: 0,
  },
  categoryName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: colors.text,
  },
  categoryDescription: {
    marginTop: 2,
    fontSize: 10.5,
    lineHeight: 15,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  categoryMeta: {
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
    minHeight: 38,
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
  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 40,
    marginTop: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#C7D2FE',
    backgroundColor: '#F8FAFF',
  },
  addProductText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});
