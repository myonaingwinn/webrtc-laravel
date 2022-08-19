import { Button, Form, Input, notification } from "antd";
import React, { useState } from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import {
    baseUrl,
} from "../../helpers/Utilities";
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

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [form] = Form.useForm();
    const navigator = useNavigate();

    const handleSubmit = async () => {
        if (!(name === "" || email === "" || password === "")) {
            await fetch(baseUrl + "/register", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    console.log(res);
                    if (res.ok) {
                        notification.open({
                            type: 'success',
                            message: 'Register Success!',
                        });
                        return navigator("/login");
                    } else {
                        notification.open({
                            type: 'error',
                            message: 'Register Fail!',
                        });
                        return navigator("/register");
                    }
                })
                .catch((err) => {
                    notification.open({
                        type: 'error',
                        message: 'Register Fail!',
                    });
                    console.log(err);
                    return navigator("/register");
                });
        }
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLoginSubmit = (e) => {
        return navigator("/login");
    };

    return (
        <>
            <div className="register">
                <Card
                    title="Register"
                    className="card"
                    style={{
                        textAlign: "center",
                        width: "800px",
                        margin: "0 auto",
                        marginTop: "80px",
                        borderRadius: "10px",
                        boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
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
                            name="name"
                            label="Name"
                            id="name"
                            value={name}
                            onChange={handleNameChange}
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your name!",
                                },
                            ]}
                        >
                            <Input placeholder="Enter your name" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
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
                                >
                                    Register
                                </Button>
                            </div>
                            <div style={{ marginTop: "20px", display: "flex" }}>
                                <p
                                    style={{
                                        marginLeft: "200px",
                                        color: "red",
                                    }}
                                >
                                    Have Account?
                                </p>
                                <Button
                                    type="link"
                                    htmlType="submit"
                                    onClick={handleLoginSubmit}
                                    style={{ marginLeft: "auto" }}
                                >
                                    Login
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </>
    );
};

export default Register;
