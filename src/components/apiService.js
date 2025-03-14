import axios from "axios";


const apiClient = axios.create({
  baseURL: "http://localhost:8090/api/employee", 
});

export const fetchAmenities = async () => {
  try {
    const response = await apiClient.get("/amenities");
    return response.data; 
  } catch (error) {
    console.error("Error fetching amenities:", error);
    throw error; 
  }
};

export default apiClient;
