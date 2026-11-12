import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];
type BannerTone = 'error' | 'success' | 'info';

type AlertBannerProps = {
  message: string;
  tone?: BannerTone;
  style?: StyleProp<ViewStyle>;
};

const TONES: Record<
  BannerTone,
  { icon: IconName; color: string; backgroundColor: string }
> = {
  error: {
    icon: 'alert-circle',
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  success: {
    icon: 'checkmark-circle',
    color: colors.success,
    backgroundColor: colors.successSoft,
  },
  info: {
    icon: 'information-circle',
    color: colors.primary,
    backgroundColor: colors.primarySoft,
  },
};

/** Khung thông báo lỗi / thành công / gợi ý dùng chung. */
export function AlertBanner({ message, tone = 'error', style }: AlertBannerProps) {
  const { icon, color, backgroundColor } = TONES[tone];

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={[styles.message, { color }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  message: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
