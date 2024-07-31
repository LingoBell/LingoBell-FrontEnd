import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth, googleProvider } from "../firebase/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import axios from "axios";

const initialState = {
    user : null,
    processFinished: false,
    isFirstLogin: 1 // 1 : pending, 2: 기존 유저, 3: 신규 유저
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

export const checkFirstLogin = createAsyncThunk(
    'user/checkFirstLogin',
    async (_, thunkAPI) => {
        // 로그인 요청


        const result = await axios.get('http://localhost:8000/api/auth/check-first-user')
        
        thunkAPI.dispatch(setFirstLogin({ result }))
    }
)

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
            state.user = action.payload;
            state.processFinished = true
        },
        setProcessFinished(state) {
            state.processFinished = true
        },
        setFirstLogin(state, action) {
            console.log(action)
            const firstLoginResult = action.payload.result
            console.log(firstLoginResult)
            state.isFirstLogin = 3//firstLoginResult ? 3 : 2
        },
        // 유저 로그아웃
        clearUser(state) {
            state.user = null;
        }
    },
})

export const { setUser, clearUser, setProcessFinished, setFirstLogin } = userSlice.actions;

export default userSlice.reducer;
