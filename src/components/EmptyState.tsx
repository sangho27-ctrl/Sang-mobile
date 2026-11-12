import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

type EmptyStateProps = {
  icon: IconName;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} style={styles.action} accessibilityRole="button">
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: spacing.xl,
  },
  containerCompact: {
    paddingVertical: spacing.xxl,
  },
  iconWrap: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    backgroundColor: colors.primarySoft,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 15.5,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    marginTop: 6,
    fontSize: 12.5,
    lineHeight: 19,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  action: {
    marginTop: spacing.lg,
    paddingHorizontal: 18,
    minHeight: 40,
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  actionText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.white,
  },
});
