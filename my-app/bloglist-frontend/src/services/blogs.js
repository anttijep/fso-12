import axios from "axios";
const baseUrl = "/api/blogs";

let usertoken = null;

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const setToken = (token) => {
  usertoken = token;
};

const create = async data => {
  const config = { headers: { Authorization: "bearer " + usertoken } };
  const resp = await axios.post(baseUrl, data, config);
  return resp.data;
};

const update = async blog => {
  const resp = await axios.put(baseUrl + "/" + blog.id, { ...blog, user:blog.user.id });
  return resp.data;
};

const deleteblog = async blog => {
  const config = { headers: { Authorization: "bearer " + usertoken } };
  await axios.delete(baseUrl + "/" + blog.id, config);
};

const blogs = { getAll, setToken, create, update, deleteblog };

export default blogs;
