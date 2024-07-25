import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user : null,
};

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        // 유저 로그인
        setUser(state, action) {
            state.user = action.payload;
        },
        // 유저 로그아웃
        clearUser(state) {
            state.user = null;
        }
    },
})

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
