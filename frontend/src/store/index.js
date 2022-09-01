import { createSlice, configureStore } from "@reduxjs/toolkit";

const onlineUserList = createSlice({
    name: "onlineUserList",
    initialState: {
        onlineUserList: {},
    },
    reducers: {
        setOnlineUserList: (state, action) => {
            state.value = action.payload;
        },
    },
});

const rooms = createSlice({
    name: "room",
    initialState: {
        roomList: {},
    },
    reducers: {
        setRoomList: (state, action) => {
            state.roomList = action.payload;
        },
    },
});

export const { setOnlineUserList } = onlineUserList.actions;
export const { setRoomList } = rooms.actions;

export default configureStore({
    reducer: {
        onlineUserList: onlineUserList.reducer,
        rooms: rooms.reducer,
    },
});
