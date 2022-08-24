import { Button, Layout, Space, Typography } from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import RoomComponent from "./RoomComponent";
import { useEffect } from "react";

const RoomList = () => {
    const { Title } = Typography;

    useEffect(() => {
        document.title = "Room List";
    });

    return (
        <Layout className="room-list common">
            <Title className="title">Choose Room to Chat</Title>
            <Space direction="vertical">
                <Link to="/create_room">
                    <p className="create-btn-text">
                        Create a Room
                        <Button type="primary" className="plus-btn">
                            <PlusOutlined />
                        </Button>
                    </p>
                </Link>
                <RoomComponent />
            </Space>
        </Layout>
    );
};

export default RoomList;
