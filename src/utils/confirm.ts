import { Alert, Platform } from 'react-native';

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
};

export function confirmAction({
  title,
  message,
  confirmLabel = 'Đồng ý',
  destructive = false,
  onConfirm,
}: ConfirmOptions) {
  if (Platform.OS === 'web') {
    const confirmFn = (
      globalThis as typeof globalThis & {
        confirm?: (message?: string) => boolean;
      }
    ).confirm;
    if (!confirmFn || confirmFn(`${title}\n\n${message}`)) {
      onConfirm();
    }
    return;
  }

  Alert.alert(title, message, [
    { text: 'Hủy', style: 'cancel' },
    {
      text: confirmLabel,
      style: destructive ? 'destructive' : 'default',
      onPress: onConfirm,
    },
  ]);
}
