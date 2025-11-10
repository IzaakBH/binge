import {type BeanSpecifics} from "~/server/api/routers/beans";
import {LuChefHat, LuLightbulb, LuThermometer, LuWine, LuUtensilsCrossed} from "react-icons/lu";

const SpecificsCard = (props: { specifics: BeanSpecifics, stock: number }) => {

  return (
      <div className="bg-binge-off-white relative box-border border-2 border-binge-off-black w-full rounded-lg mt-4">
        <div className="grid grid-cols-4 p-3 pb-3 ">
          <div className="flex p-2 border-r-2">
            <LuThermometer size="1.5em"/>
            <p className="pl-2">{props.specifics.temperature}</p>
          </div>
          <div className="col-span-3 flex p-2 ">
            <LuChefHat size="1.5em"/>
            <p className="pl-2">{props.specifics.chefName}</p>
          </div>

          <div className="col-span-4 flex p-2 border-t-2">
            <LuWine size="1.5em"/>
            <p className="pl-2">{props.specifics.pairingSuggestion}</p>
          </div>

          <div className="col-span-4 flex p-2 border-t-2">
            <LuLightbulb size="1.5em"/>
            <p className="pl-2">{props.specifics.additionalInfo}</p>
          </div>

          <div className="col-span-4 flex p-2 border-t-2">
            <LuUtensilsCrossed size="1.5em"/>
            <p className="pl-2">{props.stock} in stock</p>
          </div>
        </div>
      </div>
  )
}

export default SpecificsCard;