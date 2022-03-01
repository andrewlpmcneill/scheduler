import React, { useState, useEffect } from "react";
import axios from 'axios';
import DayList from "./DayList";
import "components/Application.scss";
import Appointment from "components/Appointment/index";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";
// import useVisualMode from "hooks/useVisualMode";

export default function Application() {
  
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();
  
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {getAppointmentsForDay(state, state.day).map(item => {
          const interview = getInterview(state, item.interview);
          return (
            <Appointment key={item.id} {...item} interview={interview} interviewers={getInterviewersForDay(state, state.day)} bookInterview = {bookInterview} cancelInterview = {cancelInterview}
            />
          );
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
