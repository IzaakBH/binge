export enum OrderState {
  Pending,
  Accepted,
  Completed,
  Cancelled
}

export interface BeanOrder {
  orderId: string,
  beanName: string;
  name: string;
  orderState: OrderState,
  orderPlacedDateTime: Date
}