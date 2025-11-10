import {type BeanOrder} from "~/types/Types";

export const sortOrdersByDateAsc = (orders: BeanOrder[]): BeanOrder[] => {
  return orders.sort((a, b) => b.orderPlacedDateTime.getTime() - a.orderPlacedDateTime.getTime());
}
