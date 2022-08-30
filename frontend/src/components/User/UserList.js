import { Layout, Typography } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { connectWithServer, getOnlineUsers } from "../../helpers/SocketClient";

const UserList = () => {
    const { Title } = Typography;
    const users = useSelector((state) => state.onlineUserList.value);

    useEffect(() => {
        connectWithServer();
    }, []);

    useEffect(() => {
        document.title = "Online Users";

        getOnlineUsers();
    }, []);

    return (
        <Layout className="user-list common">
            <Title className="title">Online Users</Title>
            {users && Object.keys(users).map((user) => users[user].name)}
            <br />
        </Layout>
    );
};

export default UserList;
