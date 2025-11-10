import {z} from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type BeanStock } from "@prisma/client";
import { type BeanDetails } from "~/types/Types";

export interface BeanIngredients {
  line1: string,
  line2: string,
  line3: string,
}

export interface BeanSpecifics {
  temperature: string,
  chefName: string,
  pairingSuggestion: string,
  additionalInfo: string,
}

const beanDetails: BeanDetails[] = [
  {
    id: "3d1e1622-e9f5-488e-bb53-938c93d1c465",
    name: "Borlotti Beans",
    description: "In a tomato sauce",
    image1Url: "/img/borlotti_beans_1.jpg",
    ingredients: {line1: "Glue", line2: "Glue", line3: "Glue"},
    specifics: {temperature: "Hot", chefName: "Mr Tom Hibbs", pairingSuggestion: "Homemade Cider", additionalInfo: "Do not consume if you have a pacemaker"},
    stock: 0,
  },
  {
    id: "3d1e1622-e9f5-488e-bb53-938c93d1c466",
    name: "Mead",
    description: "Not fit for human consumption",
    image1Url: "/img/mead_1.jpg",
    ingredients: {line1: "Honey", line2: "Petrol", line3: "Lighter Fluid"},
    specifics: {temperature: "Room Temp", chefName: "The monk we keep in the walls", pairingSuggestion: "Fomepizole 5mg", additionalInfo: "Do not consume"},
    stock: 0,
  }
]

// Replace above orders list with db


export const beanRouter = createTRPCRouter({
  orderBeans: publicProcedure
    .input(
      z.object({
        beanName: z.string(),
        user: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const beanId = beanDetails
          .filter((detail) => detail.name === input.beanName)
          .map((detail) => detail.id)[0] ?? "Unknown Bean Id";

      const stock = await ctx.db.beanStock.findUnique({
        where: {
          id: beanId
        }
      }) ?? 0;

      if (stock.stock <= 0) {
        return;
      }

      await ctx.db.beanStock.update({
        where: {
          id: beanId,
        },
        data: {
          stock: {
            decrement: 1
          },
        },
      });

      await ctx.db.order.create({
        data: {
          beanId: beanId,
          name: input.user,
        },
      });
      return;
    }),

  acceptOrder: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.order.update({
        where: {
          id: input.orderId,
        },
        data: {
          orderState: "ACCEPTED",
        },
      });
    }),

  completeOrder: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.order.update({
        where: {
          id: input.orderId,
        },
        data: {
          orderState: "COMPLETED",
        },
      });
    }),

  rejectOrder: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.order.update({
        where: {
          id: input.orderId,
        },
        data: {
          orderState: "CANCELLED",
        },
      });
    }),

  getBeanOrders: publicProcedure.query(async ({ ctx }) => {
    return ((await ctx.db.order.findMany()) ?? []).map((order) => ({
      orderId: order.id,
      beanName: beanDetails
        .filter((detail) => detail.id === order.beanId)
        .map((detail) => detail.name)[0] ?? "Unknown Bean Name",
      name: order.name,
      orderState: order.orderState,
      orderPlacedDateTime: order.orderPlacedDateTime,
    }));
  }),

  getBeanOrdersByName: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      return (await ctx.db.order.findMany({
        where: {
          name: input.name
        }
      }) ?? []).map((order) => ({
        orderId: order.id,
        beanName: beanDetails
            .filter((detail) => detail.id === order.beanId)
            .map((detail) => detail.name)[0] ?? "Unknown Bean Name",
        name: order.name,
        orderState: order.orderState,
        orderPlacedDateTime: order.orderPlacedDateTime,
      }));
    }),

  getBeanDetails: publicProcedure.query(async ({ctx}) => {
    const beanIds = beanDetails.map(detail => detail.id);

    const beanStock: BeanStock[] = await ctx.db.beanStock.findMany({
      where: {
        id: {
          in: beanIds
        }
      }
    })

    const beanStockMap = new Map(beanStock.map(stock => [stock.id, stock.stock]));

    const enrichedDetails = beanDetails.map(details => ({
      ...details,
      stock: beanStockMap.get(details.id) ?? 100,
    }));

    return enrichedDetails;
  }),

  insertStock: publicProcedure.mutation(async ({ ctx }) => {

    const dataToUpsert = [
      { id: '3d1e1622-e9f5-488e-bb53-938c93d1c465', stock: 10 },
      { id: '3d1e1622-e9f5-488e-bb53-938c93d1c466', stock: 10 },
    ];
    for (const data of dataToUpsert) {
      await ctx.db.beanStock.upsert({
        where: { id: data.id },
        update: { stock: data.stock },
        create: data,
      })
    }

  }),
});

