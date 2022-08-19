import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { AiOutlineStepBackward } from "react-icons/ai";

const Mainform = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [data, setData] = useState({
        name: "",
        room: "",
        reciever: "",
        allmsgg: [],
    });
    const [name, setName] = useState("");
    const [socket, setSocket] = useState();
    const [users, setUsers] = useState({});
    const [gotoprivate, setGotoprivate] = useState(false);
    const [sender, setNotificationSender] = useState("");
    const [reciever, setNotificationReciever] = useState("");
    const [notificationcount, setNotificationcount] = useState();
    const [allmsg, setallMsg] = useState([]);

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

    useEffect(() => {
        if (socket) {
            socket.on("setnotification", (sender, reciever, newmsg, room) => {
                if (name === reciever) {
                    setNotificationSender(sender);
                    setNotificationReciever(reciever);
                    allmsg.push(newmsg);

                    if (gotoprivate === false) {
                        var count = allmsg.filter((alm) => alm.name === sender);
                        setNotificationcount(count.length);
                    }
                }
            });
        }
    }, [socket]);

    useEffect(() => {
        setName(location.state);
        setData({
            ...data,
            ["name"]: location.state,
        });
    }, [location]);

    const Handlechange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const validation = () => {
        if (!data.name) {
            setError("Please  enter the name");
            return false;
        }
        if (!data.room) {
            setError("Please select room");
            return false;
        }

        setError("");
        return true;
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const isvalidate = validation();
        if (isvalidate) {
            navigate(`/chat/message/${data.room}`, { state: data });
        }
    };
    const orderId = (user) => {
        if (users[name] > users[user]) {
            return users[name] + "-" + users[user];
        } else {
            return users[user] + "-" + users[name];
        }
    };

    const privatechat = (user) => {
        if (sender === user || !notificationcount) {
            setGotoprivate(true);

            const room = orderId(user);

            setData({
                ["name"]: name,
                ["room"]: room,
                ["reciever"]: user,
                ["allmsgg"]: allmsg,
            });
        }
    };
    useEffect(() => {
        if (gotoprivate)
            navigate(`/chat/message/${data.room}`, { state: data });
    }, [gotoprivate]);

    return (
        <div className="mainform chfull">
            <div className="chnavbar">
                <span
                    className="chhome"
                    onClick={() => {
                        navigate("/", { state: name });
                    }}
                    title="Go to Home"
                >
                    <AiOutlineStepBackward />
                </span>
                <span className="userprofilename" title="Your Name">
                    {name}
                </span>
            </div>
            <div className="formcontainer">
                <div className="userstitlebox">
                    <div className="userstitle">Online Users</div>
                </div>

                <div className="userbox">
                    {users &&
                        Object.keys(users).map((user, index) => {
                            return (
                                <div key={index}>
                                    {name === user ? null : (
                                        <span
                                            className="onlineusers"
                                            name="room"
                                            onClick={() => privatechat(user)}
                                        >
                                            {user}
                                            <span
                                                className={
                                                    notificationcount &&
                                                    sender === user &&
                                                    name === reciever
                                                        ? "notification"
                                                        : null
                                                }
                                            >
                                                {notificationcount &&
                                                sender === user &&
                                                name === reciever
                                                    ? notificationcount
                                                    : null}
                                            </span>
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                </div>

                {/* <form onSubmit={submitHandler}>
            
            
            <div>
                <select className='select' name='room' onChange={Handlechange}>
                    <option value='' className='selectarea'>SELECT ROOM</option>
                    <option value='gaming'>Gaming</option>
                    <option value='coding'>Coding</option>
                    <option value='social media'>Social Media</option>
                </select>
            </div>
            
            

            <button type='submit' className='buttn' >SUBMIT</button>
            {error ? <div><small className='text-danger'>{error}</small></div> : ""}
        </form> */}
            </div>
        </div>
    );
};

export default Mainform;
