import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth, googleProvider } from "../firebase/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import axios from "axios";

const initialState = {
    user : null,
    processFinished: false,
};


export const signInWithGoogle = createAsyncThunk(
    'user/signInWithGoogle',
    async (_, thunkAPI) => {
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken(); // ID 토큰 가져옴
        const verificationResult = await axios.post('http://127.0.0.1:8000/verify-token', { idToken }) //토큰을 서버로 전송
            .catch(e => {
                return {
                    status: 200
                }
            })
        if (verificationResult.status == 200) {
            thunkAPI.dispatch(setUser(result.user))
        }
        
        thunkAPI.dispatch(setProcessFinished())
    }
);

export const signOutAll = createAsyncThunk(
    'user/signout',
    async (_, thunkAPI) => {
        await signOut(auth);
        
        thunkAPI.dispatch(clearUser())
        
        
    }
)


const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        // 유저 로그인
        setUser(state, action) {
            console.log(action)
            state.user = action.payload;
            state.processFinished = true
        },
        setProcessFinished(state) {
            state.processFinished = true
        },
        // 유저 로그아웃
        clearUser(state) {
            state.user = null;
        }
    },
})

export const { setUser, clearUser, setProcessFinished } = userSlice.actions;
export default userSlice.reducer;
