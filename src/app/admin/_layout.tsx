import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontSize: 16, fontWeight: '700' },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="users" options={{ title: 'Quản lý người dùng' }} />
      <Stack.Screen name="categories" options={{ title: 'Quản lý loại sản phẩm' }} />
      <Stack.Screen name="category-form" options={{ title: 'Thông tin danh mục' }} />
      <Stack.Screen name="products" options={{ title: 'Quản lý sản phẩm' }} />
      <Stack.Screen name="product-form" options={{ title: 'Thông tin sản phẩm' }} />
      <Stack.Screen name="orders" options={{ title: 'Quản lý đơn hàng' }} />
    </Stack>
  );
}
