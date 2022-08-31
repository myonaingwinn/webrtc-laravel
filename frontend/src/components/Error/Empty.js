import { Empty } from "antd";

const EmptyComponent = ({ description }) => {
    return (
        <Empty
            description={description ? <span>{description}</span> : ""}
            className="empty"
        ></Empty>
    );
};

export default EmptyComponent;
