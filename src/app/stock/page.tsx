import {HydrateClient} from "~/trpc/server";
import {Stock} from "~/app/_components/stok/stock";
import React from "react";

export default async function Page() {
  return (
      <HydrateClient>
        <body>
        <Stock/>
        </body>
      </HydrateClient>
  )
}