import axios from "axios";

export const AddUserProfile = async (formData) => {
    try {
        const response = await axios.post('/users',
            formData, {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        )
        console.log('Success:', response.data)
        // window.location.reload();
    } catch (error) {
        console.log('Error:', error)
    }
}

export const GetUserProfile = async (uid) => {
    try {
        const response = await axios.get(`/users/${uid}}`)
        console.log("Successfully get user profile", response);
        return response.data;
    } catch (error) {
        console.error(`Error fetching GetUserProfile: ${error}`);
    }
}

export const getMyProfile = async () => {
    return axios.get('/users/my-profile')
        .then(res => res.data)
}

export const UpdateUserProfile = async (formData) => {
    try {
        const response = await axios.put(`/users/my-profile`, formData, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error:', error)
    }
}

export const uploadImage = async (formData) => {

    try {
        const response = await axios.post('/users/image-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data

    } catch (error) {
        if (error.response) {
            return { success: false, message: error.response.data.detail || 'Image upload failed!' };
        } else {
            return { success: false, message: error.message };
        }
    }
}

//fcm
export const registerFcm = async (token) => {
    try {
        const response = await axios.post('/users/fcm', {
            token : token
        })
        console.log('user fcm token : ', token)
        return response.data

    } catch(error) {
        console.log("Error :", error)
    }
}


export const send_notification = async (chat_room_id) => {
    try {
        const result = await axios.get(`/chats/${chat_room_id}/info`)
        console.log('ddd', result)
    } catch (error) {
        console.error('Error creating notification', error)
    }
}

