import { mdiVideo, mdiVideoOff } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "antd";

const VideoControl = (props) => {
    return (
        <Button
            type="primary"
            shape="circle"
            size={props.small ? "default" : "large"}
            onClick={props.handleVideoControlClick}
            disabled={props.small}
            icon={
                <Icon
                    path={props.videoFlag ? mdiVideo : mdiVideoOff}
                    title={props.videoFlag ? "Turn video off" : "Turn video on"}
                    size={props.small ? 1 : 1.4}
                    className="control-icons"
                />
            }
        />
    );
};

export default VideoControl;
