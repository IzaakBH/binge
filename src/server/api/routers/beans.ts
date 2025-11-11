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
    name: "Dal with Rice (Ve)",
    description: "Mung dal is used to make a creamy and delicious dal that is a daily staple of the Indian sub-continent.",
    image1Url: "/img/mung_dal.jpg",
    ingredients: {line1: "Mung Dal", line2: "Tomato", line3: "Rice"},
    specifics: {temperature: "Hot", chefName: "Yeshi Jampa", pairingSuggestion: "Homemade Cider", additionalInfo: "Do not consume if you have a pacemaker"},
    stock: 0,
  },
  {
    id: "3d1e1622-e9f5-488e-bb53-938c93d1c466",
    name: "Roasted Veggies (Ve)",
    description: "Roasted organic vegetables",
    image1Url: "/img/roasted_veg.jpg",
    ingredients: {line1: "Squash", line2: "Potatoes", line3: "Soil"},
    specifics: {temperature: "Hot", chefName: "Mr Tato", pairingSuggestion: "Mung Dal", additionalInfo: "Did you know vegetables are often vegetarian?"},
    stock: 0,
  },
  {
    id: "3d1e1622-e9f5-488e-bb53-938c93d1c467",
    name: "Homemade Focaccia (Ve)",
    description: "Sheriff Production's take on an Italian Classic",
    image1Url: "/img/focaccia.jpg",
    ingredients: {line1: "Flour", line2: "Oil", line3: "Water"},
    specifics: {temperature: "Room Temp", chefName: "Italian Izaak", pairingSuggestion: "Hummus", additionalInfo: "May contain flour"},
    stock: 0,
  },
  {
    id: "3d1e1622-e9f5-488e-bb53-938c93d1c468",
    name: "Hummus",
    description: "A chickpeas based dip",
    image1Url: "/img/hummus.jpg",
    ingredients: {line1: "Chickpeas", line2: "Tahini", line3: "Oil"},
    specifics: {temperature: "Cold", chefName: "Also Izaak", pairingSuggestion: "Focaccia", additionalInfo: "Have you ever just sat and watched the washing machine go round? Do it, its fun"},
    stock: 0,
  },
  {
    id: "3d1e1622-e9f5-488e-bb53-938c93d1c469",
    name: "Mead",
    description: "Probably not fit for human consumption",
    image1Url: "/img/mead_1.jpg",
    ingredients: {line1: "Honey", line2: "Petrol", line3: "Lighter Fluid"},
    specifics: {temperature: "Room Temp", chefName: "The monk we keep in the walls", pairingSuggestion: "Fomepizole 5mg", additionalInfo: "Do not consume"},
    stock: 0,
  }
]

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
      }) ?? {stock: 0};

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

  insertStock: publicProcedure
    .input(
      z.object({
        id: z.string(),
        stock: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {

    await ctx.db.beanStock.upsert({
      where: { id: input.id },
      update: { stock: input.stock },
      create: input,
    })

  }),
});

