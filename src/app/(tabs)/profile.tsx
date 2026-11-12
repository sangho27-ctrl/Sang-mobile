import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing } from '@/theme';
import { confirmAction } from '@/utils/confirm';
import { formatDate, getInitials } from '@/utils/format';

type MenuItemProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle?: string;
  onPress: () => void;
  showBadge?: string;
};

function MenuItem({ icon, title, subtitle, onPress, showBadge }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
    >
      <View style={styles.menuIconBox}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.menuText}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle ? <Text style={styles.menuSubtitle}>{subtitle}</Text> : null}
      </View>
      {showBadge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{showBadge}</Text>
        </View>
      ) : null}
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    confirmAction({
      title: 'Đăng xuất',
      message: 'Bạn có chắc chắn muốn đăng xuất không?',
      confirmLabel: 'Đăng xuất',
      destructive: true,
      onConfirm: () => void signOut(),
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerWrap}>
          <Header subtitle="Thông tin người dùng đã đăng nhập" />
        </View>

        {/* Card thông tin người dùng */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user?.name ?? 'User')}</Text>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user?.name ?? 'Chưa đăng nhập'}</Text>
              {user?.role === 'admin' ? (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminBadgeText}>ADMIN</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.userEmail}>{user?.email}</Text>
            {user?.phone ? <Text style={styles.userPhone}>{user.phone}</Text> : null}
            {user?.createdAt ? (
              <Text style={styles.joinedDate}>Tham gia từ: {formatDate(user.createdAt)}</Text>
            ) : null}
          </View>
        </View>

        {/* Nhóm menu chức năng */}
        <View style={styles.menuGroup}>
          <Text style={styles.groupHeading}>Tài khoản & Đơn hàng</Text>

          <MenuItem
            icon="person-outline"
            title="Cập nhật thông tin cá nhân"
            subtitle="Đổi họ tên, số điện thoại"
            onPress={() => router.push('/profile/edit')}
          />

          <MenuItem
            icon="receipt-outline"
            title="Lịch sử đơn hàng"
            subtitle="Xem các đơn hàng đã đặt"
            onPress={() => router.push('/orders')}
          />

          <MenuItem
            icon="cart-outline"
            title="Giỏ hàng của bạn"
            onPress={() => router.push('/cart')}
          />

          <MenuItem
            icon="heart-outline"
            title="Sản phẩm yêu thích"
            onPress={() => router.push('/favorites')}
          />
        </View>

        {/* Khu vực Admin nếu là admin */}
        {user?.role === 'admin' ? (
          <View style={styles.menuGroup}>
            <Text style={styles.groupHeading}>Quản trị viên</Text>
            <MenuItem
              icon="shield-checkmark-outline"
              title="Trang quản trị MiniShop"
              subtitle="Quản lý người dùng, sản phẩm, danh mục"
              onPress={() => router.push('/admin')}
            />
          </View>
        ) : null}

        {/* Nút đăng xuất */}
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
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
    paddingBottom: spacing.xxl,
  },
  headerWrap: {
    marginBottom: spacing.lg,
  },
  userCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  adminBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userPhone: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  joinedDate: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  menuGroup: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  groupHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  menuSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
    marginRight: 6,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    height: 48,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.sm,
  },
  logoutText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
});
