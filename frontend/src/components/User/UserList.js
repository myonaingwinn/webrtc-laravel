import { Layout, Row, Typography } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { connectWithServer, getOnlineUsers } from "../../helpers/SocketClient";
import { localStorageGet } from "../../helpers/Utilities";
import User from "./User";

const UserList = () => {
    const { Title } = Typography;
    const users = useSelector((state) => state.onlineUserList.value);
    const { uuid } = localStorageGet("user") || {};

    useEffect(() => {
        connectWithServer();
    }, []);

    useEffect(() => {
        document.title = "Online Users";

        getOnlineUsers();
    }, [users]);

    return (
        <Layout className="user-list common">
            <Title className="title">Online Users</Title>
            <Row
                gutter={[16, 32]}
                className="user-container"
                justify="space-evenly"
            >
                {users &&
                    Object.keys(users).map(
                        (userId) =>
                            uuid &&
                            uuid !== userId && (
                                <User user={users[userId]} key={userId} />
                            )
                    )}
            </Row>
        </Layout>
    );
};

export default UserList;
