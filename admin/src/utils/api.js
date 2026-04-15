import axios from "axios";


export const fetchDataFromApi = async (url, options = {}) => {
  const res = await fetch(`http://localhost:4000${url}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: options.body
  });

  return res.json();
};

const BASE_URL = "http://localhost:4000";

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
    const { res } = await axios.put(`http://localhost:4000${url}`, updateData)
    return res;
}
export const editData1 = async (url, updateData) => {
  const response = await axios.put(
    `http://localhost:4000${url}`,
    updateData
  );

  return response.data; // ✅ FIXED
};

export const deleteData = async (url) => {
    const { res } = await axios.delete(`http://localhost:4000${url}`)
    return res;
}