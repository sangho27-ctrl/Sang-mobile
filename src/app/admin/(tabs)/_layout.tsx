import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme';

export default function AdminTabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 76 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 4),
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 9.5,
          fontWeight: '700',
          lineHeight: 12,
          marginTop: 1,
          marginBottom: 1,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tabs.Screen
        name="user-home"
        options={{
          title: 'Home của user',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'storefront' : 'storefront-outline'}
              size={21}
              color={typeof color === 'string' ? color : colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home của admin',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'shield-checkmark' : 'shield-checkmark-outline'}
              size={21}
              color={typeof color === 'string' ? color : colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: 'Signup',
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
