import React from 'react'
import { useContext } from 'react';
import { useHistory } from "react-router-dom";
import { Menu } from 'semantic-ui-react'
import { AuthContext } from '../../context/auth-context';
import AuthModal from '../UIElements/AuthModal'
const Main = () => {
    const auth = useContext(AuthContext);
    let history = useHistory();
    const handleItemHome = () => {
        history.push("/home");
    }
    const handleItemTodo = () => {
        history.push("/todolist");
    }
    const handleItemProfile = () => {
        history.push("/userprofile");
    }
    return (
        <Menu size='large' color='blue'>
            <Menu.Item
                name='Home'
                onClick={handleItemHome}
            ><i class=" large home blue icon"></i></Menu.Item>
            {auth.isLoggedIn && (<Menu.Item
                name='MY To Do List'
                onClick={handleItemTodo}
            ><i class=" large tasks blue icon" ></i></Menu.Item>)}
            {auth.isLoggedIn && (<Menu.Item
                name='User'
                onClick={handleItemProfile}
            ><i class=" large user blue icon" ></i></Menu.Item>)}
            <Menu.Menu position='right' color='blue' >
                {auth.isLoggedIn && (
                    <Menu.Item
                        name=''
                        onClick={auth.logout}>
                        <i class=" large log out blue icon"></i>
                    </Menu.Item>
                )}
                {!auth.isLoggedIn && (
                    <AuthModal />
                )}
            </Menu.Menu>
        </Menu>
    )
}
export default Main;