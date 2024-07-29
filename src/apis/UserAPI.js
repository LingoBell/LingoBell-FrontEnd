import axios from "axios";

export const GetUserList = async () => {
    const url = `http://localhost:8080/partners`;

    try {
        const response = await axios.get(url);
        console.log('get user list', response.data);
        return response.data;
    } catch (error) {
        console.log('유저 리스트 불러오기 실패', error);
        throw error;
    }
}