import {type BeanOrder, OrderState} from "~/types/Types";
import {minsSinceDate} from "~/app/util/DateUtil";
import React from "react";

const OrderCard = (props: { order: BeanOrder }) => {

  let dropShadowStyle = "";
  let orderStateString = "";

  switch (props.order.orderState) {
    case OrderState.Pending:
      orderStateString = "Pending";
      break;
    case OrderState.Accepted:
      dropShadowStyle = "shadow-yellow-700";
      orderStateString = "Accepted";
      break;
    case OrderState.Completed:
      dropShadowStyle = "shadow-green-700";
      orderStateString = "Completed";
      break;
    case OrderState.Cancelled:
      dropShadowStyle = "shadow-red-700";
      orderStateString = "Cancelled";
      break;
  }

  return (
      <div
          className={dropShadowStyle + " max-w-sm rounded-lg bg-origin-padding overflow-hidden shadow-lg border-binge-off-black border-2 mt-5"}
          key={props.order.orderId}>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{props.order.beanName}</div>
          <p className="text-gray-700 text-base">
            Placed {minsSinceDate(props.order.orderPlacedDateTime)} minutes ago<br/>
            In State: {orderStateString}
          </p>
        </div>
      </div>
  );
}

export default OrderCard;