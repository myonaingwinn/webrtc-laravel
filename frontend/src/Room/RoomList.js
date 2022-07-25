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
    let userLists = [];
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
        socket.emit("join_room", room);
        setRoom(room.id);
        setJoinedRoom(true);
        console.log('you are in the ', room.id, 'room');
        console.log(socketId, " join the room ", room.id);
        console.log('maximum participant is ', room.maxParticipantsAllowed);
        userLists.push(socketId);
        console.log(userLists);
        socket.on("updateUsers", (userLists) => {
            setJoinedList(userLists);
        });
        // setJoinedList([...joinedList, socketId]);
        // console.log('user lists are ', userLists);
        console.log('Number of user in this room is ', userLists.length);
        console.log('joined list are ', room.usersJoined.length);
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            localVideo.current.srcObject = stream
        })
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
                        <h3 style={{ textAlign: 'center' }}>Now, You are in the Room!</h3>
                        <h4>Room Name : {room.roomName}</h4>
                        <video playsInline muted ref={localVideo} autoPlay style={{ width: "500px", marginLeft: '500px' }} />
                    </div>
                </>
            )}
        </>
    );
};

export default RoomList;