import { Button, Col, Layout, Typography } from "antd";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";

const CreateRoom = () => {
    const { Title } = Typography;
    const navigator = useNavigate();

    const createRoom = () => {
        const id = v4();
        navigator(`/rooms/${id}`);
    };

    return (
        <Layout className="create-room common">
            <Title className="title">Create Room Component</Title>
            <Col>
                <Button type="primary" onClick={createRoom}>
                    Create Room
                </Button>
            </Col>
        </Layout>
    );
};

export default CreateRoom;
