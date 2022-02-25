export function getAppointmentsForDay(state, day) {

  const output = [];
  for (const key of state.days) {
    if (key.name === day) {
      key.appointments.forEach(appointment => {
        output.push(state.appointments[appointment]);
      })
    };
  }
  return output;

};