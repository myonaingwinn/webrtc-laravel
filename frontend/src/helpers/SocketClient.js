import { io } from "socket.io-client";
import { localStorageGet, signalServerUrl } from "./Utilities";
import { setOnlineUserList, setRoomList } from "../store";
import store from "../store";

const { uuid, name } = localStorageGet("user") || {};

export const socket = io(signalServerUrl);

export const connectWithServer = () => {
    // socket = io(signalServerUrl);

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

export const getRoomList = () => {
    socket.emit("get all rooms");

    socket.on("rooms", (rooms) => {
        store.dispatch(setRoomList(rooms));
    });
};

export const createNewRoom = (room) => socket.emit("create_room", room);

export const deleteARoom = (roomId) => socket.emit("delete_room", roomId);

export const joinRoom = (roomId) => socket.emit("join room", roomId);
