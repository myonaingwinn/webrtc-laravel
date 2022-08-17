import { Layout, Typography } from "antd";

const UserList = () => {
    const { Title } = Typography;

    return (
        <Layout className="user-list common">
            <Title className="title">User List Component</Title>
        </Layout>
    );
};

export default UserList;
