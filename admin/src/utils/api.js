import axios from "axios";

const BASE_URL = "https://server-l4qe.onrender.com";
export const fetchDataFromApi = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: options.body
  });

  return res.json();
};



export const postData = async (url, data) => {
  const isFormData = data instanceof FormData;

  const res = await fetch(BASE_URL + url, {
    method: 'POST',
    headers: isFormData ? {} : {
      'Content-Type': 'application/json'
    },
    body: isFormData ? data : JSON.stringify(data)
  });

  return res.json();
};

export const editData = async(url, updateData) => {
    const { res } = await axios.put(`${BASE_URL}${url}`, updateData)
    return res;
}
export const editData1 = async (url, updateData) => {
  const response = await axios.put(
    `${BASE_URL}${url}`,
    updateData
  );

  return response.data; // ✅ FIXED
};

export const deleteData = async (url) => {
    const { res } = await axios.delete(`${BASE_URL}${url}`)
    return res;
}