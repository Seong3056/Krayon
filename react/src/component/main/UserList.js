import React, { useEffect, useState } from 'react';
import '../../resource/scss/main/UserList.scss';
const UserList = ({ userList }) => {
    const [list, setList] = useState([]);

    useEffect(() => {
        console.log(userList);
        setList(userList);
    }, [userList]);

    return (
        <>
            <ul class="user-list">
                {/* {list.map((e) => (
                    <li>{e}</li>
                ))} */}
            </ul>
        </>
    );
};

export default UserList;
