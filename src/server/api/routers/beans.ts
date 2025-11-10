import {z} from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type BeanOrder, OrderState } from "~/types/Types"

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

export interface BeanDetails {
  id: string,
  name: string,
  description: string,
  image1Url: string,
  ingredients: BeanIngredients,
  specifics: BeanSpecifics,
}

const beanOrders: BeanOrder[] = [
  {
    orderId: "abc",
    beanName: "Borlotti Beans",
    name: "John",
    orderState: OrderState.Pending,
    orderPlacedDateTime: new Date(),
  },
  {
    orderId: "def",
    beanName: "Homemade Cider",
    name: "Jane",
    orderState: OrderState.Accepted,
    orderPlacedDateTime: new Date(),
  }
];

const beanDetails: BeanDetails[] = [
  {
    id: "3d1e1622-e9f5-488e-bb53-938c93d1c465",
    name: "Borlotti Beans",
    description: "In a tomato sauce",
    image1Url: "/img/borlotti_beans_1.jpg",
    ingredients: {line1: "Glue", line2: "Glue", line3: "Glue"},
    specifics: {temperature: "Hot", chefName: "Mr Tom Hibbs", pairingSuggestion: "Homemade Cider", additionalInfo: "Do not consume if you have a pacemaker"}
  },
  {
    id: "3d1e1622-e9f5-488e-bb53-938c93d1c466",
    name: "Mead",
    description: "Not fit for human consumption",
    image1Url: "/img/mead_1.jpg",
    ingredients: {line1: "Honey", line2: "Petrol", line3: "Lighter Fluid"},
    specifics: {temperature: "Room Temp", chefName: "The monk we keep in the walls", pairingSuggestion: "Fomepizole 5mg", additionalInfo: "Do not consume"}
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

      // const order =
      await ctx.db.order.create({
        data: {
          beanId: beanDetails
            .filter((detail) => detail.name === input.beanName)
            .map((detail) => detail.id)[0] ?? 'Unknown Bean Id',
          name: input.user,
        },
      });
      return;
      // beanOrders.push({
      //   orderId: crypto.randomUUID(),
      //   beanName: input.beanName,
      //   name: input.user,
      //   orderState: OrderState.Pending,
      //   orderPlacedDateTime: new Date(),
      // })
      // console.log("Ordering beans " + input.beanName + " for user " + input.user);
    }),

  acceptOrder: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;

      const order = beanOrders.find((order) => order.orderId === input.orderId);
      if (order) {
        order.orderState = OrderState.Accepted;
      }
    }),

  completeOrder: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;

      const order = beanOrders.find((order) => order.orderId === input.orderId);
      if (order) {
        order.orderState = OrderState.Completed;
      }
    }),

  rejectOrder: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;

      const order = beanOrders.find((order) => order.orderId === input.orderId);
      if (order) {
        order.orderState = OrderState.Cancelled;
      }
    }),

  getBeanOrders: publicProcedure.query(async ({ctx}) => {
    return await ctx.db.order.findMany() ?? [];
    // return beanOrders;
  }),

  getBeanOrdersByName: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;

      return beanOrders.filter((order) => order.name === input.name);
    }),

  getBeanDetails: publicProcedure.query(() => {
    return beanDetails;
  }),
});

