const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const {testblogs, initblogs, initusers, getfirsttoken} = require("../utils/test_helper");



beforeEach(async () => {
  await initusers();
  await initblogs();
});

afterAll(async () => {
  mongoose.connection.close();
});


describe("/api/blogs GET", () => {
  test("/api/blogs GET", async () => {
    const blogs = await api.get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(blogs.body).toHaveLength(testblogs.length);
    expect(blogs.body[0].id).toBeDefined();
  });
});

describe("/api/blogs POST", () => {
  test("new blog", async () => {
    const token = await getfirsttoken();
    const newblog = {title:"test", author:"joku", url: "example.com", likes:1};
    const presp = await api.post("/api/blogs").auth(token, {type:"bearer"}).send(newblog).expect(201).expect("Content-Type", /application\/json/);
    const blog = presp.body;
    expect(blog.author).toBe(newblog.author);
    expect(blog.title).toBe(newblog.title);
    expect(blog.url).toBe(newblog.url);
    expect(blog.likes).toBe(newblog.likes);
    const resp = await api.get("/api/blogs");
    expect(resp.body).toHaveLength(testblogs.length + 1);
    expect(resp.body.map(b => {return {title:b.title, author:b.author, url:b.url, likes:b.likes};})).toContainEqual(newblog);
  });
  test("no likes", async () => {
    const token = await getfirsttoken();
    const newblog = {title:"test", author:"joku", url: "example.com"};
    const presp = await api.post("/api/blogs").auth(token, {type:"bearer"}).send(newblog).expect(201).expect("Content-Type", /application\/json/);
    expect(presp.body.likes).toBe(0);
  });
  test("no title", async () => {
    const token = await getfirsttoken();
    const newblog = {author:"joku2", url: "example.com", likes:0};
    await api.post("/api/blogs").auth(token, {type:"bearer"}).send(newblog).expect(400);
  });
  test("no url", async () => {
    const token = await getfirsttoken();
    const newblog = {title:"test", author:"joku", likes:1};
    await api.post("/api/blogs").auth(token, {type:"bearer"}).send(newblog).expect(400);
  });
  test("no token", async() => {
    const newblog = {title:"test", author:"joku", url: "example.com", likes:1};
    const presp = await api.post("/api/blogs").send(newblog).expect(401).expect("Content-Type", /application\/json/);
    expect(presp.body.error).toBeDefined();
  });
});

describe("/api/blogs/[id] DELETE", () => {
  test("delete first", async ()=> {
    const token = await getfirsttoken();
    const blogs = await api.get("/api/blogs");
    await api.delete("/api/blogs/" + blogs.body[0].id).auth(token, {type:"bearer"}).expect(204);
    const blogsafter = await api.get("/api/blogs");
    expect(blogsafter.body.length).toBe(blogs.body.length - 1);
    expect(blogsafter.body).not.toContainEqual(blogs.body[0]);
  });
});

describe("/api/blogs/[id] PUT", () => {
  test("update first", async ()=> {
    const token = await getfirsttoken();
    const blogs = await api.get("/api/blogs");
    let edited = {author: "edited"};
    await api.put("/api/blogs/" + blogs.body[0].id).auth(token, {type:"bearer"}).send(edited).expect(200);
    const blogsafter = await api.get("/api/blogs");
    expect(blogsafter.body.length).toBe(blogs.body.length);
    expect(blogsafter.body).not.toContainEqual(blogs.body[0]);
    edited = {...blogs.body[0]};
    edited.author = "edited";
    expect(blogsafter.body).toContainEqual(edited);
  });
});

