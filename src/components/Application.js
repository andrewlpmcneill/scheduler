import React, { useState, useEffect } from "react";
import axios from 'axios';
import DayList from "./DayList";
import "components/Application.scss";
import Appointment from "components/Appointment/index";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
// import useVisualMode from "hooks/useVisualMode";

export default function Application() {
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => setState({ ...state, day });

  useEffect(() => {

    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });

  }, []);

  const bookInterview = (id, interview) => {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    
    return axios.put(`/api/appointments/${id}`, appointment)
      .then(response => {
        setState({
          ...state,
          appointments
        });
        console.log(response);
        })

  };

  const cancelInterview = (id) => {

    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios.delete(`/api/appointments/${id}`)
      .then(response => {
        setState({
          ...state,
          appointments
        });
        console.log(response);
        })

  }
  
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
