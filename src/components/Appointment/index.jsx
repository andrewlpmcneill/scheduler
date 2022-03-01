import React from "react";
import "components/Appointment/styles.scss"
import Header from "components/Appointment/Header"
import Show from "components/Appointment/Show"
import Empty from "components/Appointment/Empty"
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error"
import useVisualMode from "hooks/useVisualMode";

export default function Appointment (props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const ERROR_EDIT = "ERROR_EDIT";

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  const save = (name, interviewer) => {

    if (props.interview) console.log('test');

    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch(() => {
        props.interview ? transition(ERROR_EDIT, true) : transition(ERROR_SAVE, true);
      })

    // transition(SHOW);

  };

  const onDelete = () => {

    transition(CONFIRM);

    
  }

  const onEdit = () => {

    transition(EDIT);

  }
  
  const confirm = () => {
    
    transition(SAVING);

    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch(() => {
        transition(ERROR_DELETE, true);
      })
    
  }

  const cancel = () => {

    transition(SHOW);

  }

  return (

    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={onDelete}
        onEdit={onEdit}
      />
      )}
      {mode === CREATE && (
      <Form
        interviewers={props.interviewers}
        onCancel={back}
        onSave={save}
      />
      )}
      {mode === EDIT && (
      <Form
        interviewers={props.interviewers}
        onCancel={back}
        onSave={save}
        student={props.interview.student}
        interviewer={props.interview.interviewer.id}
      />
      )}
      {mode === SAVING && (
        <Status />
      )}
      {mode === CONFIRM && (
        <Confirm message="Are you sure you would like to delete?" onConfirm={confirm} onCancel={cancel}/>
      )}
      {mode === ERROR_SAVE && (
        <Error message="Save unsuccessful." onClose={() => { transition(EMPTY) }}/>
      )}
      {mode === ERROR_DELETE && (
        <Error message="Delete unsuccessful." onClose={() => { transition(SHOW) } }/>
      )}
      {mode === ERROR_EDIT && (
        <Error message="Edit unsuccessful." onClose={() => { transition(SHOW) } }/>
      )}
    </article>

  )


};