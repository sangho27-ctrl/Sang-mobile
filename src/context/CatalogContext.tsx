import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  DEFAULT_CATEGORIES,
  findCategory,
  type Category,
  type FilterCategoryId,
} from '@/data/categories';
import { DEFAULT_PRODUCTS, type Product } from '@/data/products';
import {
  dbCreateCategory,
  dbCreateProduct,
  dbDeleteCategory,
  dbDeleteProduct,
  dbGetAllCategories,
  dbGetAllProducts,
  dbUpdateCategory,
  dbUpdateProduct,
  initDatabase,
} from '@/database/db';

export type CategoryInput = {
  name: string;
  description: string;
  icon: Category['icon'];
  color: string;
  softColor: string;
};

export type ProductInput = {
  name: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  badge?: string;
  shortDescription: string;
  description: string;
  rating?: number;
  reviewCount?: number;
  sold?: number;
  colors?: Product['colors'];
  specs?: Product['specs'];
};

type CatalogContextValue = {
  categories: Category[];
  products: Product[];
  isLoading: boolean;
  getCategory: (id: FilterCategoryId) => Category;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (categoryId: FilterCategoryId) => Product[];
  countProductsByCategory: (categoryId: FilterCategoryId) => number;
  addCategory: (input: CategoryInput) => Promise<Category>;
  updateCategory: (id: string, input: CategoryInput) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addProduct: (input: ProductInput) => Promise<Product>;
  updateProduct: (id: string, input: ProductInput) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: PropsWithChildren) {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);

  // Tải danh mục và sản phẩm từ SQLite
  useEffect(() => {
    async function loadCatalog() {
      try {
        await initDatabase();
        const [cats, prods] = await Promise.all([
          dbGetAllCategories(),
          dbGetAllProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (e) {
        console.error('Lỗi tải danh mục và sản phẩm từ SQLite:', e);
      } finally {
        setIsLoading(false);
      }
    }

    void loadCatalog();
  }, []);

  // Helper tìm kiếm
  const getCategory = (id: FilterCategoryId) => findCategory(categories, id);

  const getProductById = (id: string) => products.find((p) => p.id === id);

  const getProductsByCategory = (categoryId: FilterCategoryId) =>
    categoryId === 'all'
      ? products
      : products.filter((p) => p.categoryId === categoryId);

  const countProductsByCategory = (categoryId: FilterCategoryId) =>
    categoryId === 'all'
      ? products.length
      : products.filter((p) => p.categoryId === categoryId).length;

  // Quản lý Danh mục với SQLite
  const addCategory = async (input: CategoryInput): Promise<Category> => {
    const id = `cat_${Date.now()}`;
    const newCat: Category = { id, ...input };
    await dbCreateCategory(newCat);
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = async (id: string, input: CategoryInput) => {
    await dbUpdateCategory(id, input);
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...input } : c)),
    );
  };

  const deleteCategory = async (id: string) => {
    const hasProducts = products.some((p) => p.categoryId === id);
    if (hasProducts) {
      throw new Error('Không thể xóa danh mục đang có sản phẩm.');
    }
    await dbDeleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Quản lý Sản phẩm với SQLite
  const addProduct = async (input: ProductInput): Promise<Product> => {
    const id = `prod_${Date.now()}`;
    const newProd: Product = {
      id,
      name: input.name,
      categoryId: input.categoryId,
      price: input.price,
      originalPrice: input.originalPrice,
      imageUrl: input.imageUrl,
      badge: input.badge,
      shortDescription: input.shortDescription,
      description: input.description,
      rating: input.rating ?? 5,
      reviewCount: input.reviewCount ?? 0,
      sold: input.sold ?? 0,
      colors: input.colors ?? [],
      specs: input.specs ?? [],
    };
    await dbCreateProduct(newProd);
    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = async (id: string, input: ProductInput) => {
    const existing = products.find((p) => p.id === id);
    if (!existing) return;
    const updated: Product = {
      ...existing,
      ...input,
      colors: input.colors ?? existing.colors,
      specs: input.specs ?? existing.specs,
    };
    await dbUpdateProduct(id, updated);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const deleteProduct = async (id: string) => {
    await dbDeleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <CatalogContext.Provider
      value={{
        categories,
        products,
        isLoading,
        getCategory,
        getProductById,
        getProductsByCategory,
        countProductsByCategory,
        addCategory,
        updateCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogContextValue {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog phải được dùng trong CatalogProvider.');
  }
  return context;
}
