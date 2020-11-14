import React, { useState, useContext, useEffect } from 'react'
import DateTimePicker from 'react-datetime-picker';
import { AuthContext } from './../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { Button, Modal } from 'semantic-ui-react'
const UpdateTask = ({ changeOnClick, refreshTodo, oldtask }) => {
    const [open, setOpen] = useState(false)
    const [value, onChange] = useState();
    const [notes, setNotes] = useState('');
    const [name, setName] = useState('');
    const [priority, setPriority] = useState('');
    const [done, setDone] = useState('');

    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    useEffect(() => {

        setOpen(changeOnClick);
        if (oldtask) {
             
            setName(oldtask.name)
            setPriority(oldtask.priority)
            setDone(oldtask.compelete)
            setNotes(oldtask.notes)
        }
    }, [changeOnClick])
    const updateTask = async () => {

        try {
            await sendRequest(
                `http://localhost:5000/api/todolist/updatetask/${oldtask.id}`,
                'POST',
                JSON.stringify({
                    userId: auth.userId,
                    name: name,
                    priority: priority,
                    notes: notes,
                    date: value,
                    compelete: done
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
                    {isLoading && <div class="ui active inverted dimmer">
                        <div class="ui text loader">Loading</div>
                    </div>}
                    <div class="ui form">
                        <div class="field">
                            <label>Task Name</label>
                            <input type="text" onChange={event => setName(event.target.value)} defaultValue={oldtask.name} />
                            <label>Priority</label>
                            <select class="ui search dropdown" onChange={event => setPriority(event.target.value)} defaultValue={oldtask.priority}>
                                <option value="0" > High</option>
                                <option value="1"> Normal</option>
                                <option value="2"> Low</option>
                            </select>
                            <label>Notes</label>
                            <textarea rows="2" placeholder="Notes..." onChange={event => setNotes(event.target.value)} defaultValue={oldtask.notes}></textarea>
                            <label>Done</label>
                            <select class="ui search dropdown" onChange={event => setDone(event.target.value)} defaultValue={oldtask.compelete}>
                                <option value="0" > Yes</option>
                                <option value="1"> No</option>
                                <option value="2"> In Progress</option>
                            </select>
                            <label>Pick a time and date</label>
                        </div>
                    </div>
                    <DateTimePicker
                        onChange={onChange}
                        defaultValue={oldtask.date}
                        value={value}
                    />
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
                    />
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
}
export default UpdateTask;
