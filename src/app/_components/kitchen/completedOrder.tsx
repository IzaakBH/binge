import {type BeanOrder, OrderState} from "~/types/Types";
import React from "react";
import {minsSinceDate} from "~/app/util/DateUtil";

const CompletedOrder = (props: { order: BeanOrder }) => {

  return (
      <div
          className={"max-w-sm rounded-lg bg-origin-padding overflow-hidden shadow-lg border-binge-off-black border-2 m-5" + (props.order.orderState === OrderState.Cancelled ? " shadow-red-700" : "")}
          key={props.order.orderId}>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{props.order.beanName}</div>
          <p className="text-gray-700 text-base">
            For: {props.order.name}<br/>
            Placed {minsSinceDate(props.order.orderPlacedDateTime)} minutes ago
          </p>
        </div>
      </div>
  )

}

export default CompletedOrder;