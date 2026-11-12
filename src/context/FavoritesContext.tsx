import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { useAuth } from '@/context/AuthContext';
import { dbGetFavorites, dbToggleFavorite, initDatabase } from '@/database/db';

type FavoritesContextValue = {
  favoriteIds: string[];
  favoriteCount: number;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const userId = user?.id ?? 'guest';
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Tải danh sách yêu thích từ SQLite theo userId
  useEffect(() => {
    let isMounted = true;
    initDatabase()
      .then(() => dbGetFavorites(userId))
      .then((ids) => {
        if (isMounted) {
          setFavoriteIds(ids);
        }
      })
      .catch((e) => console.error('Lỗi tải danh sách yêu thích từ SQLite:', e));

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const toggleFavorite = (productId: string) => {
    void dbToggleFavorite(userId, productId).then((isAdded) => {
      setFavoriteIds((prev) =>
        isAdded ? [...prev, productId] : prev.filter((id) => id !== productId),
      );
    });
  };

  const isFavorite = (productId: string) => favoriteIds.includes(productId);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favoriteCount: favoriteIds.length,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites phải được dùng bên trong FavoritesProvider.');
  }
  return context;
}
