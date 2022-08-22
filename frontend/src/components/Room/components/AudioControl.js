import { mdiMicrophone, mdiMicrophoneOff } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "antd";

const AudioControl = (props) => {
    return (
        <Button
            type="primary"
            shape="circle"
            size={props.small ? "default" : "large"}
            onClick={props.handleAudioControlClick}
            disabled={props.small}
            icon={
                <Icon
                    path={props.audioFlag ? mdiMicrophone : mdiMicrophoneOff}
                    title={props.audioFlag ? "Turn audio off" : "Turn audio on"}
                    size={props.small ? 1 : 1.4}
                    className="control-icons"
                />
            }
        />
    );
};

export default AudioControl;
