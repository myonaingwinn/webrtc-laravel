import {
    Button,
    Layout,
    Typography,
    Form,
    Input,
    Card,
    notification,
} from "antd";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { localStorageGet, signalServerUrl } from "../../helpers/Utilities";

const formItemLayout = {
    labelCol: {
        xs: {
            span: 5,
        },
        sm: {
            span: 5,
        },
    },
    wrapperCol: {
        xs: {
            span: 19,
        },
        sm: {
            span: 19,
        },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            offset: 1,
        },
        sm: {
            offset: 1,
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

    useEffect(() => {
        document.title = "Create Room";
    });

    const createRoom = () => {
        const roomId = nanoid();
        const { id } = localStorageGet("user");
        if (!(roomName === "")) {
            setRoomName(roomName);
            form.resetFields();
            var roomObj = {
                id: roomId,
                name: roomName,
                usersInRoom: [],
                createdBy: id,
            };
            socket.emit("create_room", roomObj);
            socket.on("get_room", (roomObj) => {
                setRoomList([...roomList, roomObj]);
                console.log(
                    "room id is ",
                    roomObj.id,
                    " and room name is ",
                    roomObj.roomName
                );
            });
            notification.open({
                type: "success",
                message: "Room Creation Success!",
            });
            navigator("/rooms");
        } else {
            notification.open({
                type: "error",
                message: "Room Creation Fail!",
                description: "room name cannot be blank!",
            });
        }
    };

    return (
        <Layout className="create-room common">
            <Title className="title">
                Create a Room to chat with your friends
            </Title>
            <div className="site-card-wrapper">
                <Card title="Room Creation" className="card">
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="room"
                        colon={false}
                        requiredMark={false}
                        onFinish={() => createRoom()}
                    >
                        <Form.Item
                            name="roomName"
                            label="Room name :"
                            id="name"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter room name.",
                                },
                            ]}
                        >
                            <Input placeholder="Enter room name" />
                        </Form.Item>

                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">
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
