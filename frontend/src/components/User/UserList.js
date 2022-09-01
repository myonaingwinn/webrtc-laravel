import { Layout, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { connectWithServer, getOnlineUsers } from "../../helpers/SocketClient";
import { localStorageGet } from "../../helpers/Utilities";
import Empty from "../Error/Empty";
import User from "./User";

const UserList = () => {
    const { Title } = Typography;
    const users = useSelector((state) => state.onlineUserList.value);
    const { uuid } = localStorageGet("user") || {};
    const [showEmpty, setShowEmpty] = useState(true);

    useEffect(() => {
        connectWithServer();
    }, []);

    useEffect(() => {
        document.title = "Online Users";

        getOnlineUsers();

        if (users && Object.keys(users).length > 1) setShowEmpty(false);
        else setShowEmpty(true);
    }, [users]);

    return (
        <Layout className="user-list common">
            <Title className="title">Online Users</Title>
            <Row
                gutter={[16, 32]}
                className="user-container"
                justify="space-evenly"
            >
                {!showEmpty ? (
                    users &&
                    Object.keys(users).map(
                        (userId) =>
                            uuid &&
                            uuid !== userId && (
                                <User user={users[userId]} key={userId} />
                            )
                    )
                ) : (
                    <Empty description="Nobody is Online, invite your friends!" />
                )}
            </Row>
        </Layout>
    );
};

export default UserList;
