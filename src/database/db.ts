import * as SQLite from 'expo-sqlite';
import { ADMIN_ACCOUNT, DEMO_ACCOUNT } from '@/constants/accounts';
import { DEFAULT_CATEGORIES, type Category } from '@/data/categories';
import { DEFAULT_PRODUCTS, type Product } from '@/data/products';
import type { Order, OrderItem } from '@/data/orders';
import type { AuthUser, UserRole } from '@/context/AuthContext';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
let initPromise: Promise<void> | null = null;

/**
 * Mở kết nối đến database SQLite 'minishop.db' (đảm bảo singleton Promise)
 */
async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('minishop.db');
  }
  return dbPromise;
}

/**
 * Khởi tạo cấu trúc các bảng trong SQLite và thêm dữ liệu mẫu ban đầu.
 * Sử dụng initPromise để tránh chạy song song khi nhiều Provider gọi cùng lúc.
 */
export async function initDatabase(): Promise<void> {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      const db = await getDb();

      // Thiết lập pragmas an toàn
      try {
        await db.execAsync('PRAGMA journal_mode = WAL;');
      } catch (err) {
        console.warn('Không thể bật WAL mode:', err);
      }
      try {
        await db.execAsync('PRAGMA foreign_keys = ON;');
      } catch (err) {
        console.warn('Không thể bật foreign_keys:', err);
      }

      // Tạo cấu trúc các bảng
      await db.execAsync(`
        -- Bảng Người dùng
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'user',
          createdAt TEXT NOT NULL
        );

        -- Bảng Phiên đăng nhập (Session)
        CREATE TABLE IF NOT EXISTS session (
          key TEXT PRIMARY KEY,
          userId TEXT
        );

        -- Bảng Loại sản phẩm (Danh mục)
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          icon TEXT NOT NULL,
          color TEXT NOT NULL,
          softColor TEXT NOT NULL
        );

        -- Bảng Sản phẩm
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          categoryId TEXT NOT NULL,
          price REAL NOT NULL,
          originalPrice REAL,
          imageUrl TEXT,
          badge TEXT,
          shortDescription TEXT,
          description TEXT,
          rating REAL DEFAULT 5,
          reviewCount INTEGER DEFAULT 0,
          sold INTEGER DEFAULT 0,
          colors TEXT,
          specs TEXT
        );

        -- Bảng Giỏ hàng
        CREATE TABLE IF NOT EXISTS cart (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT NOT NULL,
          productId TEXT NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          UNIQUE(userId, productId)
        );

        -- Bảng Sản phẩm yêu thích
        CREATE TABLE IF NOT EXISTS favorites (
          userId TEXT NOT NULL,
          productId TEXT NOT NULL,
          PRIMARY KEY (userId, productId)
        );

        -- Bảng Đơn hàng
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          items TEXT NOT NULL,
          subtotal REAL NOT NULL,
          shippingFee REAL NOT NULL,
          total REAL NOT NULL,
          status TEXT NOT NULL,
          paymentMethod TEXT NOT NULL,
          recipientName TEXT NOT NULL,
          phone TEXT NOT NULL,
          address TEXT NOT NULL,
          note TEXT,
          createdAt TEXT NOT NULL
        );
      `);

      // Seed dữ liệu mẫu nếu chưa có
      await seedInitialData(db);
      console.log('✅ SQLite Database đã khởi tạo và nạp dữ liệu thành công.');
    } catch (error) {
      console.error('❌ Lỗi khởi tạo SQLite Database:', error);
      initPromise = null;
      throw error;
    }
  })();

  return initPromise;
}

/**
 * Seed tài khoản và danh mục / sản phẩm mặc định (dùng INSERT OR IGNORE an toàn tuyệt đối)
 */
async function seedInitialData(db: SQLite.SQLiteDatabase): Promise<void> {
  // 1. Kiểm tra tài khoản admin & demo
  await db.runAsync(
    `INSERT OR IGNORE INTO users (id, name, email, phone, password, role, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      'admin-user',
      ADMIN_ACCOUNT.name,
      ADMIN_ACCOUNT.email.toLowerCase(),
      ADMIN_ACCOUNT.phone,
      ADMIN_ACCOUNT.password,
      'admin',
      '2026-01-01T00:00:00.000Z',
    ],
  );

  await db.runAsync(
    `INSERT OR IGNORE INTO users (id, name, email, phone, password, role, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      'demo-user',
      DEMO_ACCOUNT.name,
      DEMO_ACCOUNT.email.toLowerCase(),
      DEMO_ACCOUNT.phone,
      DEMO_ACCOUNT.password,
      'user',
      '2026-01-15T00:00:00.000Z',
    ],
  );

  // 2. Kiểm tra danh mục
  for (const cat of DEFAULT_CATEGORIES) {
    await db.runAsync(
      `INSERT OR IGNORE INTO categories (id, name, description, icon, color, softColor)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [cat.id, cat.name, cat.description, cat.icon, cat.color, cat.softColor],
    );
  }

  // 3. Kiểm tra sản phẩm
  for (const p of DEFAULT_PRODUCTS) {
    await db.runAsync(
      `INSERT OR IGNORE INTO products (id, name, categoryId, price, originalPrice, imageUrl, badge, shortDescription, description, rating, reviewCount, sold, colors, specs)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id,
        p.name,
        p.categoryId,
        p.price,
        p.originalPrice ?? null,
        p.imageUrl ?? null,
        p.badge ?? null,
        p.shortDescription,
        p.description,
        p.rating,
        p.reviewCount,
        p.sold,
        JSON.stringify(p.colors ?? []),
        JSON.stringify(p.specs ?? []),
      ],
    );
  }
}

// ==================== CÁC HÀM XỬ LÝ NGƯỜI DÙNG & PHIÊN ====================

export type StoredDbUser = AuthUser & { password: string };

export async function dbGetAllUsers(): Promise<StoredDbUser[]> {
  const db = await getDb();
  return db.getAllAsync<StoredDbUser>('SELECT id, name, email, phone, password, role, createdAt FROM users ORDER BY createdAt ASC');
}

export async function dbGetUserByEmail(email: string): Promise<StoredDbUser | null> {
  const db = await getDb();
  return db.getFirstAsync<StoredDbUser>(
    'SELECT id, name, email, phone, password, role, createdAt FROM users WHERE LOWER(email) = LOWER(?)',
    [email.trim()],
  );
}

export async function dbCreateUser(user: StoredDbUser): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO users (id, name, email, phone, password, role, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [user.id, user.name, user.email.toLowerCase(), user.phone, user.password, user.role, user.createdAt],
  );
}

export async function dbUpdateUserProfile(userId: string, name: string, phone: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE users SET name = ?, phone = ? WHERE id = ?', [name, phone, userId]);
}

export async function dbUpdateUserRole(userId: string, role: UserRole): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
}

export async function dbDeleteUser(userId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM users WHERE id = ?', [userId]);
}

export async function dbGetSessionUserId(): Promise<string | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ userId: string }>(
    'SELECT userId FROM session WHERE key = ?',
    ['current_user'],
  );
  return row?.userId ?? null;
}

export async function dbSetSessionUserId(userId: string | null): Promise<void> {
  const db = await getDb();
  if (userId) {
    await db.runAsync(
      'INSERT OR REPLACE INTO session (key, userId) VALUES (?, ?)',
      ['current_user', userId],
    );
  } else {
    await db.runAsync('DELETE FROM session WHERE key = ?', ['current_user']);
  }
}

// ==================== CÁC HÀM XỬ LÝ DANH MỤC ====================

export async function dbGetAllCategories(): Promise<Category[]> {
  const db = await getDb();
  return db.getAllAsync<Category>('SELECT id, name, description, icon, color, softColor FROM categories');
}

export async function dbCreateCategory(category: Category): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO categories (id, name, description, icon, color, softColor)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [category.id, category.name, category.description, category.icon, category.color, category.softColor],
  );
}

export async function dbUpdateCategory(id: string, category: Omit<Category, 'id'>): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE categories SET name = ?, description = ?, icon = ?, color = ?, softColor = ?
     WHERE id = ?`,
    [category.name, category.description, category.icon, category.color, category.softColor, id],
  );
}

export async function dbDeleteCategory(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
}

// ==================== CÁC HÀM XỬ LÝ SẢN PHẨM ====================

type DbProductRow = Omit<Product, 'colors' | 'specs'> & {
  colors: string | null;
  specs: string | null;
};

function mapProductRow(row: DbProductRow): Product {
  return {
    ...row,
    colors: row.colors ? JSON.parse(row.colors) : [],
    specs: row.specs ? JSON.parse(row.specs) : [],
  };
}

export async function dbGetAllProducts(): Promise<Product[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<DbProductRow>('SELECT * FROM products');
  return rows.map(mapProductRow);
}

export async function dbCreateProduct(product: Product): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO products (id, name, categoryId, price, originalPrice, imageUrl, badge, shortDescription, description, rating, reviewCount, sold, colors, specs)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      product.id,
      product.name,
      product.categoryId,
      product.price,
      product.originalPrice ?? null,
      product.imageUrl ?? null,
      product.badge ?? null,
      product.shortDescription,
      product.description,
      product.rating,
      product.reviewCount,
      product.sold,
      JSON.stringify(product.colors ?? []),
      JSON.stringify(product.specs ?? []),
    ],
  );
}

export async function dbUpdateProduct(id: string, product: Omit<Product, 'id'>): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE products SET name = ?, categoryId = ?, price = ?, originalPrice = ?, imageUrl = ?, badge = ?, shortDescription = ?, description = ?, rating = ?, reviewCount = ?, sold = ?, colors = ?, specs = ?
     WHERE id = ?`,
    [
      product.name,
      product.categoryId,
      product.price,
      product.originalPrice ?? null,
      product.imageUrl ?? null,
      product.badge ?? null,
      product.shortDescription,
      product.description,
      product.rating,
      product.reviewCount,
      product.sold,
      JSON.stringify(product.colors ?? []),
      JSON.stringify(product.specs ?? []),
      id,
    ],
  );
}

export async function dbDeleteProduct(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
}

// ==================== CÁC HÀM XỬ LÝ GIỎ HÀNG (SQL) ====================

export type DbCartItem = {
  productId: string;
  quantity: number;
};

export async function dbGetCart(userId: string): Promise<DbCartItem[]> {
  const db = await getDb();
  return db.getAllAsync<DbCartItem>(
    'SELECT productId, quantity FROM cart WHERE userId = ?',
    [userId],
  );
}

export async function dbAddToCart(userId: string, productId: string, quantity = 1): Promise<void> {
  const db = await getDb();
  const existing = await db.getFirstAsync<{ quantity: number }>(
    'SELECT quantity FROM cart WHERE userId = ? AND productId = ?',
    [userId, productId],
  );

  if (existing) {
    const newQty = Math.min(99, existing.quantity + quantity);
    await db.runAsync(
      'UPDATE cart SET quantity = ? WHERE userId = ? AND productId = ?',
      [newQty, userId, productId],
    );
  } else {
    await db.runAsync(
      'INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)',
      [userId, productId, Math.min(99, Math.max(1, quantity))],
    );
  }
}

export async function dbSetCartQuantity(userId: string, productId: string, quantity: number): Promise<void> {
  const db = await getDb();
  if (quantity <= 0) {
    await db.runAsync('DELETE FROM cart WHERE userId = ? AND productId = ?', [userId, productId]);
  } else {
    await db.runAsync(
      'UPDATE cart SET quantity = ? WHERE userId = ? AND productId = ?',
      [Math.min(99, quantity), userId, productId],
    );
  }
}

export async function dbRemoveFromCart(userId: string, productId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM cart WHERE userId = ? AND productId = ?', [userId, productId]);
}

export async function dbClearCart(userId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM cart WHERE userId = ?', [userId]);
}

// ==================== CÁC HÀM XỬ LÝ YÊU THÍCH (SQL) ====================

export async function dbGetFavorites(userId: string): Promise<string[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ productId: string }>(
    'SELECT productId FROM favorites WHERE userId = ?',
    [userId],
  );
  return rows.map((r) => r.productId);
}

export async function dbToggleFavorite(userId: string, productId: string): Promise<boolean> {
  const db = await getDb();
  const existing = await db.getFirstAsync<{ productId: string }>(
    'SELECT productId FROM favorites WHERE userId = ? AND productId = ?',
    [userId, productId],
  );

  if (existing) {
    await db.runAsync('DELETE FROM favorites WHERE userId = ? AND productId = ?', [userId, productId]);
    return false; // đã bỏ thích
  } else {
    await db.runAsync('INSERT INTO favorites (userId, productId) VALUES (?, ?)', [userId, productId]);
    return true; // đã thêm thích
  }
}

// ==================== CÁC HÀM XỬ LÝ ĐƠN HÀNG (SQL) ====================

type DbOrderRow = Omit<Order, 'items'> & { items: string };

function mapOrderRow(row: DbOrderRow): Order {
  return {
    ...row,
    items: JSON.parse(row.items) as OrderItem[],
  };
}

export async function dbGetOrders(userId: string): Promise<Order[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<DbOrderRow>(
    'SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC',
    [userId],
  );
  return rows.map(mapOrderRow);
}

/** Lấy toàn bộ đơn hàng cho khu quản trị. */
export async function dbGetAllOrders(): Promise<Order[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<DbOrderRow>(
    'SELECT * FROM orders ORDER BY createdAt DESC',
  );
  return rows.map(mapOrderRow);
}

/** Cập nhật tình trạng đơn hàng. */
export async function dbUpdateOrderStatus(
  orderId: string,
  status: Order['status'],
): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
}

export async function dbCreateOrder(order: Order): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO orders (id, userId, items, subtotal, shippingFee, total, status, paymentMethod, recipientName, phone, address, note, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      order.id,
      order.userId,
      JSON.stringify(order.items),
      order.subtotal,
      order.shippingFee,
      order.total,
      order.status,
      order.paymentMethod,
      order.recipientName,
      order.phone,
      order.address,
      order.note ?? null,
      order.createdAt,
    ],
  );
}
