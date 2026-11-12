export const colors = {
  primary: '#D70018',
  primarySoft: '#FDECEE',
  accent: '#FFB400',
  accentSoft: '#FFF7E6',
  background: '#F4F5F7',
  surface: '#FFFFFF',
  surfaceMuted: '#F7F8FA',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  success: '#16A34A',
  successSoft: '#ECFDF3',
  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  dangerBorder: '#FBD5D5',
  star: '#F59E0B',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  pill: 999,
} as const;

export const cardShadow = {
  shadowColor: '#111827',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.04,
  shadowRadius: 6,
  elevation: 1,
} as const;
