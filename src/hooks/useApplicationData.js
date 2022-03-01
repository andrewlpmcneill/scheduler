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
          days: prev.days.map(day => day.appointments.includes(id) ? {...day, spots: day.spots - 1} : day)
        }));
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
        setState(prev => ({
          ...state,
          appointments,
          days: prev.days.map(day => day.appointments.includes(id) ? {...day, spots: day.spots + 1} : day)
        }));
        console.log(response);
        })

  }

  return { state, setDay, bookInterview, cancelInterview }

};