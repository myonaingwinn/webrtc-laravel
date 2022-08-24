import { Button, Col, Form, Input, notification, Row, Space } from "antd";
import { useEffect, useState } from "react";
import { Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../helpers/Utilities";
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

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [form] = Form.useForm();
    const navigator = useNavigate();

    useEffect(() => {
        document.title = "Register";
    });

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
                            type: "success",
                            message: "Register Success!",
                        });
                        return navigator("/login");
                    } else {
                        notification.open({
                            type: "error",
                            message: "Register Fail!",
                        });
                        return navigator("/register");
                    }
                })
                .catch((err) => {
                    notification.open({
                        type: "error",
                        message: "Register Fail!",
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

    return (
        <Row className="register" align="center">
            <Col>
                <Card title="Register" className="card">
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="register"
                        colon={false}
                        requiredMark={false}
                        className="form"
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
                                    message: "Please enter your name!",
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
                                    type: "string",
                                    min: 8,
                                    message:
                                        "Password must have at least 8 characters!",
                                },
                                {
                                    required: true,
                                    message: "Please enter your password!",
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder="Enter your password" />
                        </Form.Item>

                        <Form.Item {...tailFormItemLayout}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="btn-register"
                                onClick={handleSubmit}
                            >
                                Register
                            </Button>
                        </Form.Item>
                        <div className="link-login">
                            <Space>
                                Already have an account?
                                <Link to="/login">Login</Link>
                            </Space>
                        </div>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default Register;
