import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const Namesec = () => {
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [socket, setSocket] = useState();
    const [users, setUsers] = useState({});
    const [newuser, setNewuser] = useState([]);
    const [namematched, setNamematched] = useState(false);

    useEffect(() => {
        Object.keys(users).map((user) => {
            if (namematched === false) {
                if (name === user) {
                    setNamematched(true);
                }
            } else {
                setNamematched(false);
            }
        });
    }, [name]);

    useEffect(() => {
        const socket = io("https://tempchatbackendsuvro.herokuapp.com/");
      
      
        setSocket(socket);
        socket.on(
            "all_users",
            (users) => {
                setUsers(users);
            },
            []
        );
    }, []);

    const Handlechange = (e) => {
        setName(e.target.value);
    };
    const validator = () => {
        if (!name) {
            setError("Please  enter the name");
            return false;
        }
        if (namematched === true) {
            setError("User already exist");
            return false;
        }
        if (name.length > 10) {
            setError("Name should not contain more than 10 charecters");
            return false;
        } else return true;
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const validation = validator();
        if (validation) {
            socket.emit("new_users", name);
            navigate(`/chat/message/mainform`, { state: name });
        }
    };
    return (
        <div className="formcontainer">
            <div>
                <h2 className="welcometxt">
                    Welcome to{" "}
                    <span
                        style={{
                            color: "rgb(120, 2, 255)",
                            fontWeight: "bold",
                        }}
                    >
                        Chat
                    </span>
                </h2>
            </div>
            <form onSubmit={submitHandler}>
                <div>
                    <input
                        type="text"
                        className=" name"
                        name="name"
                        placeholder="Enter a unique name"
                        onChange={Handlechange}
                    />
                </div>
                <button type="submit" className="buttn">
                    SUBMIT
                </button>
            </form>
            {error ? <small className="text-danger">{error}</small> : ""}
        </div>
    );
};

export default Namesec;
