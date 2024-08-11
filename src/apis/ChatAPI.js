import axios from "axios";

export const CreateChat = async (chat_room) => {
    const url= `/chats`;
    
    try {
        const response = await axios.post(url, chat_room);
        console.log('create chat success', response.data);
        return response.data.chatRoomId;

    } catch (error) {
        console.error('Create ChatRoom error', error);
        throw error;
    }
};

export const UpdateChatRoomStatus = async (chat_room_id) => {
    const url = `/chats/${chat_room_id}/vacancy`;

    try {
        const response = await axios.put(url, {chat_room_id});
        console.log('update chat status', response.data);
        return response.data;
        
    } catch (error) {
        console.error('Update ChatRoom joinStatus error', error);
        throw error;
    }
};

export const getChatRooms = () => {
    return axios.get('/chats')
        .then(res => res.data)
};

export const getChatRoomsById = async (chat_room_id) => {
        const response = await axios.get(
            `/chats/${chat_room_id}`)
            return response.data
}

export const CreateRecommendations = async (chat_room_id) => {
    try{
        const response = await axios.post(
            `/chats/${chat_room_id}/recommendations`, chat_room_id);
        return response.data
        
    }catch(error) {
        console.error('create recommendation error:', error)
        throw error;
    }
    
}

export const GetRecommendations = async(chat_room_id) => {
    try{
        const response = await axios.get(
            `/chats/${chat_room_id}/recommendations`, chat_room_id);
        return response.data

    } catch(error) {
        console.error('get recommendation error:', error)
        throw error;
    }
}

export const CreateQuizzes = async(chat_room_id) => {
    try{
        const response = await axios.post(
            `/chats/${chat_room_id}/quizzes`, chat_room_id);
        console.log(response.data)
        return response.data
    } catch(error) {
        console.error('create quizzes error', error);
        throw error;
    }
}

export const GetQuizzes = async (chat_room_id) => {
    try{
        const response = await axios.get(
            `/chats/${chat_room_id}/quizzes`, chat_room_id);
        console.log(response.data)
        return response.data
    } catch(error) {
        console.error('get quizzes error', error)
        throw error;
    }
}

// export const getChatRoomStatus = async (chat_room_id) => {
//     try{
//         const response = await axios.get(`/chats/${chat_room_id}/status`)
//         return response.data
//     } catch(error) {

//     }
// }

export const getSttMessages = async (chat_room_id) => {
    const url = `/chats/${chat_room_id}/stt`;

    try {
        const response = await axios.get(url, {chat_room_id});
        // console.log('Successfuly get stt messages', response.data);
        return response.data;
    } catch (error) {
        console.log("Error fetching STT messages", error);
        throw error;
    }
};