import { Button, Col, Card, Row, notification, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import React, { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import { signalServerUrl, localStorageGet } from "../../helpers/Utilities";

const { Paragraph } = Typography;

const socket = io(signalServerUrl);

const RoomComponent = () => {
    const [roomList, setRoomList] = useState({});
    const navigator = useNavigate();
    const { id } = localStorageGet("user");

    useEffect(() => {
        socket.on("rooms", (rooms) => {
            setRoomList(rooms);
        });

        socket.on("updated rooms", (rooms) => {
            setRoomList(rooms);
            console.log("🚀 ~ file: RoomComponent.js ~ updated rooms", rooms);
        });

        socket.emit("get all rooms");
    }, [roomList]);

    const handleJoinRoom = (id) => {
        console.log("🚀 ~ file: Home.js ~ line 33 ~ handleJoinRoom ~ id", id);
        navigator(`/rooms/${id}`);
    };

    const deleteRoom = (key) => {
        console.log("room id is ", key);
        console.log("room created user id is ", roomList[key].createdBy);
        console.log("login user id is ", id);
        socket.emit("delete_room", key);
        notification.open({
            type: "success",
            message: "Room Delete Success!",
        });
        return navigator("/rooms");
    };
    return (
        <Row gutter={16} className="room-component">
            {Object.entries(roomList).length > 0 &&
                Object.keys(roomList).map((key) => {
                    return (
                        <Col className="gutter-row" span={8} key={key}>
                            <Card title={roomList[key].name} className="card"
                                extra={
                                    <div className="user-count">
                                        <UserOutlined />{" "}
                                        {Object.entries(roomList).length !== 0
                                            ? roomList[key].usersInRoom.length
                                            : 0}
                                    </div>
                                }
                            >
                                <Space>
                                    {roomList[key].description ? <Paragraph className="paragraph">
                                        {roomList[key].description}
                                    </Paragraph> : <Paragraph className="paragraph">No description...</Paragraph>}
                                </Space>
                                <Space>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        onClick={() => handleJoinRoom(key)}
                                        className="btn btn-sm join-btn"
                                    >
                                        Join Room
                                    </Button>
                                    {id === roomList[key].createdBy && (
                                        <Button
                                            type="danger"
                                            htmlType="submit"
                                            onClick={() => deleteRoom(key)}
                                            className="btn btn-sm delete-btn"
                                        >
                                            Delete Room
                                        </Button>
                                    )}
                                </Space>
                            </Card>
                        </Col>
                    );
                })}
        </Row >
    );
};
export default RoomComponent;
