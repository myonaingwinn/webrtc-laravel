import { Layout, Typography } from "antd";
import { useEffect } from "react";

const Home = () => {
    const { Title } = Typography;

    useEffect(() => {
        document.title = "Home";
    });

    return (
        <Layout className="home common">
            <Title className="title">Home</Title>
        </Layout>
    );
};

export default Home;
