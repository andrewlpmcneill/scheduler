import React from "react";
import DayListItem from "./DayListItem";

export default function DayList (props) {

  const listItems = props.days.map(item => {
    return <DayListItem {...item} setDay={props.setDay} />
  })

  return (

    <ul>
      {listItems}
    </ul>

  )

}