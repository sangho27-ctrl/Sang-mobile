import type { ImageSourcePropType } from 'react-native';

/**
 * Ảnh sản phẩm seed được đóng gói trong app để luôn hiển thị khi offline.
 * Sản phẩm do admin tạo có thể dùng `imageUrl` thay cho ảnh local.
 */
const PRODUCT_IMAGES: Record<string, ImageSourcePropType> = {
  'iphone-15-pro-max': require('../../assets/products/iphone-15-pro-max.jpg'),
  'samsung-galaxy-s24-ultra': require('../../assets/products/samsung-galaxy-s24-ultra.jpg'),
  'macbook-air-m3': require('../../assets/products/macbook-air-m3.jpg'),
  'dell-xps-13': require('../../assets/products/dell-xps-13.jpg'),
  'ipad-air-m2': require('../../assets/products/ipad-air-m2.jpg'),
  'xiaomi-pad-6': require('../../assets/products/xiaomi-pad-6.jpg'),
  'airpods-pro-2': require('../../assets/products/airpods-pro-2.jpg'),
  'apple-watch-s9': require('../../assets/products/apple-watch-s9.jpg'),
};

export type Product = {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  sold: number;
  badge?: string;
  shortDescription: string;
  description: string;
  colors: { name: string; hex: string }[];
  specs: { label: string; value: string }[];
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max 256GB',
    categoryId: 'phone',
    price: 34990000,
    originalPrice: 37990000,
    rating: 4.9,
    reviewCount: 328,
    sold: 1200,
    badge: 'BÁN CHẠY',
    shortDescription: 'Khung titan, chip A17 Pro, camera 48MP zoom quang 5x.',
    description:
      'iPhone 15 Pro Max mang đến trải nghiệm mạnh mẽ với khung titan nhẹ và bền, màn hình Super Retina XDR 6,7 inch cùng chip A17 Pro. Hệ thống camera 48MP hỗ trợ zoom quang 5x, quay video 4K ProRes và cổng USB-C tốc độ cao. Thời lượng pin cả ngày dài, phù hợp cho cả công việc lẫn giải trí.',
    colors: [
      { name: 'Titan tự nhiên', hex: '#B8B2A7' },
      { name: 'Titan xanh', hex: '#4E5A64' },
      { name: 'Titan đen', hex: '#3C3C3D' },
    ],
    specs: [
      { label: 'Màn hình', value: '6.7" Super Retina XDR' },
      { label: 'Chip xử lý', value: 'Apple A17 Pro' },
      { label: 'Camera chính', value: '48MP, zoom quang 5x' },
      { label: 'Pin', value: '4.441 mAh, sạc nhanh 20W' },
      { label: 'Hệ điều hành', value: 'iOS 17' },
      { label: 'Kết nối', value: '5G, USB-C, Wi-Fi 6E' },
    ],
  },
  {
    id: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra 5G',
    categoryId: 'phone',
    price: 28490000,
    originalPrice: 30990000,
    rating: 4.8,
    reviewCount: 215,
    sold: 890,
    badge: 'MỚI',
    shortDescription: 'Galaxy AI, camera 200MP, màn hình Dynamic AMOLED 2X.',
    description:
      'Samsung Galaxy S24 Ultra là chiếc flagship với khung titan, màn hình Dynamic AMOLED 2X 6,8 inch 120Hz và camera 200MP. Bút S Pen đi kèm giúp ghi chú, phác thảo mọi lúc. Bộ tính năng Galaxy AI hỗ trợ dịch trực tiếp, khoanh vùng tìm kiếm và chỉnh sửa ảnh thông minh.',
    colors: [
      { name: 'Titan xám', hex: '#6E7175' },
      { name: 'Titan đen', hex: '#2E2F33' },
      { name: 'Titan tím', hex: '#8B7F9E' },
    ],
    specs: [
      { label: 'Màn hình', value: '6.8" QHD+ 120Hz' },
      { label: 'Chip xử lý', value: 'Snapdragon 8 Gen 3' },
      { label: 'Camera chính', value: '200MP, zoom quang 5x' },
      { label: 'Pin', value: '5.000 mAh, sạc nhanh 45W' },
      { label: 'Hệ điều hành', value: 'Android 14, One UI 6.1' },
      { label: 'Phụ kiện', value: 'Bút S Pen tích hợp' },
    ],
  },
  {
    id: 'macbook-air-m3',
    name: 'MacBook Air M3 13" 8GB/256GB',
    categoryId: 'laptop',
    price: 27990000,
    originalPrice: 29990000,
    rating: 4.9,
    reviewCount: 156,
    sold: 420,
    badge: 'HOT',
    shortDescription: 'Chip Apple M3, màn hình Liquid Retina 13,6 inch, pin 18 giờ.',
    description:
      'MacBook Air M3 sở hữu thiết kế mỏng nhẹ chỉ 1,24 kg, chip Apple M3 mạnh mẽ và màn hình Liquid Retina 13,6 inch sắc nét. Máy không quạt nên hoạt động êm ái, thời lượng pin lên đến 18 giờ. Lựa chọn lý tưởng cho học tập, văn phòng và sáng tạo nội dung.',
    colors: [
      { name: 'Xám không gian', hex: '#6E7378' },
      { name: 'Bạc', hex: '#D7D9DC' },
      { name: 'Đen nửa đêm', hex: '#2C3138' },
    ],
    specs: [
      { label: 'Màn hình', value: '13.6" Liquid Retina' },
      { label: 'Chip xử lý', value: 'Apple M3 8-core' },
      { label: 'Bộ nhớ', value: 'RAM 8GB, SSD 256GB' },
      { label: 'Thời lượng pin', value: 'Lên đến 18 giờ' },
      { label: 'Hệ điều hành', value: 'macOS Sonoma' },
      { label: 'Trọng lượng', value: '1.24 kg' },
    ],
  },
  {
    id: 'dell-xps-13',
    name: 'Dell XPS 13 Plus 9320',
    categoryId: 'laptop',
    price: 32990000,
    rating: 4.7,
    reviewCount: 98,
    sold: 210,
    shortDescription: 'Intel Core Ultra 7, màn hình OLED 3K, thiết kế siêu mỏng.',
    description:
      'Dell XPS 13 Plus gây ấn tượng với thiết kế tối giản, bàn phím tràn viền và màn hình OLED 3K rực rỡ. Chip Intel Core Ultra 7 155H xử lý tốt đa nhiệm, đồ họa và các tác vụ AI. Thân máy kim loại chắc chắn, trọng lượng chỉ 1,26 kg.',
    colors: [
      { name: 'Xám bạc', hex: '#A8ADB5' },
      { name: 'Đen than', hex: '#34373B' },
    ],
    specs: [
      { label: 'Màn hình', value: '13.4" 3K OLED' },
      { label: 'Chip xử lý', value: 'Intel Core Ultra 7 155H' },
      { label: 'Bộ nhớ', value: 'RAM 16GB, SSD 512GB' },
      { label: 'Đồ họa', value: 'Intel Arc Graphics' },
      { label: 'Hệ điều hành', value: 'Windows 11 Home' },
      { label: 'Trọng lượng', value: '1.26 kg' },
    ],
  },
  {
    id: 'ipad-air-m2',
    name: 'iPad Air M2 11" 128GB',
    categoryId: 'tablet',
    price: 16990000,
    originalPrice: 17990000,
    rating: 4.8,
    reviewCount: 187,
    sold: 530,
    shortDescription: 'Chip M2, màn hình Liquid Retina 11 inch, hỗ trợ Apple Pencil Pro.',
    description:
      'iPad Air M2 kết hợp hiệu năng của chip Apple M2 với thiết kế mỏng nhẹ, màn hình Liquid Retina 11 inch. Máy hỗ trợ Apple Pencil Pro và Magic Keyboard, phù hợp để ghi chú, vẽ, xem phim và làm việc. Camera trước đặt ngang giúp gọi video tự nhiên hơn.',
    colors: [
      { name: 'Xanh dương', hex: '#A7C1D9' },
      { name: 'Tím', hex: '#C2B5D9' },
      { name: 'Xám', hex: '#8A8D91' },
    ],
    specs: [
      { label: 'Màn hình', value: '11" Liquid Retina' },
      { label: 'Chip xử lý', value: 'Apple M2' },
      { label: 'Bộ nhớ', value: '128GB' },
      { label: 'Camera', value: '12MP, FaceTime HD' },
      { label: 'Thời lượng pin', value: 'Lên đến 10 giờ' },
      { label: 'Hệ điều hành', value: 'iPadOS 17' },
    ],
  },
  {
    id: 'xiaomi-pad-6',
    name: 'Xiaomi Pad 6 8GB/256GB',
    categoryId: 'tablet',
    price: 7490000,
    originalPrice: 8490000,
    rating: 4.6,
    reviewCount: 142,
    sold: 640,
    badge: 'GIÁ TỐT',
    shortDescription: 'Màn hình 11 inch 144Hz, Snapdragon 870, pin 8.840 mAh.',
    description:
      'Xiaomi Pad 6 có màn hình 11 inch độ phân giải 2.8K tần số quét 144Hz, mang lại trải nghiệm mượt mà khi giải trí và làm việc. Chip Snapdragon 870 cùng pin 8.840 mAh đáp ứng tốt cả ngày dài. Hỗ trợ bút Xiaomi Smart Pen và bàn phím rời.',
    colors: [
      { name: 'Đen', hex: '#2F3237' },
      { name: 'Xanh', hex: '#9DB9CD' },
      { name: 'Vàng', hex: '#D9C08C' },
    ],
    specs: [
      { label: 'Màn hình', value: '11" 2.8K 144Hz' },
      { label: 'Chip xử lý', value: 'Snapdragon 870' },
      { label: 'Bộ nhớ', value: 'RAM 8GB, SSD 256GB' },
      { label: 'Pin', value: '8.840 mAh, sạc 33W' },
      { label: 'Hệ điều hành', value: 'Android 13' },
      { label: 'Trọng lượng', value: '490 g' },
    ],
  },
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro 2 (USB-C)',
    categoryId: 'accessory',
    price: 5490000,
    originalPrice: 5990000,
    rating: 4.9,
    reviewCount: 412,
    sold: 2100,
    badge: 'BÁN CHẠY',
    shortDescription: 'Chống ồn chủ động, âm thanh không gian, hộp sạc USB-C.',
    description:
      'AirPods Pro 2 mang đến khả năng chống ồn chủ động gấp đôi thế hệ trước, âm thanh không gian cá nhân hóa và chế độ xuyên âm tự nhiên. Chip Apple H2 xử lý âm thanh chi tiết, hộp sạc USB-C hỗ trợ sạc MagSafe. Thời lượng nghe lên đến 6 giờ, 30 giờ khi dùng cùng hộp sạc.',
    colors: [{ name: 'Trắng', hex: '#F5F5F5' }],
    specs: [
      { label: 'Chip âm thanh', value: 'Apple H2' },
      { label: 'Chống ồn', value: 'ANC chủ động' },
      { label: 'Thời lượng', value: '6 giờ, 30 giờ với hộp sạc' },
      { label: 'Cổng sạc', value: 'USB-C, MagSafe' },
      { label: 'Kháng nước', value: 'IP54' },
      { label: 'Kết nối', value: 'Bluetooth 5.3' },
    ],
  },
  {
    id: 'apple-watch-s9',
    name: 'Apple Watch Series 9 45mm',
    categoryId: 'accessory',
    price: 10990000,
    originalPrice: 11990000,
    rating: 4.7,
    reviewCount: 203,
    sold: 380,
    shortDescription: 'Màn hình Retina luôn sáng, chip S9, theo dõi sức khỏe toàn diện.',
    description:
      'Apple Watch Series 9 có màn hình Retina luôn sáng, chip S9 mạnh mẽ và thao tác chạm hai lần tiện lợi. Đồng hồ theo dõi nhịp tim, nồng độ oxy trong máu, giấc ngủ và nhiều chỉ số sức khỏe khác. Thiết kế nhôm bền nhẹ, phù hợp sử dụng hằng ngày.',
    colors: [
      { name: 'Nhôm bạc', hex: '#D6D8DA' },
      { name: 'Nhôm đen', hex: '#3B3D40' },
      { name: 'Thép vàng', hex: '#D9B98A' },
    ],
    specs: [
      { label: 'Kích thước', value: '45mm' },
      { label: 'Chip xử lý', value: 'Apple S9 SiP' },
      { label: 'Định vị', value: 'GPS' },
      { label: 'Thời lượng pin', value: 'Lên đến 18 giờ' },
      { label: 'Kháng nước', value: '50 mét' },
      { label: 'Hệ điều hành', value: 'watchOS 10' },
    ],
  },
];

export function getProductImageSource(
  product: Pick<Product, 'id' | 'imageUrl'>,
): ImageSourcePropType | undefined {
  const remoteUrl = product.imageUrl?.trim();
  if (remoteUrl) {
    return { uri: remoteUrl };
  }
  return PRODUCT_IMAGES[product.id];
}

