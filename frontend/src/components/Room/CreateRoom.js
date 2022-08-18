import { Layout, Typography, Button, Form, Input, Card } from "antd";
import React, { useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

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
    const { Title } = Typography;
    const [form] = Form.useForm();
    const [roomName, setRoomName] = useState("");
    const [rooms, setRooms] = useState([]);
    const navigator = useNavigate();

    const handleSubmit = async () => {
        if (!(roomName === "")) {
            setRoomName(roomName);
            form.resetFields();
            console.log("room name is ", roomName);
            socket.emit("create_room", roomName);
            socket.on("get_room", (room) => {
                setRooms([...rooms, room]);
                console.log("room id is ", room.id, " and room name is ", room.roomName);
            });
            navigator("/rooms");
        }
    };

    return (
        <Layout className="create-room">
            {/* <Title className="title">Create Room Component</Title> */}
            <div
                className="site-card-wrapper"
            >
                <Card
                    title="Room Creation"
                    style={{
                        textAlign: "center",
                        width: "800px",
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
                            marginRight: "200px",
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
                            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
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
