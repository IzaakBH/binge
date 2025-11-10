'use client'

import React from "react";
import {api} from "~/trpc/react";

export function Stock() {
  const resetStock = api.bean.insertStock.useMutation({});

  return (
    <button className="rounded-full bg-binge-green px-3.5 py-2.5 text-sm font-semibold text-binge-off-black" onClick={() => resetStock.mutate()}>
      Reset Stock
    </button>
  );

}