import axios from "axios";

export const CreateChat = async (chat_room) => {
    const url= `/chats`;
    
    try {
        const response = await axios.post(url, chat_room);
        console.log('create chat success', response.data);
        return response.data.chatRoomId;

    } catch (error) {
        console.error('채팅방 생성 실패', error);
        throw error;
    }
};

export const UpdateChatRoomStatus = async (chat_room_id) => {
    const url = `/chats/${chat_room_id}/vacancy`;

    try {
        const response = await axios.put(url, chat_room_id);
        console.log('update chat status', response.data);
        return response.data;
    } catch (error) {
        console.error('채팅방 상태 변경 실패', error);
        throw error;
    }
};