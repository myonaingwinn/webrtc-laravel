import { Button, Layout, Typography } from "antd";
import { Link } from "react-router-dom";

const Home = () => {
    const { Title } = Typography;

    return (
        <Layout className="home common">
            <Title className="title">Home Component</Title>
            <Link to="/create_room">
                <Button>Goto Create Room</Button>
            </Link>
        </Layout>
    );
};

export default Home;
