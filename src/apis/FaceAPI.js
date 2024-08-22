import axios from "axios"

export const createFaceLandmark = async (faceData) => {
    console.log('face 데이터 : ', faceData)
    try {
        const url = `/faces`;
        const response = await axios.post(url, {faceData});
        console.log('api 결과 : ', response)
        return response.data;
        
    } catch (error) {
        console.log('fail to send face landmark', error);
        throw error;
    }
};