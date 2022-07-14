import {
    Button,
    Form,
    Input,
} from 'antd';
import React, { useState } from 'react';
import { Card } from 'antd';
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

    const handleSubmit = async () => {
        if (!(name === '' || email === '' || password === '')) {
            await fetch("http://127.0.0.1:8000/api/v1/register", {
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
                    window.location.href = '/';
                })
                .catch((err) => console.log(err));
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

        <>
            <div className="site-card-wrapper">
                <Card title="Register Form" style=
                    {{
                        textAlign: 'center',
                        width: '800px',
                        margin: '0 auto',
                        marginTop: '80px'
                    }}
                >
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="register"
                        style=
                        {{
                            marginTop: '30px',
                            marginRight: '200px'
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
                                    message: 'Please input your Name!',
                                },
                            ]}
                        >
                            <Input placeholder='Enter Your Name' />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="E-mail"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ]}
                        >
                            <Input placeholder='Enter Your E-mail' />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            rules={[
                                {
                                    type: 'string',
                                    min: 8,
                                    message: 'Password must have at least 8 characters!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder='Enter Your Password' />
                        </Form.Item>

                        <Form.Item
                            {...tailFormItemLayout}
                        >
                            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                                Register
                            </Button>
                        </Form.Item>

                    </Form>
                </Card>
            </div>
        </>
    );
};

export default Register;