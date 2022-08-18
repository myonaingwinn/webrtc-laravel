import { Button, Col, Layout, Space, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { signalServerUrl } from "../../helpers/Utilities";

const Home = () => {
    const { Title } = Typography;

    const socketRef = useRef();
    const [roomList, setRoomList] = useState({});
    const navigator = useNavigate();

    useEffect(() => {
        socketRef.current = io(signalServerUrl);
        socketRef.current.on("rooms", (rooms) => {
            setRoomList(rooms);
            console.log("🚀 ~ file: Home.js ~ rooms", rooms);
            console.log("🚀 ~ file: Home.js ~ roomList", roomList);
        });
    }, [roomList]);

    const handleJoinRoom = (id) => {
        navigator(`/rooms/${id}`);
    };

    return (
        <Layout className="home common">
            <Title className="title">Home Component</Title>
            <Space direction="vertical">
                <Link to="/create_room">
                    <Button type="primary">Goto Create Room</Button>
                </Link>
                <Col>
                    <Space>
                        {roomList &&
                            Object.keys(roomList).map((key) => {
                                return (
                                    <Button
                                        key={key}
                                        onClick={() => handleJoinRoom(key)}
                                    >
                                        {key}
                                    </Button>
                                );
                            })}
                    </Space>
                </Col>
            </Space>
        </Layout>
    );
};

export default Home;
