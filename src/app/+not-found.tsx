import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '@/theme';

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="compass-outline" size={42} color={colors.primary} />
        </View>
        <Text style={styles.title}>Không tìm thấy trang</Text>
        <Text style={styles.description}>
          Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển.
        </Text>
        <Pressable
          onPress={() => router.replace('/')}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Về trang chủ</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  iconWrap: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: colors.primarySoft,
  },
  title: {
    marginTop: spacing.xl,
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  description: {
    marginTop: spacing.sm,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  button: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.white,
  },
  pressed: {
    opacity: 0.8,
  },
});
