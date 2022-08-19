import { Button, Layout, Space, Typography } from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import RoomData from "./RoomData";


const RoomList = () => {
    const { Title } = Typography;

    return (
        <Layout className="room-list common">
            <Title className="title">Room Component</Title>
            <Space direction="vertical">
                <Link to="/create_room">
                    <p style={{ marginLeft: "20px", fontWeight: "bold", fontSize: "17px" }}>Goto Create Room<Button type="primary" style={{ marginLeft: "10px" }}><PlusOutlined /></Button></p>
                </Link>
                <RoomData />
            </Space>
        </Layout>
    );
};

export default RoomList;
