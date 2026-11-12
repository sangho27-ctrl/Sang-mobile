import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCatalog } from '@/context/CatalogContext';
import { ALL_CATEGORY, type CategoryOption, type FilterCategoryId } from '@/data/categories';
import { colors, radius, spacing } from '@/theme';

type CategorySelectorProps = {
  selectedId?: FilterCategoryId;
  onSelect: (categoryId: FilterCategoryId) => void;
  variant?: 'chips' | 'grid';
  showAll?: boolean;
};

export function CategorySelector({
  selectedId,
  onSelect,
  variant = 'chips',
  showAll = true,
}: CategorySelectorProps) {
  const { categories, countProductsByCategory } = useCatalog();
  const options: CategoryOption[] = showAll ? [ALL_CATEGORY, ...categories] : categories;

  // Dạng Lưới (Grid) - dùng trong trang Danh mục
  if (variant === 'grid') {
    return (
      <View style={styles.gridContainer}>
        {options.map((option) => {
          const count = countProductsByCategory(option.id);
          const isSelected = selectedId === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              style={({ pressed }) => [
                styles.gridCard,
                isSelected && styles.cardSelected,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.gridIconBox, { backgroundColor: option.softColor }]}>
                <Ionicons name={option.icon} size={24} color={option.color} />
              </View>
              <Text style={styles.gridName}>{option.name}</Text>
              <Text style={styles.gridCount}>{count} sản phẩm</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  // Dạng Cuộn Ngang (Horizontal Chips) - dùng trên Trang chủ và Bộ lọc
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollList}
    >
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => onSelect(option.id)}
            style={({ pressed }) => [
              styles.chip,
              isSelected && styles.chipSelected,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={option.icon}
              size={16}
              color={isSelected ? colors.white : option.color}
            />
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {option.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Horizontal Chips
  scrollList: {
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },

  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridCard: {
    width: '47.5%',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  gridIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  gridName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  gridCount: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },

  pressed: {
    opacity: 0.7,
  },
});
