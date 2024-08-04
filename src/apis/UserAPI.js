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
        window.location.reload();
    } catch (error) {
        console.log('Error:', error)
    }
}

