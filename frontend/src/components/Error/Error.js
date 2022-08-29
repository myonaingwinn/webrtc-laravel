import { Button, Col, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const Error = () => {
    const { Title } = Typography;
    const navigator = useNavigate();

    const gotoHome = () => {
        navigator("/");
    };

    return (
        <Row className="error" justify="center">
            <Col>
                <Title>404 Error</Title>
                <Typography className="text">
                    Your requested page was not found.
                </Typography>
                <Button type="primary" onClick={gotoHome}>
                    Goto Home
                </Button>
            </Col>
        </Row>
    );
};

export default Error;
