import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth, googleProvider } from "../firebase/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import axios from "axios";

const initialState = {
    user: null,
    processFinished: false,
    isFirstLogin: 1, // 1 : pending, 2: 기존 유저, 3: 신규 유저
    nativeLanguage: '', // 이진우 추가.
    learningLanguages: [], // 이진우 추가.
};


export const signInWithGoogle = createAsyncThunk(
    'user/signInWithGoogle',
    async (_, thunkAPI) => {
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken(); // ID 토큰 가져옴
        const verificationResult = await axios.post('/verify-token', { idToken }) //토큰을 서버로 전송
            .catch(e => {
                return {
                    status: 200
                }
            })
        if (verificationResult.status == 200) {
            console.log('hihi', verificationResult.data)
            // thunkAPI.dispatch(setUser(result.user))
            const user = {
                uid: result.user.uid,
                accessToken: result.user.accessToken
            };
            thunkAPI.dispatch(setUser(user));

        }

        thunkAPI.dispatch(setProcessFinished())
    }
);

export const checkFirstLogin = createAsyncThunk(
    'user/checkFirstLogin',
    async (_, thunkAPI) => {
        const response = await axios.get('/users/check')
        const result = response.data
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
    name: 'user',
    initialState,
    reducers: {
        // 유저 로그인
        setUser(state, action) {
            const { nativeLanguage = '', learningLanguages = [] } = action.payload;
            state.user = action.payload;
            state.processFinished = true
            state.nativeLanguage = nativeLanguage;
            state.learningLanguages = learningLanguages;
        },
        updateLearningLanguages(state, action) {
            state.learningLanguages = action.payload;
        },
        setProcessFinished(state) {
            state.processFinished = true
        },
        setFirstLogin(state, action) {
            console.log(action)
            const firstLoginResult = action.payload.result
            console.log('fisrstLoginResult : ', firstLoginResult)
            console.log('유저슬라이스값 : ', firstLoginResult)
            state.isFirstLogin = firstLoginResult.result
        },
        // 유저 로그아웃
        clearUser(state) {
            state.user = null;
        }
    },
})

export const { setUser, clearUser, setProcessFinished, setFirstLogin, updateLearningLanguages } = userSlice.actions; // updateLearningLanguages 이거 추가함. 이진우.

export default userSlice.reducer;
