import { Button, Layout, Space, Typography } from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import RoomComponent from "./RoomComponent";
import { useEffect, useState } from "react";
import { getRoomList } from "../../helpers/SocketClient";
import { useSelector } from "react-redux";
import { localStorageGet } from "../../helpers/Utilities";
import Empty from "../Error/Empty";

const RoomList = () => {
    const { Title } = Typography;
    const roomList = useSelector((state) => state.rooms.roomList);
    const { uuid } = localStorageGet("user") || {};
    const [showEmpty, setShowEmpty] = useState(false);

    useEffect(() => {
        document.title = "Room List";
    }, []);

    useEffect(() => {
        getRoomList();

        if (roomList && Object.keys(roomList).length > 0) setShowEmpty(false);
        else setShowEmpty(true);
    }, [roomList]);

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
                {!showEmpty ? (
                    <RoomComponent uuid={uuid} roomList={roomList} />
                ) : (
                    <Empty description={"No Rooms found, create a new one!"} />
                )}
            </Space>
        </Layout>
    );
};

export default RoomList;
