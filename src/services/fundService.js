import axios from "axios";

const MFAPI_URL = "https://api.mfapi.in/mf";



export const fetchAllFunds =  async () => {
    try {
      const response = await axios.get(MFAPI_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching funds from API:", error);
      throw new Error("Failed to fetch funds from MFAPI");
    }
  }
  export const fetchHistoryNav =  async (schemeCode) => {
    try {
      const response = await axios.get(`${MFAPI_URL}/${schemeCode}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching funds from API:", error);
      throw new Error("Failed to fetch funds from MFAPI");
    }
  }


 export const fetchCurrentNav = async (schemeCode) => {
  try {
    const response = await axios.get(`${MFAPI_URL}/${schemeCode}/latest`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching current NAV:", error.message);
    throw new Error("Failed to fetch current NAV");
  }
};

  

  
  

