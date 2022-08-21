import { Layout } from "antd";
import SiderLeft from "../Sider/Sider";
import { Avatar, Space, Dropdown, Menu } from "antd";
import { localStorageGet } from "../../helpers/Utilities";
import React, { useState } from "react";

const { Header } = Layout;

const HeaderTop = (props) => {
    const user = localStorageGet("user");
    const [name, setName] = useState(user.name);
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

    const menu = (
        <Menu
            items={[
                {
                    key: "1",
                    label: (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.antgroup.com"
                        >
                            Logout
                        </a>
                    ),
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
