import { Layout } from "antd";
import { Link } from "react-router-dom";
import SiderLeft from "../Sider/Sider";
import { Avatar, Space, Dropdown, Menu } from "antd";
import { localStorageGet, localStorageRemove } from "../../helpers/Utilities";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const HeaderTop = (props) => {
    const { name } = localStorageGet("user");
    const navigator = useNavigate();

    const logout = () => {
        localStorageRemove("user");
        navigator("/login");
    };

    const menu = (
        <Menu
            items={[
                {
                    key: "1",
                    label: "Logout",
                    onClick: () => {
                        logout();
                    },
                },
            ]}
        />
    );

    return (
        <Layout className="header">
            <Header className="header-top">
                <div className="logo" onClick={() => window.location.reload()}>
                    <Link to="/">WebRTC</Link>
                </div>
                <div className="profile">
                    <Dropdown overlay={menu} placement="bottomRight" arrow>
                        <Space>
                            <Avatar
                                style={{
                                    backgroundColor: "#87d068",
                                    verticalAlign: "middle",
                                }}
                                gap={4}
                            >
                                {name.charAt(0).toUpperCase()}
                            </Avatar>

                            {name}
                        </Space>
                    </Dropdown>
                </div>
            </Header>
            <SiderLeft>{props.children}</SiderLeft>
        </Layout>
    );
};

export default HeaderTop;
