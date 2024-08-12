import axios from 'axios';

export const login = async (validationData) => {
    const response = await axios.post('/api/login', validationData);
    return response.data;
  };
  


export const signup = async (formData) => {
  console.log(formData)
    const response = await axios.post('/api/signup', formData);
    console.log(response)
    return response.data;
  };
  

  export const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.user;
  };

  export const fetchRegistrations = async () => {
    const response = await axios.get('/api/');
    console.log(response.data)
    return response.data;
  };