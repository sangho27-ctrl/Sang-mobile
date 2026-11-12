import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormField } from '@/components/FormField';
import { useCatalog } from '@/context/CatalogContext';
import { colors, radius, spacing } from '@/theme';

export default function ProductFormScreen() {
  const params = useLocalSearchParams<{ id?: string; categoryId?: string }>();
  const { products, categories, addProduct, updateProduct } = useCatalog();

  const editing = params.id ? products.find((p) => p.id === params.id) : undefined;

  const [name, setName] = useState(editing?.name ?? '');
  const [categoryId, setCategoryId] = useState(editing?.categoryId ?? params.categoryId ?? categories[0]?.id ?? '');
  const [price, setPrice] = useState(editing ? String(editing.price) : '');
  const [originalPrice, setOriginalPrice] = useState(
    editing?.originalPrice ? String(editing.originalPrice) : '',
  );
  const [imageUrl, setImageUrl] = useState(editing?.imageUrl ?? '');
  const [badge, setBadge] = useState(editing?.badge ?? '');
  const [shortDescription, setShortDescription] = useState(editing?.shortDescription ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const numPrice = Number(price.replace(/[^\d]/g, ''));
    const numOriginalPrice = originalPrice ? Number(originalPrice.replace(/[^\d]/g, '')) : undefined;

    if (!name.trim()) {
      setError('Vui lòng nhập tên sản phẩm.');
      return;
    }
    if (!categoryId) {
      setError('Vui lòng chọn danh mục cho sản phẩm.');
      return;
    }
    if (!numPrice || numPrice <= 0) {
      setError('Vui lòng nhập giá bán hợp lệ (> 0).');
      return;
    }
    if (!shortDescription.trim()) {
      setError('Vui lòng nhập mô tả ngắn.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const input = {
        name: name.trim(),
        categoryId,
        price: numPrice,
        originalPrice: numOriginalPrice,
        imageUrl: imageUrl.trim() || undefined,
        badge: badge.trim() || undefined,
        shortDescription: shortDescription.trim(),
        description: description.trim() || shortDescription.trim(),
      };

      if (editing) {
        await updateProduct(editing.id, input);
      } else {
        await addProduct(input);
      }

      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi khi lưu sản phẩm.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{editing ? 'Sửa thông tin sản phẩm' : 'Thêm sản phẩm mới'}</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <FormField
            label="Tên sản phẩm"
            icon="cube-outline"
            placeholder="Ví dụ: iPhone 15 Pro Max"
            value={name}
            onChangeText={setName}
          />

          {/* Chọn Danh mục */}
          <Text style={styles.label}>Loại sản phẩm (Danh mục)</Text>
          <View style={styles.categoryPicker}>
            {categories.map((c) => {
              const selected = c.id === categoryId;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setCategoryId(c.id)}
                  style={[styles.catOption, selected && styles.catOptionSelected]}
                >
                  <Ionicons
                    name={c.icon}
                    size={16}
                    color={selected ? colors.white : c.color}
                  />
                  <Text style={[styles.catOptionText, selected && styles.catOptionTextSelected]}>
                    {c.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <FormField
                label="Giá bán (₫)"
                icon="pricetag-outline"
                placeholder="Ví dụ: 25000000"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormField
                label="Giá gốc (₫)"
                icon="pricetags-outline"
                placeholder="Ví dụ: 28000000"
                value={originalPrice}
                onChangeText={setOriginalPrice}
                keyboardType="numeric"
              />
            </View>
          </View>

          <FormField
            label="Nhãn nổi bật (Badge - tùy chọn)"
            icon="ribbon-outline"
            placeholder="Ví dụ: HOT, MỚI, GIẢM GIÁ..."
            value={badge}
            onChangeText={setBadge}
          />

          <FormField
            label="Đường dẫn ảnh online (URL - tùy chọn)"
            icon="image-outline"
            placeholder="https://example.com/anh.jpg"
            value={imageUrl}
            onChangeText={setImageUrl}
            autoCapitalize="none"
          />

          <FormField
            label="Mô tả ngắn"
            placeholder="Tóm tắt đặc điểm nổi bật..."
            value={shortDescription}
            onChangeText={setShortDescription}
            multiline
            minHeight={60}
          />

          <FormField
            label="Mô tả chi tiết"
            placeholder="Chi tiết về sản phẩm..."
            value={description}
            onChangeText={setDescription}
            multiline
            minHeight={90}
          />
        </View>

        {/* Nút lưu */}
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          style={({ pressed }) => [
            styles.saveBtn,
            isSaving && styles.btnDisabled,
            pressed && styles.pressed,
          ]}
        >
          {isSaving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveBtnText}>{editing ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
          <Text style={styles.cancelBtnText}>Hủy bỏ</Text>
        </Pressable>
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
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.dangerSoft,
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  catOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  catOptionText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  catOptionTextSelected: {
    color: colors.white,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.8,
  },
});
