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

export const { setOnlineUserList } = onlineUserList.actions;

export default configureStore({
    reducer: { onlineUserList: onlineUserList.reducer },
});
