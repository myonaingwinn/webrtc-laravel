import { Button, Form, Input } from "antd";
import {
    baseUrl,
    isLoggedIn,
    localStorageRemove,
    localStorageSet,
} from "../../helpers/Utilities";
import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const SERVER_URL = "http://localhost:5000";

export const socket = io(SERVER_URL);

const formItemLayout = {
    labelCol: {
        xs: {
            span: 8,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [connecting, setConnecting] = useState(false);
    const [form] = Form.useForm();
    const [me, setMe] = useState();
    const navigator = useNavigate();
    const [userName, setUserName] = useState();

    useEffect(() => {
        socket.on("me", (id) => {
            setMe(id);
        });
        if (isLoggedIn()) {
            console.log("setUserName value :", userName);
            var data = { name: userName, userId: me };
            socket.emit("setSocketId", data);
            return navigator("/users");
        }
    });

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleRegisterSubmit = (e) => {
        return navigator("/register");
    };

    const handleSubmit = async () => {
        setConnecting(true);
        if (!(email === "" || password === "")) {
            const data = await fetch(baseUrl + "/login", {
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .catch((err) => console.log(err));

            console.log(data);
            data["me"] = me;
            setUserName(data.name);
            console.log("id is ", data.id);

            data.id
                ? localStorageSet("user", data)
                : localStorageRemove("user");

            setConnecting(false);
        }
    };

    return (
        <>
            <div className="site-card-wrapper">
                <Card
                    title="Login"
                    style={{
                        textAlign: "center",
                        width: "800px",
                        margin: "0 auto",
                        marginTop: "80px",
                    }}
                >
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="register"
                        style={{
                            marginTop: "30px",
                            marginRight: "200px",
                        }}
                        colon={false}
                        requiredMark={false}
                    >
                        <Form.Item
                            name="email"
                            label="Email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            readOnly={connecting}
                            rules={[
                                {
                                    type: "email",
                                    message: "The input is not valid email!",
                                },
                                {
                                    required: true,
                                    message: "Please input your email!",
                                },
                            ]}
                        >
                            <Input placeholder="Enter your email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            readOnly={connecting}
                            rules={[
                                {
                                    type: "string",
                                    min: 8,
                                    message:
                                        "Password must have at least 8 characters!",
                                },
                                {
                                    required: true,
                                    message: "Please input your password!",
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder="Enter your password" />
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <div>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={handleSubmit}
                                    disabled={
                                        connecting || !(email && password)
                                    }
                                >
                                    Login
                                </Button>
                            </div>
                            <div style={{ marginTop: "20px", display: "flex" }}>
                                <p
                                    style={{
                                        marginLeft: "150px",
                                        color: "red",
                                    }}
                                >
                                    Have No Account?
                                </p>
                                <Button
                                    type="link"
                                    htmlType="submit"
                                    onClick={handleRegisterSubmit}
                                    style={{ marginLeft: "auto" }}
                                >
                                    Register
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </>
    );
};

export default Login;
