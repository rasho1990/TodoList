import React, { useState, useContext, useEffect } from 'react'
import DateTimePicker from 'react-datetime-picker';
import { AuthContext } from './../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { Button, Modal } from 'semantic-ui-react'
const AddTask = ({ changeOnClick, refreshTodo }) => { 
    const [open, setOpen] = useState(false)
    const [value, onChange] = useState('');
    const [notes, setNotes] = useState('');
    const [name, setName] = useState('');
    const [priority, setPriority] = useState('0');
    const [done, setDone] = useState('0');
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
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
                <Modal.Content >
                    {isLoading && <div className="ui active inverted dimmer">
                        <div className="ui text loader">Loading</div>
                    </div>}
                    <div className="ui form">
                        <div className="field">
                            <label>Task Name</label>
                            <input type="text" placeholder="Task Name" onChange={event => setName(event.target.value)} />
                            <label>Priority</label>
                            <select className="ui search dropdown" onChange={event => setPriority(event.target.value)} >
                                <option value="" disabled>Choose a priority</option>
                                <option defaultValue="0" > High</option>
                                <option value="1"> Normal</option>
                                <option value="2"> Low</option>
                            </select>
                            <label>Notes</label>
                            <textarea rows="2" placeholder="Notes..." onChange={event => setNotes(event.target.value)} ></textarea>
                            <label>Done</label>
                                <select className="ui search dropdown" onChange={event => setDone(event.target.value)}>
                                    <option value="0" > Yes</option>
                                    <option value="1"> No</option>
                                    <option value="2"> In Progress</option>
                                </select>
                            <label>Pick a time and date</label>
                        </div>
                    </div>
                    <DateTimePicker
                        onChange={onChange}
                        value={value}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => setOpen(false)}>
                        Cancel
        </Button>
                    <Button
                        content="Save"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={fetchTodos}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
}

export default AddTask;
