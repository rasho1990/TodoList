import React, { useState, useContext, useEffect } from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from './../../shared/context/auth-context';
const UserProfile = () => {
    const [users, setUsers] = useState();
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest } = useHttpClient();
    const fetchUsers = async () => {
        const url = `${process.env.REACT_APP_BACKEND_URL}/users`;
        try {
            const responseData = await sendRequest(url);
            setUsers(responseData.users.filter(u => u.id === auth.userId));
        } catch (err) {
            console.log("Error in fetching users!", err);
        }
    };
    // Fetch users before page loads, with empty [] only runs once
    useEffect(() => {
        fetchUsers();
    }, [sendRequest]);
    return (<React.Fragment>
        {error && <ErrorModal error={error} /> }
        <div className="ui center aligned basic segment">
            {isLoading &&
                <div className="ui active inverted dimmer">
                    <div className="ui text loader">Loading</div>
                </div>}
            {users && !error && <div className="ui centered card ">
                <div className="image">
                    <img src={users[0].image} alt={users[0].name} />
                </div>
                <div className="content">
                    <h1>{users[0].name}</h1>
                    <div className="ui list">
                        <div className="item">
                            <i className="mail icon"></i>
                            <div className="content">
                                <a href={users[0].email}>{users[0].email}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    </React.Fragment>)
}
export default UserProfile;