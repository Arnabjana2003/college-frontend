import axios from 'axios';
export const backendUrl = "https://college-backend-delta.vercel.app/api"

export const login = async (validationData) => {
    const response = await axios.post(`${backendUrl}/login`, validationData);
    return response.data;
  };
  


export const signup = async (formData) => {
  console.log(formData)
    const response = await axios.post(`${backendUrl}/signup`, formData);
    console.log(response)
    return response.data;
  };
  

  export const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${backendUrl}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.user;
  };

  export const fetchRegistrations = async () => {
    const response = await axios.get(`${backendUrl}/`);
    console.log(response.data)
    return response.data;
  };