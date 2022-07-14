import {
    Button,
    Form,
    Input,
} from 'antd';
import React, { useState } from 'react';
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
        if (name === '' || email === '' || password === '') {
            alert('field cannot be blank!');
        } else {
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
                    window.location.href= '/';
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
        <Form
            {...formItemLayout}
            form={form}
            name="register"
            style=
            {{
                maxWidth: '700px',
                margin: '0 auto',
            }}
        >
            <Form.Item
                name="name"
                label="Name"
                id="name"
                value={name}
                onChange={handleNameChange}
                style={{ paddingTop: '150px' }}
                rules={[
                    {
                        required: true,
                        message: 'Please input your Name!',
                    },
                ]}
            >
                <Input />
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
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                value={password}
                onChange={handlePasswordChange}
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                {...tailFormItemLayout}
            >
                <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                    Register
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Register;