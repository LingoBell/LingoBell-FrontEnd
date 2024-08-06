import axios from "axios";

export const GetPartnerList = async () => {
    const url = `/partners`;
    try {
        const response = await axios.get(url);
        console.log('get user list', response.data);
        return response.data;
    } catch (error) {
        console.log('유저 리스트 불러오기 실패', error);
        throw error;
    }
};

export const GetRequestPartnerList = async (userCode) => {
    const url = `/partners/requests`;

    try {
        const response = await axios.get(url);
        console.log('get request user list', response.data);
        return response.data;
    } catch (error) {
        console.log('요청 유저 리스트 불러오기 실패', error);
        throw error;
    }
};
