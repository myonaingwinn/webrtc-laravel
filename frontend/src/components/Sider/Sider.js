import {
    LogoutOutlined,
    HomeOutlined,
    TeamOutlined,
    ClusterOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const { Sider } = Layout;

const SiderLeft = (props) => {
    const navigator = useNavigate();
    const [selectedKey] = useState(window.location.pathname);

    const getItem = (label, key, icon, children) => {
        return {
            key,
            icon,
            children,
            label,
            onClick: () => {
                if (key !== "sub1") handleMenuClick(key);
            },
        };
    };

    const items = [
        getItem("Home", "/", <HomeOutlined />),
        getItem("Online Users", "/users", <TeamOutlined />),
        getItem("Online Rooms", "sub1", <ClusterOutlined />, [
            getItem("Room List", "/rooms"),
            getItem("Create Room", "/create_room"),
        ]),
        getItem("Logout", "/logout", <LogoutOutlined />),
    ];

    const handleMenuClick = (key) => {
        if (key !== "/logout") {
            navigator(key);
        } else {
            props.handleLogout();
        }
    };

    return (
        <Layout className="sider">
            <Sider className="sider-left" theme="light">
                <Menu
                    defaultSelectedKeys={[selectedKey]}
                    mode="inline"
                    items={items}
                />
            </Sider>
            <Layout className="content">{props.children}</Layout>
        </Layout>
    );
};

export default SiderLeft;
