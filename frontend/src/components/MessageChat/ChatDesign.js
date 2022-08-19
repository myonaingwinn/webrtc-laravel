import { Layout, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { ImAttachment } from "react-icons/im";
import { Input } from "antd";

const ChatDesign = () => {
    const { Title } = Typography;

    return (
        <Layout className="user-list common">
            <Title className="title">Chat Design</Title>
            <div className="chatdesign ">
                <div className="chat-container">
                    <div className="msgarea"></div>
                    <div className="typing-area">
                        <Input
                            type="text"
                            className="typing-input"
                            name="message"
                            placeholder="Type your message here......"
                            // value={msg}
                            // onChange={inputHandler}
                            // onKeyDown={forentersent}
                            autoComplete="off"
                        />
                        <Button
                            icon={<SendOutlined />}
                            className="send-button"
                        ></Button>
                        <input
                            type="file"
                            id="files"
                            hidden
                            // onChange={uploadFile}
                        />
                        <label htmlFor="files" className="attachment-btn">
                            <ImAttachment />
                        </label>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ChatDesign;
