import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from './../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { Button, Modal } from 'semantic-ui-react'
const DeleteTask = ({ changeOnClick, refreshTodo, oldtask }) => {
    const [open, setOpen] = useState(false)
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    useEffect(() => {
        setOpen(changeOnClick);
    }, [changeOnClick])
    const deleteTask = async () => {
        try {
            await sendRequest(
                `http://localhost:5000/api/todolist/deletetask/${oldtask.id}`,
                'POST',
                JSON.stringify({
                    userId: auth.userId,
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
                {isLoading && <div className="ui active inverted dimmer">
                    <div className="ui text loader">Loading</div>
                </div>}
                <Modal.Header>Clear Tasks </Modal.Header>
                <Modal.Content ><h4>Are you sure you want to delete this task?!</h4></Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => setOpen(false)}>
                        No
        </Button>
                    <Button color='green' onClick={deleteTask}>
                        Yes
                    </Button>
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
}
export default DeleteTask;
