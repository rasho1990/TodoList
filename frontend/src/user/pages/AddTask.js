import React, { useState, useContext, useEffect } from 'react'
import DateTimePicker from 'react-datetime-picker';
import { AuthContext } from './../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import ValidationError from '../components/ValidationError';
import { Button, Modal } from 'semantic-ui-react'
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE, isValid
} from '../../shared/util/validators';
const AddTask = ({ changeOnClick, refreshTodo }) => {
    
    const [open, setOpen] = useState(false);
    const [value, onChange] = useState(null);
    const [notes, setNotes] = useState('');
    const [name, setName] = useState('');
    const [priority, setPriority] = useState('0');
    const [done, setDone] = useState('0');
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const validationHandler = (val, numOfLetters) => {
        const validators = [VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(numOfLetters)];
        return isValid(val, validators);
    }

    useEffect(() => {
        setOpen(changeOnClick);
    }, [changeOnClick])
    const fetchTodos = async () => {
        try {
            await sendRequest(
                `http://localhost:5000/api/todolist/addtask`,
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

            setName('');
            setNotes('');
            onChange('');
            setOpen(false);
            refreshTodo();
        } catch (err) {
            setName('');
            setNotes('');
            onChange('');
            setOpen(false);
        }

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
                <Modal.Content >
                    {isLoading && <div className="ui active inverted dimmer">
                        <div className="ui text loader">Loading</div>
                    </div>}
                    <div className="ui form error">
                        <div className="field">
                            <label>Task Name</label>
                            <input type="text" placeholder="Task Name" onChange={event => setName(event.target.value)} onBlur={validationHandler(name, 4)} />
                            {validationHandler(name, 4) === false && <ValidationError err="Please enter a valid name with 4 letters or more" />}
                            <label style={{ marginTop: "10px" }}>Priority</label>
                            <select className="ui search dropdown" onChange={event => setPriority(event.target.value)} >
                                <option value="" disabled>Choose a priority</option>
                                <option defaultValue="0" > High</option>
                                <option value="1"> Normal</option>
                                <option value="2"> Low</option>
                            </select>
                            <label style={{ marginTop: "10px" }}>Notes</label>
                            <textarea rows="2" placeholder="Notes..." onChange={event => setNotes(event.target.value)} onBlur={validationHandler(notes, 20)}></textarea>
                            {validationHandler(notes, 20) === false && <ValidationError err="Please enter a valid note with 20 letters or more" />}
                            <label style={{ marginTop: "10px" }}>Done</label>
                            <select className="ui search dropdown" onChange={event => setDone(event.target.value)}>
                                <option value="0" > Yes</option>
                                <option value="1"> No</option>
                                <option value="2"> In Progress</option>
                            </select>
                            <label style={{ marginTop: "10px" }}>Pick a time and date</label>
                        </div>
                    </div>
                    <DateTimePicker
                        onChange={onChange}
                        value={value}
                        required={true}

                    />
                    {value === null && <ValidationError err="Please enter a valid date" />}
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        setName('');
                        setNotes('');
                        onChange(null);
                        setOpen(false)
                    }
                    }>
                        Cancel
        </Button>
                    <Button
                        content="Save"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={fetchTodos}
                        positive
                        disabled={validationHandler(name, 4) === false || validationHandler(notes, 20) === false || value === null}
                    />
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
}

export default AddTask;
