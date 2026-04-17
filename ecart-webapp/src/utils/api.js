import axios from "axios";

const BASE_URL = "https://server-l4qe.onrender.com";
export const fetchDataFromApi = async (url, options = {}) => {
    try {
        const { data } = await axios.get(
            `${BASE_URL}${url}`,
            {
                headers: {
                    ...(options.headers || {})
                }
            }
        );
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};
export const fetchDataFromApi1 = async (url, data = null) => {
  try {
    const res = await axios({
      url,
 
      data
    });

    return res.data;
  } catch (error) {
    console.log("API ERROR:", error.response?.data || error.message);
    return { success: false, error: error.response?.data };
  }
};



export const postData = async (url, data) => {
  try {
    const res = await fetch(BASE_URL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const text = await res.text(); // 👈 get raw response

    try {
      return JSON.parse(text); // 👈 safely parse
    } catch (err) {
      console.error("Invalid JSON:", text);
      return { error: true, msg: "Invalid server response" };
    }

  } catch (error) {
    console.error("Fetch error:", error);
    return { error: true, msg: "Network error" };
  }
};



export const editData = async (url, data, isFormData = false) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `${BASE_URL}${url}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData && { "Content-Type": "multipart/form-data" })
        }
      }
    );

    return res.data;
  } catch (error) {
    console.log(error);
    return { error: true };
  }
};

export const deleteData = async (url, bodyData) => {
  try {
    const res = await axios.delete(`${BASE_URL}${url}`, {
      data: bodyData   // ✅ IMPORTANT
    });
    return res.data;
  } catch (error) {
    console.log("DELETE ERROR:", error.response?.data || error.message);
    return { error: true };
  }
};

export const postFormData = async (url, formData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}${url}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.log("POST ERROR:", error.response?.data || error.message);
    return { error: true };
  }
};
export const putFormData = async (url, formData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}${url}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.log("PUT ERROR:", error.response?.data || error.message);
    return { error: true };
  }
};