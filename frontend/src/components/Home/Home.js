import { Layout } from "antd";

import WebRTC from "./video-chat-cam.svg";
import Video from "./video-call-svgrepo-com.svg";
import Logo from "./webrtc.svg";
import Chat from "./chat-svgrepo.svg";
import VC from "./R.svg";
import Robot from "./robot.svg";

const Home = () => {
    return (
        <Layout className="home common">
            <div className="title">
                <img src={Logo} width="130px" height="130px" alt="Logo" />
                <span className="title" text-anchor="middle">
                    WebRTC Video Call And Message Chat{" "}
                </span>
            </div>
            <br />
            <tr>
                <br />
                <br />
                <td className="text">
                    WebRTC, you can add real-time communication <br />
                    capabilities to your application that works on top of
                    <br />
                    an open standard. It supports video, voice, and generic{" "}
                    <br />
                    data to be sent between peers, allowing developers to build{" "}
                    powerful voice- and video-communication solutions.
                    <br />
                    <br />
                    <br />
                </td>
                <td className="img1">
                    {" "}
                    <img
                        src={Video}
                        alt="React Logo"
                        width="300px"
                        height="300px"
                    />{" "}
                </td>
            </tr>
            <tr className="middle-row">
                <td class="column">
                    <img src={Chat} width="300px" height="300px" alt="chat" />
                </td>
                <td class="column">
                    <img src={VC} width="400px" height="400px" alt="video" />
                </td>
                <td class="column">
                    <img src={Robot} width="400px" height="400px" alt="robot" />
                </td>
            </tr>
            <div className="last-row">
                <img
                    src={WebRTC}
                    alt="React Logo"
                    width="300px"
                    height="300px"
                    className="img"
                />
                <p className="devtext">
                    What can WebRTC do? <br />
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
