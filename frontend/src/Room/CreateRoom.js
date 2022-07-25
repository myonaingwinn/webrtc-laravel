import {
    Button,
    Form,
    Input,
    Card,
    Col,
    Row,
} from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import io from "socket.io-client";

const formItemLayout = {
    labelCol: {
        xs: {
            span: 8,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 24,
            offset: 8,
        },
    },
};

const socket = io("http://localhost:5000");

const CreateRoom = () => {
    const [form] = Form.useForm();
    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState("");
    const [room, setRoom] = useState("");
    // const [participant, setParticipant] = useState("");
    const localVideo = useRef();
    const [display, setDisplay] = useState(true);
    const [joinedRoom, setJoinedRoom] = useState(false);
    const [stream, setStream] = useState();
    const [socketId, setSocketId] = useState("");
    const [users, setUsers] = useState([]);
    const [joinedList, setJoinedList] = useState([]);

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

        // socket.on("room_full", (room) => {
        //     setParticipant(room.maxParticipantsAllowed);
        //     alert("This Room has reached Maximum Number.You cannot Join!");
        // });

        if (joinedRoom === true) {
            console.log('you are in the room!')
        }
    }, [rooms]);

    const handleSubmit = async () => {
        if (!(roomName === '')) {
            setRoomName(roomName);
            console.log('user id is ', socketId);
            console.log('room name is ', roomName);
            socket.emit("create_room", roomName);
            socket.on("get_room", (room) => {
                setRooms([...rooms, room]);
                console.log('room id is ', room.id);
            })
        }
        setDisplay(false)
    };

    const joinRoom = (room) => {
        socket.on("usersList", (joinedList) => {
            setJoinedList(joinedList);
            console.log('Join Users are ', joinedList);
            console.log('Number of user in this room is ', joinedList.length);
            if (joinedList.length > room.maxParticipantsAllowed) {
                alert("This Room has reached Maximum Limit!");
                window.location.href= '/';
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

    return (
        <>
            {!joinedRoom && (
                <div className="rooms-container" style=
                    {{
                        display: display ? 'none' : 'block',
                    }}>
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
                </>
            )}

            <div className="site-card-wrapper" style=
                {{
                    display: display ? 'block' : 'none',
                }}>
                <Card title="Room Creation" style=
                    {{
                        textAlign: 'center',
                        width: '800px',
                        margin: '0 auto',
                        marginTop: '80px'
                    }}
                >
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="room"
                        style=
                        {{
                            marginTop: '30px',
                            marginRight: '200px'
                        }}
                        colon={false}
                        requiredMark={false}
                    >
                        <Form.Item
                            name="roomName"
                            label="Room Name"
                            id="name"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input room name!',
                                },
                            ]}
                        >
                            <Input placeholder='Enter room name' />
                        </Form.Item>

                        <Form.Item
                            {...tailFormItemLayout}
                        >
                            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                                Create
                            </Button>
                        </Form.Item>

                    </Form>
                </Card>
            </div>
        </>
    );
};

export default CreateRoom;