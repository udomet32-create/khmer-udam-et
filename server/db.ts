import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertProduct, InsertUser, products, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  textFields.forEach((field) => { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } });
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function listProducts(includeInactive = false) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(products).orderBy(desc(products.sortOrder), desc(products.createdAt));
  return includeInactive ? rows : rows.filter((product) => product.isActive);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return rows[0];
}

export async function createProduct(input: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(products).values(input);
  const created = await db.select().from(products).where(eq(products.id, Number(result[0].insertId))).limit(1);
  return created[0];
}

export async function updateProduct(id: number, input: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(products).set(input).where(eq(products.id, id));
  const updated = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return updated[0];
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(products).where(eq(products.id, id));
  return { success: true } as const;
}
