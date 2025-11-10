'use client'

import {api} from "~/trpc/react";
import React, {useEffect, useRef, useMemo} from "react";
import {type BeanOrder} from "~/types/Types";
import PendingOrder from "~/app/_components/kitchen/pendingOrder";
import AcceptedOrder from "~/app/_components/kitchen/acceptedOrder";
import CompletedOrder from "~/app/_components/kitchen/completedOrder";
import {sortOrdersByDateAsc} from "~/app/util/OrdersUtil";
import { OrderState } from "@prisma/client";

interface SplitOrders {
  pending: BeanOrder[],
  accepted: BeanOrder[],
  completed: BeanOrder[]
}

export function Orders() {
  const isFirstRender = useRef<boolean>(true);
  const prevOrderCount = useRef<number>(0);
  const utils = api.useUtils();
  const {data: orders = []} = api.bean.getBeanOrders.useQuery();

  const musicPlayers = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio("/audio/maccas.m4a") : undefined
  );

  const splitOrders = useMemo(() => {
    const tSplitOrders: SplitOrders = {pending: [], accepted: [], completed: []};

    for (const order of orders) {
      switch (order.orderState) {
        case OrderState.PENDING:
          tSplitOrders.pending.push(order);
          break;
        case OrderState.ACCEPTED:
          tSplitOrders.accepted.push(order);
          break;
        case OrderState.COMPLETED:
        case OrderState.CANCELLED:
          tSplitOrders.completed.push(order);
          break;
      }
    }

    // Check if there are new orders
    if (!isFirstRender.current && orders.length > prevOrderCount.current) {
      void musicPlayers.current?.play();
    }

    // Update refs
    prevOrderCount.current = orders.length;
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }

    return tSplitOrders;
  }, [orders]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      void utils.bean.invalidate().then(() => {//No-op
      });
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [orders, utils.bean]);

  return (
      <div className="flex flex-row justify-around w-full h-screen overflow-y-hidden">
        <div className="flex flex-col items-center w-1/3 overflow-auto">
          {/*  Pending orders*/}
          <p className="justify-center">Pending</p>
          <div className="flex flex-col">
            {
              splitOrders.pending ? (sortOrdersByDateAsc(splitOrders.pending).map(pendingOrder => (
                  <PendingOrder key={pendingOrder.orderId} order={pendingOrder}/>
              ))) : (<></>)
            }
          </div>
        </div>

        <div className="flex flex-col items-center w-1/3 overflow-auto">
          {/* Accepted Orders */}
          <p className="justify-center">Accepted</p>
          <div className="flex flex-col">
            {
              splitOrders.pending ? (sortOrdersByDateAsc(splitOrders.accepted).map(acceptedOrder => (
                  <AcceptedOrder key={acceptedOrder.orderId} order={acceptedOrder}/>
              ))) : (<></>)
            }
          </div>
        </div>

        <div className="flex flex-col items-center w-1/3 overflow-auto">
          {/* Completed Orders */}
          <p className="justify-center">Completed</p>
          <div className="flex flex-col">
            {
              splitOrders.completed ? (sortOrdersByDateAsc(splitOrders.completed).map(completedOrder => (
                  <CompletedOrder key={completedOrder.orderId} order={completedOrder}/>
              ))) : (<></>)
            }
          </div>
        </div>
      </div>
  )
}