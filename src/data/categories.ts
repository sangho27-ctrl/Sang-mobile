import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type FilterCategoryId = string;
export type IconName = ComponentProps<typeof Ionicons>['name'];

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  color: string;
  softColor: string;
};

export type CategoryOption = Category;

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'phone',
    name: 'Điện thoại',
    description: 'Smartphone chính hãng',
    icon: 'phone-portrait-outline',
    color: '#4F46E5',
    softColor: '#EEF2FF',
  },
  {
    id: 'laptop',
    name: 'Laptop',
    description: 'Máy tính xách tay',
    icon: 'laptop-outline',
    color: '#0E9384',
    softColor: '#F0FDF9',
  },
  {
    id: 'tablet',
    name: 'Máy tính bảng',
    description: 'Tablet & iPad',
    icon: 'tablet-portrait-outline',
    color: '#F79009',
    softColor: '#FFFAEB',
  },
  {
    id: 'accessory',
    name: 'Phụ kiện',
    description: 'Tai nghe, đồng hồ...',
    icon: 'headset-outline',
    color: '#EE46BC',
    softColor: '#FDF2FA',
  },
];

export const ALL_CATEGORY: CategoryOption = {
  id: 'all',
  name: 'Tất cả',
  description: 'Toàn bộ sản phẩm',
  icon: 'grid-outline',
  color: '#475467',
  softColor: '#F2F4F7',
};

export const CATEGORY_ICON_PRESETS: { icon: IconName; label: string }[] = [
  { icon: 'phone-portrait-outline', label: 'Điện thoại' },
  { icon: 'laptop-outline', label: 'Laptop' },
  { icon: 'tablet-portrait-outline', label: 'Tablet' },
  { icon: 'headset-outline', label: 'Tai nghe' },
  { icon: 'watch-outline', label: 'Đồng hồ' },
  { icon: 'game-controller-outline', label: 'Gaming' },
  { icon: 'tv-outline', label: 'Tivi' },
  { icon: 'camera-outline', label: 'Camera' },
  { icon: 'home-outline', label: 'Gia dụng' },
  { icon: 'gift-outline', label: 'Khác' },
];

export const CATEGORY_COLOR_PRESETS: {
  color: string;
  softColor: string;
  label: string;
}[] = [
  { color: '#4F46E5', softColor: '#EEF2FF', label: 'Tím' },
  { color: '#0E9384', softColor: '#F0FDF9', label: 'Xanh ngọc' },
  { color: '#F79009', softColor: '#FFFAEB', label: 'Cam' },
  { color: '#EE46BC', softColor: '#FDF2FA', label: 'Hồng' },
  { color: '#1570EF', softColor: '#EFF8FF', label: 'Xanh dương' },
  { color: '#12B76A', softColor: '#ECFDF3', label: 'Xanh lá' },
];

export function isFilterCategoryId(value: unknown): value is FilterCategoryId {
  return typeof value === 'string' && value.trim().length > 0;
}

export function findCategory(
  categories: Category[],
  id: FilterCategoryId,
): CategoryOption {
  if (id === 'all') {
    return ALL_CATEGORY;
  }
  return categories.find((category) => category.id === id) ?? ALL_CATEGORY;
}
