import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "./db";
import { storagePut } from "./storage";

const productInput = z.object({
  name: z.string().min(1).max(180),
  code: z.string().min(1).max(80),
  category: z.string().min(1).max(80),
  description: z.string().max(5000).optional().nullable(),
  priceCents: z.number().int().nonnegative(),
  oldPriceCents: z.number().int().nonnegative().optional().nullable(),
  imageUrl: z.string().max(2000).optional().nullable(),
  imageUrls: z.string().max(25000).optional().nullable(),
  videoUrl: z.string().max(2000).optional().nullable(),
  colorOptions: z.string().max(5000).optional().nullable(),
  sizeOptions: z.string().max(5000).optional().nullable(),
  badge: z.string().max(40).optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  products: router({
    list: publicProcedure.query(() => listProducts(false)),
    getById: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => getProductById(input.id)),
  }),
  adminProducts: router({
    list: adminProcedure.query(() => listProducts(true)),
    create: adminProcedure.input(productInput).mutation(({ input }) => createProduct(input)),
    update: adminProcedure.input(productInput.extend({ id: z.number().int().positive() })).mutation(({ input }) => {
      const { id, ...values } = input;
      return updateProduct(id, values);
    }),
    delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteProduct(input.id)),
    uploadMedia: adminProcedure.input(z.object({ filename: z.string().min(1).max(180), mimeType: z.string().regex(/^(image|video)\//), dataBase64: z.string().min(1).max(1_400_000_000) })).mutation(async ({ input, ctx }) => {
      const rawName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "-");
      const bytes = Buffer.from(input.dataBase64, "base64");
      const limit = input.mimeType.startsWith("video/") ? 1000 * 1024 * 1024 : 7 * 1024 * 1024;
      if (bytes.byteLength > limit) throw new Error(`File is too large. Maximum is ${Math.round(limit / 1024 / 1024)}MB.`);
      const uploaded = await storagePut(`products/${ctx.user.id}/${Date.now()}-${rawName}`, bytes, input.mimeType);
      return uploaded;
    }),
  }),
});

export type AppRouter = typeof appRouter;
