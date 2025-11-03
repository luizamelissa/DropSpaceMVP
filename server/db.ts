import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, stores, InsertStore, products, InsertProduct, orders, InsertOrder, suppliers, InsertSupplier } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// User queries
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Store queries
export async function getStoresByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(stores).where(eq(stores.userId, userId));
}

export async function getStoreById(storeId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(stores).where(eq(stores.id, storeId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createStore(data: InsertStore) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(stores).values(data);
  return result;
}

export async function updateStore(storeId: number, data: Partial<InsertStore>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(stores).set(data).where(eq(stores.id, storeId));
}

export async function deleteStore(storeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(stores).where(eq(stores.id, storeId));
}

// Product queries
export async function getProductsByStoreId(storeId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).where(eq(products.storeId, storeId));
}

export async function getProductById(productId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(data);
  return result;
}

export async function updateProduct(productId: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(products).set(data).where(eq(products.id, productId));
}

export async function deleteProduct(productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(products).where(eq(products.id, productId));
}

// Order queries
export async function getOrdersByStoreId(storeId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).where(eq(orders.storeId, storeId));
}

export async function getOrderById(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrder(data: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(data);
  return result;
}

// Supplier queries
export async function getSuppliersByStoreId(storeId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(suppliers).where(eq(suppliers.storeId, storeId));
}

export async function createSupplier(data: InsertSupplier) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(suppliers).values(data);
  return result;
}
