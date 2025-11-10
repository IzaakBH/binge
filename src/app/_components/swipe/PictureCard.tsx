"use client";

import {LuBean} from "react-icons/lu";
import {type BeanDetails} from "~/types/Types";

export function PictureCard(props: { beanDetails: BeanDetails, onMatch: () => void }) {
  return (
      <div style={{backgroundImage: `url('${props.beanDetails.image1Url}')`}}
           className="bg-[image:var(--background-image-url)] relative box-border bg-center bg-no-repeat bg-cover w-full aspect-square rounded-lg mt-4">
        <button onClick={props.onMatch}>
          <div className="absolute bottom-0 right-0 box-border bg-binge-off-white bg-origin-padding drop-shadow rounded-full m-2">
            <div className="p-3">
              <LuBean size="1.5em"/>
            </div>
          </div>
        </button>
      </div>
  )
}