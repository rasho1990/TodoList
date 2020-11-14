import React, { useContext, useState, useEffect } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { AuthContext } from './../../context/auth-context';
import { useHttpClient } from '../../hooks/http-hook';
import ErrorModal from '../UIElements/ErrorModal';
const CleanListModal = ({ changeOnClick, refreshTodo }) => {
    const [open, setOpen] = useState(false)
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext);
    useEffect(() => {
        setOpen(changeOnClick);
    }, [changeOnClick])
    const clearTodo = async () => {
        try {
            await sendRequest(
                `http://localhost:5000/api/todolist/clearalltasks`,
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
        } catch (err) {
            setOpen(false);
        }
    }
    console.log(open)
    return (
        <React.Fragment>
            {error && <ErrorModal error={error} onClear={clearError} />}
            <Modal class="ui basic modal"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
            // trigger={<Button color='green'> Yes </Button>}
            >
                {isLoading && <div class="ui active inverted dimmer">
                    <div class="ui text loader">Loading</div>
                </div>}
                <Modal.Header>Clear Tasks </Modal.Header>
                <Modal.Content ><h4>Are you sure you want to delete all tasks?!</h4></Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => setOpen(false)}>
                        No
        </Button>
                    <Button color='green' onClick={clearTodo}>
                        Yes
                    </Button>
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
}

export default CleanListModal;
