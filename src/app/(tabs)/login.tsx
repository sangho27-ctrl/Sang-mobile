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
import { ADMIN_ACCOUNT, DEMO_ACCOUNT } from '@/constants/accounts';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing } from '@/theme';

export default function LoginScreen() {
  const { user, signIn } = useAuth();
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Chỉ chuyển hướng khi màn đăng nhập đang được hiển thị.
  useEffect(() => {
    if (user && pathname === '/login') {
      router.replace(user.role === 'admin' ? '/admin' : '/');
    }
  }, [user, pathname]);

  const fillAccount = (acc: { email: string; password: string }) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError(null);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await signIn(email, password);
      // Việc điều hướng được thực hiện trong useEffect khi user được cập nhật.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Đăng nhập không thành công.');
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
              <Ionicons name="storefront" size={28} color={colors.primary} />
            </View>
            <Text style={styles.title}>MiniShop</Text>
            <Text style={styles.subtitle}>Đăng nhập để tiếp tục mua sắm và quản lý</Text>
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
              label="Email"
              icon="mail-outline"
              placeholder="nhapemail@minishop.vn"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FormField
              label="Mật khẩu"
              icon="lock-closed-outline"
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Pressable
              onPress={handleLogin}
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
                <Text style={styles.submitButtonText}>Đăng nhập</Text>
              )}
            </Pressable>

            {/* Tài khoản mẫu */}
            <View style={styles.demoSection}>
              <Text style={styles.demoLabel}>Tài khoản thử nghiệm nhanh:</Text>
              <View style={styles.demoButtons}>
                <Pressable onPress={() => fillAccount(ADMIN_ACCOUNT)} style={styles.demoBtn}>
                  <Text style={styles.demoBtnText}>👑 Admin ({ADMIN_ACCOUNT.email})</Text>
                </Pressable>
                <Pressable onPress={() => fillAccount(DEMO_ACCOUNT)} style={styles.demoBtn}>
                  <Text style={styles.demoBtnText}>👤 User ({DEMO_ACCOUNT.email})</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Link sang Đăng ký */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Chưa có tài khoản?</Text>
            <Pressable onPress={() => router.push('/register')}>
              <Text style={styles.linkText}> Đăng ký ngay</Text>
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
    marginBottom: spacing.xl,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
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
  demoSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  demoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  demoButtons: {
    gap: 6,
  },
  demoBtn: {
    backgroundColor: colors.surfaceMuted,
    padding: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoBtnText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
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
