import axios from "axios";

export const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export const getPostsPerPage = async (pageNum = 1, options = {}) => {
  const res = await api.get(`/posts?_page=${pageNum}`, options);
  return res.data;
};
