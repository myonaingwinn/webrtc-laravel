import React, { useState, useEffect } from "react";
import { localStorageGet } from "../../helpers/Utilities";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

const UserList = () => {
    const { name } = localStorageGet("user");
    const [username, setUsername] = useState(name);
    const [userList, setUserList] = useState([]);
    const [me, setMe] = useState("");

    useEffect(() => {
        socket.on("me", (id) => {
            setMe(id);
        });
        socket.on("getAllUsers", (users) => {
            setUserList(users);
        });
        socket.on("updateAllUsers", (users) => {
            setUserList(users);
        });

    }, [userList]);

    var data = { name: username, userId: me };
    socket.emit("setSocketId", data);

    return (
        <>
            <ul className="users">
                {userList.map((user) => {
                    return (
                        <li className="user" key={user.userId}>
                            {user && user === me ? user.name : user.name}
                        </li>
                    );
                })}
            </ul>
        </>
    )
}
export default UserList;