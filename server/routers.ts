import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getStoresByUserId, createStore, updateStore, deleteStore, getProductsByStoreId, createProduct, updateProduct, deleteProduct, getOrdersByStoreId, getSuppliersByStoreId, createSupplier } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Store routers
  store: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getStoresByUserId(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        logo: z.string().optional(),
        website: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await createStore({
          userId: ctx.user.id,
          ...input,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        logo: z.string().optional(),
        website: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateStore(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteStore(input.id);
      }),
  }),

  // Product routers
  product: router({
    listByStore: protectedProcedure
      .input(z.object({ storeId: z.number() }))
      .query(async ({ input }) => {
        return await getProductsByStoreId(input.storeId);
      }),
    create: protectedProcedure
      .input(z.object({
        storeId: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.string(),
        costPrice: z.string().optional(),
        image: z.string().optional(),
        stock: z.number().optional(),
        sku: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await createProduct({
          storeId: input.storeId,
          name: input.name,
          description: input.description,
          price: input.price,
          costPrice: input.costPrice,
          image: input.image,
          stock: input.stock || 0,
          sku: input.sku,
          category: input.category,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        costPrice: z.string().optional(),
        image: z.string().optional(),
        stock: z.number().optional(),
        sku: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateProduct(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteProduct(input.id);
      }),
  }),

  // Order routers
  order: router({
    listByStore: protectedProcedure
      .input(z.object({ storeId: z.number() }))
      .query(async ({ input }) => {
        return await getOrdersByStoreId(input.storeId);
      }),
  }),

  // Supplier routers
  supplier: router({
    listByStore: protectedProcedure
      .input(z.object({ storeId: z.number() }))
      .query(async ({ input }) => {
        return await getSuppliersByStoreId(input.storeId);
      }),
    create: protectedProcedure
      .input(z.object({
        storeId: z.number(),
        name: z.string().min(1),
        email: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await createSupplier(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
