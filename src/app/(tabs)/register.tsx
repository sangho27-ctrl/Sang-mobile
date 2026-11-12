import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { FormField } from '@/components/FormField';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing } from '@/theme';
import { isValidEmail, isValidPhone } from '@/utils/validation';

export default function RegisterScreen() {
  const { user, signUp } = useAuth();
  const pathname = usePathname();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Chỉ chuyển hướng khi màn đăng ký đang được hiển thị.
  useEffect(() => {
    if (user && pathname === '/register') {
      router.replace(user.role === 'admin' ? '/admin' : '/');
    }
  }, [user, pathname]);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError('Vui lòng điền đầy đủ các thông tin.');
      return;
    }
    if (name.trim().length < 2) {
      setError('Họ và tên phải có ít nhất 2 ký tự.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Định dạng email không hợp lệ.');
      return;
    }
    if (!isValidPhone(phone)) {
      setError('Số điện thoại phải có 10 chữ số (bắt đầu bằng 0).');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await signUp({ name, email, phone, password });
      // Việc điều hướng được thực hiện trong useEffect khi user được cập nhật.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Đăng ký không thành công.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Ionicons name="person-add" size={26} color={colors.primary} />
            </View>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>Đăng ký thành viên MiniShop nhanh chóng</Text>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <FormField
              label="Họ và tên"
              icon="person-outline"
              placeholder="Nguyễn Văn A"
              value={name}
              onChangeText={setName}
            />

            <FormField
              label="Email"
              icon="mail-outline"
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FormField
              label="Số điện thoại"
              icon="call-outline"
              placeholder="0901234567"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <FormField
              label="Mật khẩu"
              icon="lock-closed-outline"
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <FormField
              label="Xác nhận mật khẩu"
              icon="shield-checkmark-outline"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <Pressable
              onPress={handleRegister}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.submitButton,
                isLoading && styles.buttonDisabled,
                pressed && styles.pressed,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Đăng ký ngay</Text>
              )}
            </Pressable>
          </View>

          {/* Link sang Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Đã có tài khoản?</Text>
            <Pressable onPress={() => router.push('/login')}>
              <Text style={styles.linkText}> Đăng nhập</Text>
            </Pressable>
          </View>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
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
    fontSize: 13,
    color: colors.danger,
    flex: 1,
  },
  submitButton: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
});
