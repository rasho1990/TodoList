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
    const clearTodos = async () => {
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/todolist/clearalltasks`,
          "POST",
          JSON.stringify({
            userId: auth.userId,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setOpen(false);
        refreshTodo();
      } catch (err) {
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
                {isLoading && <div className="ui active inverted dimmer">
                    <div className="ui text loader">Loading</div>
                </div>}
                <Modal.Header>Clear Tasks </Modal.Header>
                <Modal.Content ><h4>Are you sure you want to delete all tasks?!</h4></Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => setOpen(false)}>
                        No
                    </Button>
                    <Button color='green' onClick={clearTodos}>
                        Yes
                    </Button>
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
}

export default CleanListModal;
