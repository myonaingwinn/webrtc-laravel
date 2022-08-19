import { Button, Layout, Typography, Form, Input, Card } from "antd";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import io from "socket.io-client";
import { localStorageGet } from "../../helpers/Utilities";
import { signalServerUrl } from "../../helpers/Utilities";

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

const socket = io(signalServerUrl);

const CreateRoom = () => {
    const { Title } = Typography;
    const navigator = useNavigate();
    const [form] = Form.useForm();
    const [roomName, setRoomName] = useState("");
    const [roomList, setRoomList] = useState([]);

    const createRoom = () => {
        const roomId = nanoid();
        const { id } = localStorageGet("user");
        if (!(roomName === "")) {
            setRoomName(roomName);
            form.resetFields();
            var roomObj = { id: roomId, name: roomName, usersInRoom: [], createdBy: id };
            socket.emit("create_room", roomObj);
            socket.on("get_room", (roomObj) => {
                setRoomList([...roomList, roomObj]);
                console.log("room id is ", roomObj.id, " and room name is ", roomObj.roomName);
            });
            navigator("/rooms");
        }
    };

    return (
        <Layout className="create-room common">
            <Title className="title">Create Room Component</Title>
            <div
                className="site-card-wrapper"
            >
                <Card
                    title="Room Creation"
                    className="card"
                    style={{
                        textAlign: "center",
                        width: "500px",
                        margin: "0 auto",
                        marginTop: "80px",
                    }}
                >
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="room"
                        style={{
                            marginTop: "30px",
                            marginRight: "50px",
                            alignItems: "center"
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
                                    message: "Please input room name!",
                                },
                            ]}
                        >
                            <Input placeholder="Enter room name" />
                        </Form.Item>

                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" onClick={createRoom}>
                                Create
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </Layout>
    );
};

export default CreateRoom;
