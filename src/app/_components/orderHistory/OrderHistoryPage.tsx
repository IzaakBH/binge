'use client'

import {api} from "~/trpc/react";
import OrderCard from "~/app/_components/orderHistory/orderCard";
import React, { useEffect, useRef, useState } from "react";
import {LuBean} from "react-icons/lu";
import Header from "~/app/_components/header";
import {sortOrdersByDateAsc} from "~/app/util/OrdersUtil";
import { OrderState } from "@prisma/client";
import {type BeanOrder} from "~/types/Types";

interface SplitOrders {
  accepted: BeanOrder[],
  completed: BeanOrder[]
}

const OrderHistoryPage = () => {
  const [userName, setUserName] = useState("");
  const isFirstRender = useRef<boolean>(true);
  const prevAcceptedCount = useRef<number>(0);
  const prevCompletedCount = useRef<number>(0);
  const utils = api.useUtils();

  const musicPlayers = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio("/audio/burger.mp3") : undefined
  );

  useEffect(() => {
    if (typeof window === 'object') {
      setUserName(window.localStorage.getItem("name") ?? "");
    }
  }, [userName])

  const {data: orders = []} = api.bean.getBeanOrdersByName.useQuery({name: userName});

  useEffect(() => {
    const splitOrders: SplitOrders = {accepted: [], completed: []};

    for (const order of orders) {
      switch (order.orderState) {
        case OrderState.ACCEPTED:
          splitOrders.accepted.push(order);
          break;
        case OrderState.COMPLETED:
        case OrderState.CANCELLED:
          splitOrders.completed.push(order);
          break;
      }
    }

    // Check if there are new orders
    if (!isFirstRender.current && (splitOrders.accepted.length > prevAcceptedCount.current || splitOrders.completed.length > prevCompletedCount.current)) {
      void musicPlayers.current?.play();
    }

    // Update refs
    prevAcceptedCount.current = splitOrders.accepted.length;
    prevCompletedCount.current = splitOrders.completed.length;
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [orders]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      void utils.bean.invalidate().then(() => {//No-op
      });
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [orders, utils.bean]);

  if (!userName) {
    return (
        <p>Username not set</p>
    );
  }

  return (
      <>
        <Header/>

        <div className="z-0 p-8">
          <p className="text-binge-off-black text-xl ">Your Matches!</p>
          {orders.length === 0 ? (<p>You dont have any matches :(</p>) : ""}
          <div>
            {(sortOrdersByDateAsc(orders).map(order => (
                <OrderCard key={order.orderId} order={order}/>
            )))}
          </div>
        </div>

        {/*// TODO: Fix issue where user can swipe before entering name*/}
        <footer className="footer footer-center w-screen fixed bottom-0">
          <div className="flex justify-center pb-2">
            <a href="/swipe">
              <div className="p-4 bg-binge-off-white rounded-full shadow">
                <LuBean size="1.5em"/>
              </div>
            </a>
          </div>
        </footer>
      </>
  );
}

export default OrderHistoryPage;