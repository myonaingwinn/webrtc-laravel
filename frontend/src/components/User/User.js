import { Avatar, Col, Row, Space, Typography } from "antd";
import { mdiMessageText, mdiPhone } from "@mdi/js";
import Icon from "@mdi/react";
import { getColor } from "../../helpers/Utilities";
import { localStorageGet } from "../../helpers/Utilities";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const { Title } = Typography;

const User = ({ user, handleCall, socket }) => {
    const ellipsis = true;
    const navigate = useNavigate();
    const { uuid, name } = localStorageGet("user") || {};
    const [data, setData] = useState({
        name: "",
        room: "",
        reciever: "",
        allmsgg: [],
    });

    const [gotoprivate, setGotoprivate] = useState(false);
    const allmsg = [];

    const orderId = () => {
        if (uuid > user.uuid) {
            return uuid + "-" + user.uuid;
        } else {
            return user.uuid + "-" + uuid;
        }
    };

    const handleMessage = () => {
        socket.emit("send noti", { senderName: name, recieverId: user.uuid });
        setGotoprivate(true);
        const room = orderId();
        setData({
            name: name,
            room: room,
            reciever: user.name,
            recieverId: user.uuid,
            allmsgg: allmsg,
        });
    };

    useEffect(() => {
        if (gotoprivate) navigate(`/chat/${data.room}`, { state: data });
        
        // eslint-disable-next-line
    }, [gotoprivate]);

    return (
        <Col span={5} className="user-card">
            <Row>
                <Col span={8}>
                    <Avatar
                        style={{
                            backgroundColor: getColor(user.name),
                        }}
                        size={{
                            md: 40,
                            lg: 45,
                            xl: 50,
                            xxl: 70,
                        }}
                        className="user-avatar"
                        shape="square"
                    >
                        {user.name && user.name.charAt(0).toUpperCase()}
                    </Avatar>
                </Col>
                <Col span={16}>
                    <Title
                        level={4}
                        ellipsis={ellipsis ? { tooltip: user.name } : false}
                    >
                        {user.name}
                    </Title>
                    <Space size="middle" className="user-controls">
                        <Icon
                            path={mdiPhone}
                            title="Video call"
                            size={1.2}
                            onClick={() => {
                                handleCall(user.socketId);
                            }}
                        />
                        <Icon
                            path={mdiMessageText}
                            title="Send message"
                            size={1.2}
                            onClick={handleMessage}
                        />
                    </Space>
                </Col>
            </Row>
        </Col>
    );
};

export default User;
