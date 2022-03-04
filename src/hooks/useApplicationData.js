import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {

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
        setState(prev => ({
          ...prev,
          appointments,
          days: updateSpots(prev, appointments, id)
        }));
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
        setState(prev => ({
          ...state,
          appointments,
          days: updateSpots(prev, appointments, id)
        }));
        console.log(response);
        })

  }

  const updateSpots = (state, appointments, id) => (
    state.days.map(day => day.appointments.includes(id) ? {
      ...day,
      spots: day.appointments.filter(spot => !appointments[spot].interview).length
    } : day)
  );

  return { state, setDay, bookInterview, cancelInterview }

};