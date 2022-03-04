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
    // Fetches data from API server
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      // Safely sets state using spread
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });

  }, []);

  const bookInterview = (id, interview) => {

    // Creates new or updated state objects (without setting state)
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
        // Sets appointments state to reflect new or edited interview
        setState(prev => ({
          ...prev,
          appointments,
          // Updates remaining spots
          days: updateSpots(prev, appointments, id)
        }));
      })
  };

  const cancelInterview = (id) => {

    // Creates new state objects to reflect delete (without setting state)
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
        // Sets appointments state to reflect deleted interview
        setState(prev => ({
          ...state,
          appointments,
          // Updates remaining spots
          days: updateSpots(prev, appointments, id)
        }));
      })

  }

  // Updates spots remaining state after create, edit, or a delete
  const updateSpots = (state, appointments, id) => (
    // Create new days array with either the same day object, or if ID matches, spreads day object and safely updates it
    state.days.map(day => day.appointments.includes(id) ? {
      ...day,
      // Counts spots remaining by creating an array of only empty interviews and taking its length, using this value to update spots remaining
      spots: day.appointments.filter(spot => !appointments[spot].interview).length
    } : day)
  );

  return { state, setDay, bookInterview, cancelInterview }

};