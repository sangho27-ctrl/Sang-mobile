import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { colors } from '@/theme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { favoriteCount } = useFavorites();
  const isSignedIn = Boolean(user);

  const tabBarStyle = {
    height: 68 + insets.bottom,
    paddingTop: 4,
    paddingBottom: Math.max(insets.bottom, 4),
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle,
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '700',
          lineHeight: 13,
          marginTop: 1,
          marginBottom: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarBadgeStyle: {
          minWidth: 17,
          height: 17,
          borderRadius: 9,
          fontSize: 9,
          lineHeight: 16,
          backgroundColor: colors.danger,
          color: colors.white,
        },
      }}
    >
      {/* Tab luôn hiển thị */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={typeof color === 'string' ? color : colors.textMuted}
            />
          ),
        }}
      />

      {/* Tab dành cho người dùng đã đăng nhập */}
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Danh mục',
          href: isSignedIn ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={22}
              color={typeof color === 'string' ? color : colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Yêu thích',
          href: isSignedIn ? undefined : null,
          tabBarBadge: isSignedIn && favoriteCount > 0 ? favoriteCount : undefined,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={23}
              color={typeof color === 'string' ? color : colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tài khoản',
          href: isSignedIn ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={typeof color === 'string' ? color : colors.textMuted}
            />
          ),
        }}
      />

      {/* Tab dành cho khách: Home, Sign up, Login */}
      <Tabs.Screen
        name="register"
        options={{
          title: 'Sign up',
          tabBarItemStyle: isSignedIn ? { display: 'none' } : undefined,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person-add' : 'person-add-outline'}
              size={21}
              color={typeof color === 'string' ? color : colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          tabBarItemStyle: isSignedIn ? { display: 'none' } : undefined,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'log-in' : 'log-in-outline'}
              size={21}
              color={typeof color === 'string' ? color : colors.textMuted}
            />
          ),
        }}
      />
    </Tabs>
  );
}
