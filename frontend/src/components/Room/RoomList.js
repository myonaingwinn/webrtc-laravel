import { Layout, Typography } from "antd";

const RoomList = () => {
    const { Title } = Typography;

    return (
        <Layout className="room-list common">
            <Title className="title">Room List Component</Title>
        </Layout>
    );
};

export default RoomList;
