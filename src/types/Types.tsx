import { type OrderState } from "@prisma/client";
import { type BeanIngredients, BeanSpecifics } from "~/server/api/routers/beans";

export interface BeanOrder {
  orderId: string,
  beanName: string;
  name: string;
  orderState: OrderState,
  orderPlacedDateTime: Date
}

export interface BeanDetails {
  id: string,
  name: string,
  description: string,
  image1Url: string,
  ingredients: BeanIngredients,
  specifics: BeanSpecifics,
  stock: number,
}