import { Button, Layout, Space, Typography } from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import RoomComponent from "./RoomComponent";


const RoomList = () => {
    const { Title } = Typography;

    return (
        <Layout className="room-list common">
            <Title className="title">Room Component</Title>
            <Space direction="vertical">
                <Link to="/create_room">
                    <p className="create-btn-text">Goto Create Room<Button type="primary" className="plus-btn"><PlusOutlined /></Button></p>
                </Link>
                <RoomComponent />
            </Space>
        </Layout>
    );
};

export default RoomList;
