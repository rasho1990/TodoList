import React from 'react'
import { Button, Modal, Menu } from 'semantic-ui-react'
import Auth from '../../../user/pages/Auth'
const  AuthModal=()=> {
  const [open, setOpen] = React.useState(false)
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={ <Menu.Item><i class=" large sign in blue icon" ></i></Menu.Item>}
    >
      <Modal.Header>Welcome to TodoList.com </Modal.Header>
      <Modal.Content >
        <Auth />
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default AuthModal
