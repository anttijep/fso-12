const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const api = supertest(app);

const {testusers, initusers, initblogs} = require("../utils/test_helper");


beforeEach(async () => {
  await initusers();
});

afterAll(async () => {
  mongoose.connection.close()
});

describe("create user test", () => {
  test("Validate initial db", async() => {
    const dbbegin = await api.get("/api/users").expect(200);
    const tu = testusers.map(t => {
      delete t.password;
      t.id = expect.any(String);
      t.blogs = expect.any(Array);
      return t;
    });
    expect(dbbegin.body).toEqual(expect.arrayContaining(tu));
  });
  test("Creating valid user", async () => {
    const dbbegin = await api.get("/api/users").expect(200);
    const user = {username:"testi", name:"joku", password:"ihansama"};
    const resp = await api.post("/api/users").send(user).expect(201);
    const retuser = resp.body;
    delete user.password;
    user.id = expect.any(String);
    user.blogs = expect.any(Array);
    expect(retuser).toEqual({...user});

    const dbend = await api.get("/api/users").expect(200);
    expect(dbend.body).toHaveLength(dbbegin.body.length + 1);
    expect(dbend.body).toContainEqual({...user});
  });
  test("Creating user with no pw", async () => {
    const dbbegin = await api.get("/api/users").expect(200);
    const user = {username:"testi", name:"joku"};
    const resp = await api.post("/api/users").send(user).expect(400);
    expect(resp.body.error).toBeDefined();
    const dbend = await api.get("/api/users").expect(200);
    expect(dbend.body).toHaveLength(dbbegin.body.length);
  });
  test("Creating user with short pw", async () => {
    const dbbegin = await api.get("/api/users").expect(200);
    const user = {username:"testi", name:"joku", password:"12"};
    const resp = await api.post("/api/users").send(user).expect(400);
    expect(resp.body.error).toBeDefined();
    const dbend = await api.get("/api/users").expect(200);
    expect(dbend.body).toHaveLength(dbbegin.body.length);
  });
  test("Creating user with no username", async () => {
    const dbbegin = await api.get("/api/users").expect(200);
    const user = {name:"joku", password:"12345678"};
    const resp = await api.post("/api/users").send(user).expect(400);
    expect(resp.body.error).toBeDefined();
    const dbend = await api.get("/api/users").expect(200);
    expect(dbend.body).toHaveLength(dbbegin.body.length);
  });
  test("Creating user with short username", async () => {
    const dbbegin = await api.get("/api/users").expect(200);
    const user = {username:"jo", name:"joku", password:"12345678"};
    const resp = await api.post("/api/users").send(user).expect(400);
    expect(resp.body.error).toBeDefined();
    const dbend = await api.get("/api/users").expect(200);
    expect(dbend.body).toHaveLength(dbbegin.body.length);
  });
}); 



