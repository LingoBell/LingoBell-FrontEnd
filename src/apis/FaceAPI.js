import axios from "axios"

export const createFaceLandmark = async (faceData) => {
    try {
        const url = `/faces`;
        const response = await axios.post(url, faceData);
        return response.data;
        
    } catch (error) {
        console.log('fail to send face landmark', error);
        throw error;
    }
};