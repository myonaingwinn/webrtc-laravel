import { Layout } from "antd";
import SiderLeft from "../Sider/Sider";
import { Avatar, Space, Dropdown, Menu } from "antd";
import { localStorageGet, localStorageRemove } from "../../helpers/Utilities";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const HeaderTop = (props) => {
    const { name } = localStorageGet("user");
    const ColorList = [
        "#f56a00",
        "#7265e6",
        "#ffbf00",
        "#00a2ae",
        "#fa8c16",
        "#fa541c",
    ];
    const id = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
    const color = ColorList[id];
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
                <div className="profile">
                    <Dropdown overlay={menu} placement="bottomRight" arrow>
                        <Space>
                            <Avatar
                                style={{
                                    backgroundColor: color,
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
