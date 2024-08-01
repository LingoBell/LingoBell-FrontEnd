import axios from "axios";

export const GetUserList = async () => {
    const url = `http://localhost:8000/users/partners`;

    try {
        const response = await axios.get(url);
        console.log('get user list', response.data);
        return response.data;
    } catch (error) {
        console.log('유저 리스트 불러오기 실패', error);
        throw error;
    }
};

export const GetRequestUserList = async () => {
    const url = `http://localhost:8000/users/requestPartners`;

    try {
        const response = await axios.get(url);
        console.log('get request user list', response.data);
        return response.data;
    } catch (error) {
        console.log('요청 유저 리스트 불러오기 실패', error);
        throw error;
    }
};


export const AddUserProfile = async (formData) => {
    try {
        const response = await axios.post('users',
            formData, {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        );
        console.log('Success:', response.data)
    } catch (error) {
        console.log('Error:', error)
    }
}

