import {
    LogoutOutlined,
    HomeOutlined,
    TeamOutlined,
    ClusterOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
const { Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem("Home", "1", <HomeOutlined />),
    getItem("Online Users", 2, <TeamOutlined />),
    getItem("Online Rooms", "sub1", <ClusterOutlined />, [
        getItem("Room List", "3"),
        getItem("Create Room", "4"),
    ]),
    getItem("Logout", "5", <LogoutOutlined style={{ color: "red" }} />),
];

const SiderLeft = (props) => {
    return (
        <Layout className="sider">
            <Sider className="sider-left" theme="light">
                <Menu defaultSelectedKeys={["1"]} mode="inline" items={items} />
            </Sider>
            <Layout className="content">{props.children}</Layout>
        </Layout>
    );
};

export default SiderLeft;
