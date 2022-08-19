import { Button, Form, Input, notification, Space } from "antd";
import {
    baseUrl,
    isLoggedIn,
    localStorageRemove,
    localStorageSet,
} from "../../helpers/Utilities";
import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { Link, useNavigate } from "react-router-dom";

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
    const [form] = Form.useForm();
    const navigator = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) return navigator("/");
    });

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async () => {
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
            console.log("id is ", data.id);

            data.id
                ? localStorageSet("user", data)
                : localStorageRemove("user");

            if (data.id) {
                notification.open({
                    type: "success",
                    message: "Login Success!",
                });
                return navigator("/");
            } else {
                notification.open({
                    type: "error",
                    message: "Login Fail!",
                    description: "Incorrect mail or password.",
                });
            }
        }
    };

    return (
        <div className="login">
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
                        rules={[
                            {
                                type: "email",
                                message: "Please enter valid email!",
                            },
                            {
                                required: true,
                                message: "Please enter your email!",
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
                        rules={[
                            {
                                required: true,
                                message: "Please enter your password!",
                            },
                        ]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="btn-login"
                            onClick={handleSubmit}
                        >
                            Login
                        </Button>
                    </Form.Item>
                    <div className="link-register">
                        <Space>
                            Don't have an account?
                            <Link to="/register">Register</Link>
                        </Space>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
