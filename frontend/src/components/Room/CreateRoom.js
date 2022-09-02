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
import { localStorageGet } from "../../helpers/Utilities";
import { connectWithServer, createNewRoom } from "../../helpers/SocketClient";

const { TextArea } = Input;

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

const CreateRoom = () => {
    const { Title } = Typography;
    const navigator = useNavigate();
    const [form] = Form.useForm();
    const [roomName, setRoomName] = useState("");
    const [roomDescription, setRoomDescription] = useState("");

    useEffect(() => {
        document.title = "Create Room";

        connectWithServer();
    }, []);

    const createRoom = () => {
        const roomId = nanoid();
        const { uuid } = localStorageGet("user") || {};
        if (!(roomName === "")) {
            setRoomName(roomName);
            setRoomDescription(roomDescription);
            form.resetFields();
            var roomObj = {
                id: roomId,
                name: roomName,
                usersInRoom: [],
                chat: [],
                createdBy: uuid,
                description: roomDescription,
            };
            createNewRoom(roomObj);
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
                                    message: 'Room name is required.',
                                },
                            ]}
                        >
                            <Input placeholder="Enter room name" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Description :"
                            value={roomDescription}
                            onChange={(e) => setRoomDescription(e.target.value)}
                            rules={[
                                {
                                    max: 80,
                                    message: 'Description cannot be longer than 80 characters.',
                                },
                            ]}
                        >
                            <TextArea rows={2} placeholder="Enter description" />
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
