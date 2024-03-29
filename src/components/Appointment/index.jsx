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
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const ERROR_EDIT = "ERROR_EDIT";

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  // When user saves a create or edit, calls DB via axios (via bookInterview()), sets appropriate views and/or catches error
  const save = (name, interviewer) => {

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
  };

  const onDelete = () => {
    transition(CONFIRM);
  }

  const onEdit = () => {
    transition(EDIT);
  }

  // When user confirms a delete, deletes to DB via axios (via cancelInterview()), sets appropriate views and/or catches error
  const confirm = () => {

    transition(DELETING);

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
        <Status message="Saving"/>
      )}
      {mode === DELETING && (
        <Status message="Deleting"/>
      )}
      {mode === CONFIRM && (
        <Confirm message="Are you sure you would like to delete?" onConfirm={confirm} onCancel={cancel}/>
      )}
      {mode === ERROR_SAVE && (
        <Error message="Save unsuccessful." onClose={() => { transition(CREATE) }}/>
      )}
      {mode === ERROR_DELETE && (
        <Error message="Delete unsuccessful." onClose={() => { transition(SHOW) } }/>
      )}
      {mode === ERROR_EDIT && (
        <Error message="Edit unsuccessful." onClose={() => { transition(EDIT) } }/>
      )}
    </article>

  )


};