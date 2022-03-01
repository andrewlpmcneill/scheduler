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

export function getInterview(state, interview) {

  if (!interview) return null; 

  const interviewerIDString = String(interview.interviewer)
  return {

    "student": interview.student,
    "interviewer": {
      "id": interview.interviewer,
      "name": state.interviewers[interviewerIDString].name,
      "avatar": state.interviewers[interviewerIDString].avatar
    }

  };

};

export function getInterviewersForDay(state, day) {

  const output = [];
  for (const key of state.days) {
    if (key.name === day) {
      key.interviewers.forEach(interviewer => {
        output.push(state.interviewers[interviewer]);
      })
    };
  }
  return output;

}