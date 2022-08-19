import { Layout, Typography } from "antd";

const Home = () => {
    const { Title } = Typography;

    return (
        <Layout className="home common">
            <Title className="title">Home Component</Title>
        </Layout>
    );
};

export default Home;
