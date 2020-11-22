import React, { useState, useContext, useEffect } from 'react'
import DateTimePicker from 'react-datetime-picker';
import { AuthContext } from './../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ValidationError from '../components/ValidationError';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,isValid
} from '../../shared/util/validators';
import { Button, Modal } from 'semantic-ui-react'
const UpdateTask = ({ changeOnClick, refreshTodo, oldtask }) => {
    const [open, setOpen] = useState(false)
    const [value, onChange] = useState(null);
    const [notes, setNotes] = useState('');
    const [name, setName] = useState('');
    const [priority, setPriority] = useState('');
    const [done, setDone] = useState('');

    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const validationHandler = (val, numOfLetters) => {
        const validators = [VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(numOfLetters)];
        return isValid(val, validators);
    }
    useEffect(() => {

        setOpen(changeOnClick);
        if (oldtask) {

            setName(oldtask.name)
            setPriority(oldtask.priority)
            setDone(oldtask.complete)
            setNotes(oldtask.notes)
            onChange(new Date(oldtask.date))
        }
    }, [changeOnClick])
    const updateTask = async () => {

        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/todolist/updatetask/${oldtask.id}`,
                'POST',
                JSON.stringify({
                    userId: auth.userId,
                    name: name,
                    priority: priority,
                    notes: notes,
                    date: value,
                    complete: done
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token,
                }
            );
            setOpen(false);

            refreshTodo();
        } catch (err) { setOpen(false); }
    }
    return (
        <React.Fragment>
            {error && <ErrorModal error={error} onClear={clearError} />}
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
            >
                <Modal.Header>Add a new Task </Modal.Header>
                {oldtask && <Modal.Content >
                    {isLoading && <div className="ui active inverted dimmer">
                        <div className="ui text loader">Loading</div>
                    </div>}
                    <div className="ui form error">
                        <div className="field">
                            <label style={{ marginTop: "10px" }}>Task Name</label>
                            <input type="text" onChange={event => setName(event.target.value)} defaultValue={oldtask.name} />
                            {validationHandler(name, 4) === false && <ValidationError err="Please enter a valid name with 4 letters or more" />}
                            <label style={{ marginTop: "10px" }}>Priority</label>
                            <select className="ui search dropdown" onChange={event => setPriority(event.target.value)} defaultValue={oldtask.priority}>
                                <option value="0" > High</option>
                                <option value="1"> Normal</option>
                                <option value="2"> Low</option>
                            </select>
                            <label style={{ marginTop: "10px" }}>Notes</label>
                            <textarea rows="2" placeholder="Notes..." onChange={event => setNotes(event.target.value)} defaultValue={oldtask.notes}></textarea>
                            {validationHandler(notes, 20) === false && <ValidationError err="Please enter a valid note with 20 letters or more" />}
                            <label style={{ marginTop: "10px" }}>Done</label>
                            <select className="ui search dropdown" onChange={event => setDone(event.target.value)} defaultValue={oldtask.complete}>
                                <option value="0" >NO</option>
                                <option value="1">In Progress</option>
                                <option value="2">YES</option>
                            </select>
                            <label style={{ marginTop: "10px" }}>Pick a time and date</label>
                        </div>
                    </div>
                    <DateTimePicker
                        onChange={onChange} 
                        value={value}
                    />
                     {value === null && <ValidationError err="Please enter a valid date" />}
                </Modal.Content>}
                <Modal.Actions>
                    <Button color='black' onClick={() => setOpen(false)}>
                        Cancel
        </Button>
                    <Button
                        content="Save"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={updateTask}
                        positive
                        disabled={validationHandler(name, 4) === false || validationHandler(notes, 20) === false || value === null}
                    />
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
}
export default UpdateTask;
