'use client'

import { useState } from 'react';
import {api} from "~/trpc/react";

export function Stock() {
  const {data: beanDetails = []} = api.bean.getBeanDetails.useQuery();
  const insertStock = api.bean.insertStock.useMutation({});

  const [stockValues, setStockValues] = useState<Record<string, string>>({});

  const handleStockChange = (beanId: string, value: string) => {
    setStockValues(prev => ({
      ...prev,
      [beanId]: value
    }));
  };

  const handleUpdateStock = (id: string) => {
    const stock = parseInt(stockValues[id] ?? '0', 10);
    insertStock.mutate({ id, stock });

    // Clear input after update
    setStockValues(prev => ({
      ...prev,
      [id]: ''
    }));
  };

  return (
    <div className="space-y-4">
      {beanDetails.map((bean) => (
        <div key={bean.id} className="flex items-center gap-3">
          <span>{bean.name}</span>
          <input
            type="number"
            onChange={(e) => handleStockChange(bean.id, e.target.value)}
            className="px-3 py-2 border rounded"
          />
          <button
            onClick={() => handleUpdateStock(bean.id)}
            disabled={!stockValues[bean.id]}
            className="rounded-full bg-binge-green px-3.5 py-2.5 text-sm font-semibold text-binge-off-black"
          >
            Update
          </button>
        </div>
      ))}
    </div>
  );
}
