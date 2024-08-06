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
        const response = await axios.get(`/users/${uid}`)
        console.log("Successfully get user profile", response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching GetUserProfile: ${error}`);
    }
}

export const UpdateUserProfile = async (uid, formData) => {
    try {
        const response = await axios.put(`/users/${uid}`, formData, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error:', error)
    }
}

