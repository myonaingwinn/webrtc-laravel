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
import { createNewRoom } from "../../helpers/SocketClient";
import {
    VALID001,
    VALID002,
    NOTI001,
    NOTI002,
    DES001,
} from "../../helpers/Messages";

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
                roomFull: false,
                description: roomDescription,
            };
            createNewRoom(roomObj);
            notification.open({
                type: "success",
                message: NOTI001,
            });
            navigator("/rooms");
        } else {
            notification.open({
                type: "error",
                message: NOTI002,
                description: DES001,
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
                                    message: VALID001,
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
                                    message: VALID002,
                                },
                            ]}
                        >
                            <TextArea
                                rows={2}
                                placeholder="Enter description"
                            />
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
