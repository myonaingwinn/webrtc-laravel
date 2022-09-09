import { Button, Layout, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import RoomComponent from "./RoomComponent";
import { useContext, useEffect, useState } from "react";
import { connectWithServer, getRoomList } from "../../helpers/SocketClient";
import { useSelector } from "react-redux";
import { localStorageGet } from "../../helpers/Utilities";
import Empty from "../Error/Empty";
import { SiderLeftContext } from "../Sider/Sider";

const RoomList = () => {
    const { Title } = Typography;
    const roomList = useSelector((state) => state.rooms.roomList);
    const { uuid } = localStorageGet("user") || {};
    const [showEmpty, setShowEmpty] = useState(false);
    const handleMenuClick = useContext(SiderLeftContext);

    useEffect(() => {
        document.title = "Room List";

        connectWithServer();
    }, []);

    const handleRoute = () => {
        handleMenuClick("/create_room");
        handleMenuClick(0);
    };

    useEffect(() => {
        getRoomList();

        if (roomList && Object.keys(roomList).length > 0) setShowEmpty(false);
        else setShowEmpty(true);
    }, [roomList]);

    return (
        <Layout className="room-list common">
            <Title className="title">Choose Room to Chat</Title>
            <Space direction="vertical">
                <Button
                    type="primary"
                    className="plus-btn"
                    onClick={handleRoute}
                >
                    Create a Room
                    <PlusOutlined />
                </Button>
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
