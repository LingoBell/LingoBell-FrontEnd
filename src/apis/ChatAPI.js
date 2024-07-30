import axios from "axios";

export const CreateChat = async (chat_room) => {
    const url= `http://localhost:8000/chats/liveChat`;
    
    try {
        const response = await axios.post(url, chat_room);
        console.log('create chat success', response.data);
        return response.data.chatRoomId;

    } catch (error) {
        console.error('채팅방 생성 실패', error);
        throw error;
    }
}