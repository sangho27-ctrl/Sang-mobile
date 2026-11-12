import { DefaultTheme, Stack, SplashScreen, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { CatalogProvider } from '@/context/CatalogContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { OrdersProvider } from '@/context/OrdersContext';
import { colors } from '@/theme';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CatalogProvider>
          <FavoritesProvider>
            <CartProvider>
              <OrdersProvider>
                <StatusBar style="dark" />
                <RootNavigator />
              </OrdersProvider>
            </CartProvider>
          </FavoritesProvider>
        </CatalogProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      void SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [isLoading]);

  return (
    <ThemeProvider value={appTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontSize: 17, fontWeight: '700' },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {/* Khách chưa đăng nhập vẫn xem được trang chủ, danh mục và chi tiết sản phẩm. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="category/[categoryId]"
          options={{ title: 'Danh mục sản phẩm' }}
        />
        <Stack.Screen name="product/[id]" options={{ headerShown: false }} />

        {/* Các màn yêu cầu đăng nhập */}
        <Stack.Protected guard={Boolean(user)} redirectTo="/login">
          <Stack.Screen name="cart" options={{ title: 'Giỏ hàng' }} />
          <Stack.Screen name="checkout" options={{ title: 'Thanh toán' }} />
          <Stack.Screen name="orders" options={{ title: 'Lịch sử mua hàng' }} />
          <Stack.Screen name="profile/edit" options={{ title: 'Cập nhật thông tin' }} />
        </Stack.Protected>

        {/* Khu quản trị chỉ dành cho admin */}
        <Stack.Protected guard={user?.role === 'admin'} redirectTo="/">
          <Stack.Screen name="admin" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
