import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { useCatalog } from '@/context/CatalogContext';
import { useOrders } from '@/context/OrdersContext';
import { cardShadow, colors, radius, spacing } from '@/theme';

type ManageButtonProps = {
  title: string;
  description: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  color: string;
  backgroundColor: string;
  count: string;
  onPress: () => void;
};

function ManageButton({
  title,
  description,
  icon,
  color,
  backgroundColor,
  count,
  onPress,
}: ManageButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.manageCard, pressed && styles.pressed]}
    >
      <View style={[styles.manageIcon, { backgroundColor }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.manageText}>
        <Text style={styles.manageTitle}>{title}</Text>
        <Text style={styles.manageDescription}>{description}</Text>
      </View>
      <View style={styles.manageMeta}>
        <Text style={styles.manageCount}>{count}</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

export default function AdminHomeScreen() {
  const { users } = useAuth();
  const { categories, products } = useCatalog();
  const { allOrders } = useOrders();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <View style={styles.heading}>
          <Text style={styles.eyebrow}>BẢNG ĐIỀU KHIỂN</Text>
          <Text style={styles.title}>Trang chủ quản trị</Text>
          <Text style={styles.subtitle}>
            Quản lý người dùng, danh mục và toàn bộ sản phẩm của MiniShop.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={18} color={colors.primary} />
            <Text style={styles.statValue}>{users.length}</Text>
            <Text style={styles.statLabel}>Người dùng</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="apps-outline" size={18} color={colors.accent} />
            <Text style={styles.statValue}>{categories.length}</Text>
            <Text style={styles.statLabel}>Danh mục</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cube-outline" size={18} color={colors.success} />
            <Text style={styles.statValue}>{products.length}</Text>
            <Text style={styles.statLabel}>Sản phẩm</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Chức năng quản trị</Text>

        <View style={styles.manageList}>
          <ManageButton
            title="Quản lý user"
            description="Xem, cập nhật vai trò và xóa người dùng"
            icon="people-outline"
            color={colors.primary}
            backgroundColor={colors.primarySoft}
            count={`${users.length} user`}
            onPress={() => router.push('/admin/users')}
          />
          <ManageButton
            title="Quản lý loại sản phẩm"
            description="Thêm, sửa, xóa danh mục và sản phẩm theo loại"
            icon="apps-outline"
            color={colors.accent}
            backgroundColor={colors.accentSoft}
            count={`${categories.length} loại`}
            onPress={() => router.push('/admin/categories')}
          />
          <ManageButton
            title="Quản lý sản phẩm"
            description="Thêm, sửa, xóa sản phẩm trong cửa hàng"
            icon="cube-outline"
            color={colors.success}
            backgroundColor={colors.successSoft}
            count={`${products.length} sản phẩm`}
            onPress={() => router.push('/admin/products')}
          />
          <ManageButton
            title="Quản lý đơn hàng"
            description="Xem danh sách và cập nhật tình trạng đơn hàng"
            icon="receipt-outline"
            color="#1570EF"
            backgroundColor="#EFF8FF"
            count={`${allOrders.length} đơn`}
            onPress={() => router.push('/admin/orders')}
          />
        </View>

        <Pressable
          onPress={() => router.navigate('/admin/user-home')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.storeLink, pressed && styles.pressed]}
        >
          <Ionicons name="storefront-outline" size={19} color={colors.primary} />
          <Text style={styles.storeLinkText}>Xem cửa hàng dưới góc nhìn người dùng</Text>
          <Ionicons name="arrow-forward" size={17} color={colors.primary} />
        </Pressable>

        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={19} color={colors.textSecondary} />
          <Text style={styles.noteText}>
            Tài khoản admin được khởi tạo tự động trong cơ sở dữ liệu cục bộ. Mọi thay đổi về
            danh mục và sản phẩm được lưu lại và hiển thị ngay trên cửa hàng.
          </Text>
        </View>
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  heading: {
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  eyebrow: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: colors.primary,
  },
  title: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12.5,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  statValue: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sectionTitle: {
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  manageList: {
    gap: spacing.md,
  },
  manageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  manageIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  manageText: {
    flex: 1,
    minWidth: 0,
  },
  manageTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: colors.text,
  },
  manageDescription: {
    marginTop: 3,
    fontSize: 10.5,
    lineHeight: 15,
    color: colors.textSecondary,
  },
  manageMeta: {
    alignItems: 'flex-end',
    gap: 5,
  },
  manageCount: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.textMuted,
  },
  storeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  storeLinkText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  noteCard: {
    flexDirection: 'row',
    gap: 9,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  noteText: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.75,
  },
});
