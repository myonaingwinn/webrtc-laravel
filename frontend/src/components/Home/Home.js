import { Layout, Typography } from "antd";

import WebRTC from "./webrtc.svg";

const Home = () => {
    const { Title } = Typography;

    return (
        <Layout className="home common">
            <Title className="title">Real-time communication for the web </Title>
            <tr>
                <br />
                <td className="text">
                 WebRTC, you can add real-time communication <br/>
                 capabilities to your application that works on top of<br/>
                 an open standard. It supports video, voice, and generic <br/>
                 data to be sent between peers, allowing developers to build <br/>
                 powerful voice- and video-communication solutions.<br/>
                

                    <br />
                    <br />
                    <p className="devtext">What can WebRTC do? <br/>
                    There are many different use-cases for WebRTC, from basic<br/>
                 web apps that uses the camera or microphone, to more advanced<br/>
                 video-calling applications and screen sharing. We have gathered<br/>
                   number of code samples to better illustrate how the technology<br/>
                    works and what you can use it for. 
                    </p>
                </td>

                <td className="img">
                    {" "}
                    <img
                        src={WebRTC}
                        alt="React Logo"
                        width="500px"
                        height="500px"
                    />{" "}
                </td>
            </tr>
        </Layout>
    );
};

export default Home;
