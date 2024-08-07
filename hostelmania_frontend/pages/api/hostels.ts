import axios from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API; // Replace with your backend URL


// Delete a hostel by ID
export const deleteHostel = async (id:any, token:string) => {
  try {
    console.log("delete url",`${API_URL}/hostels/${id}`)
    const response = await axios.delete(`${API_URL}/hostels/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error("There was an error deleting the hostel!", error);
    throw error;
  }
};

// Create a new hostel
export const createHostel = async (hostelData:any, token:string) => {
  try {
    const response = await axios.post(`${API_URL}/hostels`, hostelData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error("There was an error creating the hostel!", error);
    throw error;
  }
};

// Fetch all hostels with optional query parameters
export const fetchHostels = async (token:string, params = {}) => {
  try {
    console.log(token)
    const response = await axios.get(`${API_URL}/hostels`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: params
    });
    return response;
  } catch (error) {
    console.error("There was an error fetching the hostels!", error);
    throw error;
  }
};

// Fetch a single hostel by ID
export const fetchHostelById = async (id:any, token:string) => {
  try {
    const response = await axios.get(`${API_URL}/hostels/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error("There was an error fetching the hostel!", error);
    throw error;
  }
};
