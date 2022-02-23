import React from "react";
import DayListItem from "./DayListItem";

export default function DayList (props) {

  const listItems = props.days.map(item => {
    return <DayListItem {...item} key={item.id} setDay={props.setDay} selected={item.name === props.day} />
  })

  return (

    <ul>
      {listItems}
    </ul>

  )

}