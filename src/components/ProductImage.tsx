import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, StyleSheet, View, type ImageResizeMode } from 'react-native';
import { getProductImageSource, type Product } from '@/data/products';
import { colors } from '@/theme';

type ProductImageProps = {
  product?: Pick<Product, 'id' | 'imageUrl'> | null;
  iconSize?: number;
  resizeMode?: ImageResizeMode;
};

/**
 * Ảnh sản phẩm có sẵn ảnh dự phòng khi sản phẩm chưa có ảnh hoặc URL bị lỗi.
 * Component luôn lấp đầy khung cha, vì vậy cha cần đặt kích thước cụ thể.
 */
export function ProductImage({
  product,
  iconSize = 30,
  resizeMode = 'contain',
}: ProductImageProps) {
  const source = product ? getProductImageSource(product) : undefined;
  const sourceKey = product ? `${product.id}:${product.imageUrl ?? ''}` : '';
  const [failedKey, setFailedKey] = useState<string | null>(null);
  const hasError = sourceKey !== '' && failedKey === sourceKey;

  if (!source || hasError) {
    return (
      <View style={styles.placeholder}>
        <Ionicons name="image-outline" size={iconSize} color={colors.textMuted} />
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={styles.image}
      resizeMode={resizeMode}
      onError={() => setFailedKey(sourceKey)}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
});
