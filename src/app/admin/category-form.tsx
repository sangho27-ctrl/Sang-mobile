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
import {
  CATEGORY_COLOR_PRESETS,
  CATEGORY_ICON_PRESETS,
  type IconName,
} from '@/data/categories';
import { colors, radius, spacing } from '@/theme';

export default function CategoryFormScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { categories, addCategory, updateCategory } = useCatalog();

  const editing = params.id ? categories.find((c) => c.id === params.id) : undefined;

  const [name, setName] = useState(editing?.name ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [icon, setIcon] = useState<IconName>(editing?.icon ?? CATEGORY_ICON_PRESETS[0].icon);
  const [color, setColor] = useState(editing?.color ?? CATEGORY_COLOR_PRESETS[0].color);
  const [softColor, setSoftColor] = useState(
    editing?.softColor ?? CATEGORY_COLOR_PRESETS[0].softColor,
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Vui lòng nhập tên danh mục.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      if (editing) {
        await updateCategory(editing.id, { name, description, icon, color, softColor });
      } else {
        await addCategory({ name, description, icon, color, softColor });
      }
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi khi lưu danh mục.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{editing ? 'Sửa loại sản phẩm' : 'Thêm loại sản phẩm mới'}</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <FormField
            label="Tên danh mục"
            icon="apps-outline"
            placeholder="Ví dụ: Điện thoại, Laptop..."
            value={name}
            onChangeText={setName}
          />

          <FormField
            label="Mô tả"
            placeholder="Mô tả ngắn danh mục..."
            value={description}
            onChangeText={setDescription}
            multiline
            minHeight={70}
          />

          {/* Chọn Icon */}
          <Text style={styles.label}>Biểu tượng (Icon)</Text>
          <View style={styles.iconRow}>
            {CATEGORY_ICON_PRESETS.map((preset) => {
              const selected = preset.icon === icon;
              return (
                <Pressable
                  key={preset.icon}
                  onPress={() => setIcon(preset.icon)}
                  style={[styles.iconBtn, selected && styles.iconBtnSelected]}
                >
                  <Ionicons
                    name={preset.icon}
                    size={22}
                    color={selected ? colors.primary : colors.textMuted}
                  />
                  <Text style={[styles.iconBtnText, selected && styles.iconBtnTextSelected]}>
                    {preset.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Chọn Màu */}
          <Text style={styles.label}>Màu chủ đạo</Text>
          <View style={styles.colorRow}>
            {CATEGORY_COLOR_PRESETS.map((preset) => {
              const selected = preset.color === color;
              return (
                <Pressable
                  key={preset.color}
                  onPress={() => {
                    setColor(preset.color);
                    setSoftColor(preset.softColor);
                  }}
                  style={[
                    styles.colorBtn,
                    { backgroundColor: preset.softColor },
                    selected && { borderColor: preset.color, borderWidth: 2 },
                  ]}
                >
                  <View style={[styles.colorDot, { backgroundColor: preset.color }]} />
                  <Text style={{ fontSize: 12, color: colors.text }}>{preset.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Preview nhỏ */}
          <View style={styles.previewBox}>
            <View style={[styles.previewIcon, { backgroundColor: softColor }]}>
              <Ionicons name={icon} size={24} color={color} />
            </View>
            <View>
              <Text style={styles.previewName}>{name || 'Tên danh mục'}</Text>
              <Text style={styles.previewDesc}>{description || 'Mô tả danh mục'}</Text>
            </View>
          </View>
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
            <Text style={styles.saveBtnText}>{editing ? 'Lưu cập nhật' : 'Tạo danh mục'}</Text>
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
    marginTop: 6,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  iconBtn: {
    width: '31%',
    alignItems: 'center',
    padding: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  iconBtnSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  iconBtnText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  iconBtnTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  colorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  previewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  previewIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  previewDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
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
