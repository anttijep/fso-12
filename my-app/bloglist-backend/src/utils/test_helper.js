const supertest = require("supertest");

const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");

const testblogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {

    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  }  
];

const testusers = [
  {
    username: "hellas",
    name: "Arto Hellas",
    password: "testpw"
  },
  {
    username: "testaaja",
    name: "Test test",
    password: "testtest"
  }
];

const initusers = async () => {
  await User.deleteMany({});
  const promises = testusers.map(n => api.post("/api/users").send(n));
  await Promise.all(promises);
};

const initblogs = async () => {
  await Blog.deleteMany({});
  const token = await getfirsttoken();
  const promises = testblogs.map(t => api.post("/api/blogs").send(t).auth(token, {type:"bearer"}));
  await Promise.all(promises);
};

const getfirsttoken = async () => {
  const { username, password } = testusers[0];
  const acc = await api.post("/api/login").send({username, password});
  return acc.body.token;
};
const getsecondtoken = async () => {
  const { username, password } = testusers[1];
  const acc = await api.post("/api/login").send({username, password});
  return acc.body.token;
};

module.exports = {initusers, initblogs, testblogs, testusers, getfirsttoken, getsecondtoken};

