import { Ionicons } from '@expo/vector-icons';
import { useState, type ComponentProps } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { colors, radius, spacing } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type FormFieldProps = TextInputProps & {
  label: string;
  icon?: IconName;
  error?: string;
  minHeight?: number;
};

export function FormField({
  label,
  icon,
  error,
  secureTextEntry,
  multiline,
  minHeight,
  style,
  ...inputProps
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputRow,
          multiline && styles.multilineRow,
          minHeight !== undefined && { minHeight },
          isFocused && styles.focusedRow,
          Boolean(error) && styles.errorRow,
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={isFocused ? colors.primary : colors.textMuted}
            style={multiline ? styles.multilineIcon : undefined}
          />
        ) : null}

        <TextInput
          {...inputProps}
          multiline={multiline}
          style={[styles.input, multiline && styles.multilineInput, style]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={Boolean(secureTextEntry && !showPassword)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {secureTextEntry ? (
          <Pressable onPress={() => setShowPassword((prev) => !prev)} hitSlop={8}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  multilineRow: {
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    minHeight: 80,
  },
  multilineIcon: {
    marginTop: 4,
  },
  focusedRow: {
    borderColor: colors.primary,
  },
  errorRow: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.danger,
  },
});
