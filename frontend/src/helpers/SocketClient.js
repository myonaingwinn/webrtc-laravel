import { io } from "socket.io-client";
import { localStorageGet, signalServerUrl } from "./Utilities";
import { setOnlineUserList } from "../store";
import store from "../store";

let socket;
const { uuid, name } = localStorageGet("user") || {};

export const connectWithServer = () => {
    socket = io(signalServerUrl);

    console.log("In connectWithServer");

    socket.on("me", () => {
        console.log("succesfully connected with wss server", socket.id, uuid);

        const user = {
            uuid: uuid,
            socketId: socket.id,
            name: name,
        };

        if (user.uuid && user.socketId) socket.emit("set online user", user);
    });
};

export const removeUserFromServer = () => {
    socket.emit("logout", uuid);
};

export const getOnlineUsers = () => {
    socket.emit("get online users");

    socket.on("online users", (userList) => {
        store.dispatch(setOnlineUserList(userList));
    });
};
