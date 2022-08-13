import { Layout } from "antd";
import SiderLeft from "../Sider/Sider";

const { Header } = Layout;

const HeaderTop = (props) => {
    return (
        <Layout className="header">
            <Header className="header-top" />
            <SiderLeft>{props.children}</SiderLeft>
        </Layout>
    );
};

export default HeaderTop;
