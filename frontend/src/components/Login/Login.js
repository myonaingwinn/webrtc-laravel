import { Button, Col, Form, Input, notification, Row, Space } from "antd";
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
            span: 6,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
            span: 18,
        },
        sm: {
            span: 18,
        },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 18,
            offset: 6,
        },
        sm: {
            span: 18,
            offset: 6,
        },
    },
};

const Login = ({ handleLoading }) => {
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
            handleLoading();
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
                navigator("/");
            } else {
                notification.open({
                    type: "error",
                    message: "Login Fail!",
                    description: "Incorrect mail or password.",
                });
            }
            handleLoading();
        }
    };

    return (
        <>
            <Row className="login" align="center">
                <Col >
                    <Card title="Login" className="card">
                        <Form
                            {...formItemLayout}
                            form={form}
                            name="register"
                            colon={false}
                            requiredMark={false}
                            className="form"
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
                </Col>
            </Row>
        </>
    );
};

export default Login;
