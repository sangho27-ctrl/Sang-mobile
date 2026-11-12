import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertBanner } from '@/components/AlertBanner';
import { FormField } from '@/components/FormField';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing } from '@/theme';
import { isValidPhone } from '@/utils/validation';

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const nextErrors: typeof errors = {};
    if (name.trim().length < 2) {
      nextErrors.name = 'Họ tên phải có ít nhất 2 ký tự.';
    }
    if (!phone.trim()) {
      nextErrors.phone = 'Vui lòng nhập số điện thoại.';
    } else if (!isValidPhone(phone)) {
      nextErrors.phone = 'Số điện thoại phải gồm 10 chữ số, bắt đầu bằng 0.';
    }

    setErrors(nextErrors);
    setFormError(null);
    setSuccess(null);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({ name, phone });
      setSuccess('Thông tin tài khoản đã được cập nhật thành công.');
    } catch (saveError) {
      setFormError(
        saveError instanceof Error
          ? saveError.message
          : 'Không thể cập nhật thông tin. Vui lòng thử lại.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.title}>Cập nhật thông tin</Text>
              <Text style={styles.subtitle}>Thay đổi họ tên và số điện thoại</Text>
            </View>
          </View>

          {formError ? <AlertBanner message={formError} style={styles.banner} /> : null}

          {success ? (
            <AlertBanner message={success} tone="success" style={styles.banner} />
          ) : null}

          <View style={styles.card}>
            <FormField
              label="Họ và tên"
              icon="person-outline"
              placeholder="Nguyễn Văn An"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              error={errors.name}
              returnKeyType="next"
            />
            <FormField
              label="Số điện thoại"
              icon="call-outline"
              placeholder="0901234567"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              error={errors.phone}
              returnKeyType="done"
              onSubmitEditing={() => void handleSave()}
            />

            <View style={styles.readonlyField}>
              <View style={styles.readonlyIcon}>
                <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
              </View>
              <View style={styles.readonlyText}>
                <Text style={styles.readonlyLabel}>Email (không thể thay đổi)</Text>
                <Text style={styles.readonlyValue} numberOfLines={1}>
                  {user?.email ?? 'Chưa cập nhật'}
                </Text>
              </View>
              <Ionicons name="lock-closed-outline" size={15} color={colors.textMuted} />
            </View>
          </View>

          <Pressable
            onPress={() => void handleSave()}
            disabled={isSaving}
            style={({ pressed }) => [
              styles.saveButton,
              isSaving && styles.buttonDisabled,
              pressed && styles.pressed,
            ]}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.saveButtonText}>Lưu thông tin</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={styles.cancelButton}
            accessibilityRole="button"
          >
            <Text style={styles.cancelText}>Quay lại trang tài khoản</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  banner: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  avatar: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
  },
  card: {
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  readonlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  readonlyIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: colors.surface,
  },
  readonlyText: {
    flex: 1,
    minWidth: 0,
  },
  readonlyLabel: {
    fontSize: 9.5,
    color: colors.textMuted,
  },
  readonlyValue: {
    marginTop: 2,
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    marginTop: spacing.sm,
  },
  cancelText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
