'use client'

import {PictureCard} from "~/app/_components/swipe/PictureCard";
import {type BeanDetails} from "~/types/Types";
import MatchModal from "~/app/_components/swipe/MatchModal";
import {useState} from "react";
import {api} from "~/trpc/react";
import SwipeButton from "~/app/_components/swipe/SwipeButton";
import IngredientsCard from "~/app/_components/swipe/IngredientsCard";
import SpecificsCard from "~/app/_components/swipe/SpecificsCard";

const Offering = (props: { beanDetails: BeanDetails, userName: string, onSwipe: () => void }) => {

  const [isMatch, setIsMatch] = useState<boolean>(false);

  const orderBeans = api.bean.orderBeans.useMutation({
    onSuccess: async () => {
      setIsMatch(false);
      props.onSwipe();
    },
  });

  const onConfirmMatch = () => {
    orderBeans.mutate({beanName: props.beanDetails.name, user: props.userName});
  }

  const onRejectMatch = () => {
    setIsMatch(false);
    props.onSwipe();
  }

  return (
      <div className="flex flex-col bg-binge-off-white min-w-full p-8">

        {/*Bean name section*/}
        <div className="w-full">
          <p className="text-binge-off-black text-xl">{props.beanDetails.name}</p>
          <p className="text-binge-off-black text-lg">{props.beanDetails.description}</p>
        </div>

        <PictureCard beanDetails={props.beanDetails} onMatch={() => setIsMatch(true)}/>

        <SpecificsCard specifics={props.beanDetails.specifics} stock={props.beanDetails.stock} />

        <IngredientsCard beanIngredients={props.beanDetails.ingredients}/>

        <div className="pb-12"></div>

        <SwipeButton onSwipe={() => props.onSwipe()}/>

        {/*//TODO: Make user confirm they want to order after a match. To avoid unexpected orders.*/}
        <MatchModal isOpen={isMatch} beanName={props.beanDetails.name} onConfirmMatch={() => onConfirmMatch()} onRejectMatch={() => onRejectMatch()}/>
      </div>
  )
}

export default Offering;