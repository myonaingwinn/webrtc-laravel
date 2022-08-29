import { Layout, Typography } from "antd";
import { useEffect } from "react";

const UserList = () => {
    const { Title } = Typography;

    useEffect(() => {
        document.title = "Online Users";
    });

    return (
        <Layout className="user-list common">
            <Title className="title">Online Users</Title>
        </Layout>
    );
};

export default UserList;
