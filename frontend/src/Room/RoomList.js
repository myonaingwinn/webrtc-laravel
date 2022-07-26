import {
    Card,
    Col,
    Row,
} from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [room, setRoom] = useState("");
    const localVideo = useRef();
    const [joinedRoom, setJoinedRoom] = useState(false);
    const [stream, setStream] = useState();
    const [joinedList, setJoinedList] = useState([]);
    const [socketId, setSocketId] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on("me", (id) => {
            setSocketId(id);
        });
        socket.on("disconnect", () => {
            socket.disconnect();
        });

        socket.on("getAllUsers", (users) => {
            setUsers(users);
        });
        // Real time
        socket.on("updateUsers", (users) => {
            setUsers(users);
        });
        socket.on("getAllRooms", (rooms) => {
            setRooms(rooms);
        });
        // Real time
        socket.on("updateRooms", (rooms) => {
            setRooms(rooms);
        });

        if (joinedRoom === true) {
            console.log('you are in the room!')
        }
    }, [rooms]);

    const joinRoom = (room) => {
        socket.on("usersList", (joinedList) => {
            setJoinedList(joinedList);
            console.log('Join Users are ', joinedList);
            console.log('Number of user in this room is ', joinedList.length);
            if (joinedList.length > room.maxParticipantsAllowed) {
                alert("This Room has reached Maximum Limit!");
                window.location.href = '/';
            }
        })
        socket.emit("join_room", room);
        setRoom(room.id);
        setJoinedRoom(true);
        console.log('user ', socketId, ' joined room: ', room.id);
        console.log('maximum participants allowed are ', room.maxParticipantsAllowed);
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            localVideo.current.srcObject = stream
        })
    };

    const leaveRoom = (room) => {
        console.log('this is in leave room');
        socket.emit("leave_room", room);
        console.log('user ', socketId, ' leave from room ', room);
        socket.on("leftUsers", (leftList) => {
            setLeftList(leftList);
            console.log('Remain Users are ', leftList);
            console.log('Number of user remain in this room is ', leftList.length);
        })
        window.location.href = '/';
    };

    return (
        <>
            {!joinedRoom && (
                <div className="rooms-container">
                    <h2 className="rooms_heading" style={{ textAlign: 'center' }}>Available Rooms:</h2>

                    {rooms.length === 0 ? (
                        <h3 className="no_rooms">No Rooms! Create a room !</h3>
                    ) : (
                        <Row gutter={16}>
                            {rooms.map((room) => {
                                return (
                                    <Col className="gutter-row" span={6} key={room.id}>
                                        <Card size="small" title={room.roomName}>
                                            <button onClick={() => joinRoom(room)}>Join Room</button>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    )
                    }
                </div >
            )}

            {joinedRoom && (
                <>
                    <div className="video-container" style={{ marginTop: '50px' }}>
                        <video playsInline muted ref={localVideo} autoPlay style={{ width: "500px", marginLeft: '500px' }} />
                    </div>
                    <div className='leave-room'>
                        <button className='btn btn-primary' onClick={() => leaveRoom(room)}>Leave Room</button>
                    </div>
                </>
            )}
        </>
    );
};

export default RoomList;