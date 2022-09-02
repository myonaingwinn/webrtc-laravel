import { Button, Col, Card, Row, notification, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { deleteARoom } from "../../helpers/SocketClient";

const { Paragraph } = Typography;

const RoomComponent = ({ roomList, uuid }) => {
    const navigator = useNavigate();

    const handleJoinRoom = (roomId) => {
        navigator(`/rooms/${roomId}`);
    };

    const deleteRoom = (roomId) => {
        if (roomList[roomId].usersInRoom.length > 0) {
            notification.open({
                type: "error",
                message: "You can delete this room after all users left!",
            });
        } else {
            deleteARoom(roomId);
            notification.open({
                type: "success",
                message: "Room Delete Success!",
            });
        }
        navigator("/rooms");
    };

    return (
        <Row gutter={16} className="room-component">
            {Object.entries(roomList).length > 0 &&
                Object.keys(roomList).map((key) => {
                    return (
                        <Col className="gutter-row" span={5.5} key={key}>
                            <Card title={roomList[key].name} className="card"
                                extra={
                                    <div className="user-count">
                                        <UserOutlined />{" "}
                                        {Object.entries(roomList).length !== 0
                                            ? roomList[key].usersInRoom.length
                                            : 0}
                                    </div>
                                }
                            >
                                <Space>
                                    {roomList[key].description ? <Paragraph className="paragraph">
                                        {roomList[key].description}
                                    </Paragraph> : <Paragraph className="paragraph">No description...</Paragraph>}
                                </Space>
                                <Space>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        onClick={() => handleJoinRoom(key)}
                                        className="btn btn-sm"
                                        disabled={roomList[key].roomFull}
                                        className="btn btn-sm join-btn"
                                    >
                                        Join Room
                                    </Button>
                                    {uuid === roomList[key].createdBy && (
                                        <Button
                                            type="danger"
                                            htmlType="submit"
                                            onClick={() => deleteRoom(key)}
                                            className="btn btn-sm delete-btn"
                                        >
                                            Delete Room
                                        </Button>
                                    )}
                                </Space>
                            </Card>
                        </Col>
                    );
                })}
        </Row>
    );
};
export default RoomComponent;
