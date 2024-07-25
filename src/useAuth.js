import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "./redux/userSlice";
import { auth } from "./firebase/firebase";

const useAuth = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("useAuth hook initialized");

        // Firebase 인증 상태 변화 감지
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const idToken = await user.getIdToken();
                console.log("User is signed in: ", user);
                dispatch(setUser({
                    ...user,
                    idToken,
                }));
            } else {
                console.log("No user is signed in");
                dispatch(clearUser());
            }
        });

        // 주기적으로 토큰 갱신
        const intervalId = setInterval(async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {s
                console.log("Refreshing token");
                const idToken = await currentUser.getIdToken(true); // 강제로 토큰 갱신
                dispatch(setUser({
                    ...currentUser,
                    idToken,
                }));
            }
        }, 55 * 60 * 1000); // 55분마다 체크하여 토큰 갱신

        return () => {
            console.log("useAuth hook cleanup");
            unsubscribe(); // Firebase 인증 상태 변화 감지 정리
            clearInterval(intervalId); // 주기적인 체크 정리
        };
    }, [dispatch]); // dispatch를 의존성 배열에 추가하여, dispatch가 변경될 때마다 useEffect 훅이 다시 실행됨

    return null;
};

export default useAuth;
