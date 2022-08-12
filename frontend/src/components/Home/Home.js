import { Button, Col, Row } from "antd";
import { localStorageRemove } from "../../helpers/Utilities";
import { useNavigate } from "react-router-dom";
import UserList from "../User/UserList";

const Home = () => {
    const navigator = useNavigate();

    const handleLogout = async () => {
        localStorageRemove("user");
        navigator("login");
    };

    return (
        <>
            <Row>
                <Col
                    span={5}
                    style={{ background: "#95de64", height: "100vh" }}
                >
                    <h1>Online Users</h1>
                    <UserList />
                </Col>
                <Col
                    span={14}
                    style={{ background: "#69c0ff", height: "100vh" }}
                >
                    <h1>Message Body</h1>
                </Col>
                <Col
                    span={5}
                    style={{ background: "#fff1b8", height: "100vh" }}
                >
                    <h1>Room List</h1>
                    <Button
                        variant="white"
                        className="btn btn-outline-danger"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default Home;
