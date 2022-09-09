import { Col, Layout, Row } from "antd";

import WebRTC from "../../assets/images/Home/video-chat-cam.svg";
import Video from "../../assets/images/Home/video-call-svgrepo-com.svg";
import Logo from "../../assets/images/Home/webrtc.svg";
import Chat from "../../assets/images/Home/chat-svgrepo.svg";
import VC from "../../assets/images/Home/R.svg";
import Robot from "../../assets/images/Home/robot.svg";
import { useEffect } from "react";
import { connectWithServer } from "../../helpers/SocketClient";

const Home = () => {
    useEffect(() => {
        document.title = "Home";
        connectWithServer();
    }, []);

    return (
        <Layout className="home common">
            <div className="title">
                <img src={Logo} width="130px" height="130px" alt="Logo" />
                <span className="title">
                    WebRTC Video Call And Message Chat
                </span>
            </div>
            <Row className="first-row">
                <Col xs={16} sm={16} md={16} lg={16} xl={16} className="text">
                    WebRTC, you can add real-time communication capabilities to
                    your application that works on top of an open standard. It
                    supports video, voice, and generic data to be sent between
                    peers, allowing developers to build powerful voice and
                    video-communication solutions.
                </Col>
                <Col xs={8} sm={8} md={8} lg={8} xl={8} className="img1">
                    <img
                        src={Video}
                        alt="React Logo"
                        width="300px"
                        height="300px"
                    />
                </Col>
            </Row>
            <Row className="middle-row">
                <Col className="column" xs={8} sm={8} md={8} lg={8} xl={8}>
                    <img src={Chat} width="400px" height="400px" alt="chat" />
                </Col>
                <Col className="column" xs={8} sm={8} md={8} lg={8} xl={8}>
                    <img src={VC} width="400px" height="400px" alt="video" />
                </Col>
                <Col className="column" xs={8} sm={8} md={8} lg={8} xl={8}>
                    <img src={Robot} width="400px" height="400px" alt="robot" />
                </Col>
            </Row>
            <div className="last-row">
                <img
                    src={WebRTC}
                    alt="React Logo"
                    width="350px"
                    height="350px"
                    className="img"
                />
                <p className="devtext">
                    <b>What can WebRTC do?</b>
                    <br />
                    There are many different use-cases for WebRTC, from basic
                    web apps that uses the camera or microphone, to more
                    advanced video-calling applications and screen sharing. We
                    have gathered number of code samples to better illustrate
                    how the technology works and what you can use it for.
                </p>
            </div>
        </Layout>
    );
};

export default Home;
