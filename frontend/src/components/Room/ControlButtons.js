import { Button, Space } from "antd";
import Icon from "@mdi/react";
import { mdiPhoneHangup } from "@mdi/js";
import { useState } from "react";
import VideoControl from "./components/VideoControl";
import AudioControl from "./components/AudioControl";

const ControlButtons = (props) => {
    const [videoFlag, setVideoFlag] = useState(true);
    const [audioFlag, setAudioFlag] = useState(true);

    const handleVideoControlClick = () => {
        setVideoFlag(!videoFlag);
        props.handleVideoControlClick();
    };
    const handleAudioControlClick = () => {
        setAudioFlag(!audioFlag);
        props.handleAudioControlClick();
    };
    const handleEndCallClick = () => {
        props.leaveCall();
    };

    return (
        <div className="control-buttons">
            <Space size="middle">
                <VideoControl
                    handleVideoControlClick={handleVideoControlClick}
                    videoFlag={videoFlag}
                />
                <AudioControl
                    handleAudioControlClick={handleAudioControlClick}
                    audioFlag={audioFlag}
                />
                <Button
                    type="danger"
                    shape="circle"
                    size="large"
                    onClick={handleEndCallClick}
                    icon={
                        <Icon
                            path={mdiPhoneHangup}
                            title="Leave call"
                            size={1.4}
                            className="control-icons"
                        />
                    }
                />
            </Space>
        </div>
    );
};

export default ControlButtons;
