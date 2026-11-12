import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ADMIN_ACCOUNT } from '@/constants/accounts';
import { useAuth } from '@/context/AuthContext';
import { cardShadow, colors, radius, spacing } from '@/theme';
import { getInitials } from '@/utils/format';

type HeaderProps = {
  subtitle?: string;
};

export function Header({ subtitle }: HeaderProps) {
  const { user, signOut } = useAuth();
  const isAdmin = user?.role === 'admin';
  const description = subtitle ?? (isAdmin ? 'Quản trị cửa hàng MiniShop' : 'Thông tin người dùng');

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(user?.name ?? 'Admin')}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {user?.name ?? 'Quản trị viên'}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user?.email ?? ADMIN_ACCOUNT.email}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {description}
        </Text>
      </View>

      <View style={styles.roleBadge}>
        <Ionicons
          name={isAdmin ? 'shield-checkmark' : 'person'}
          size={12}
          color={colors.primary}
        />
        <Text style={styles.roleText}>{isAdmin ? 'ADMIN' : 'USER'}</Text>
      </View>

      <Pressable
        onPress={() => {
          void signOut();
        }}
        style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Đăng xuất"
      >
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  avatar: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: colors.primary,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  email: {
    marginTop: 1,
    fontSize: 11,
    color: colors.textSecondary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 9.5,
    color: colors.textMuted,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  roleText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: colors.primary,
  },
  logoutButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.dangerSoft,
  },
  pressed: {
    opacity: 0.7,
  },
});
