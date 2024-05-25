// userRoutes.test.js
const request = require("supertest");
const express = require("express");
const app = express();
const userRoutes = require("../routes/userroutes");

app.use(express.json());
app.use("/users", userRoutes);

const chai = require("chai");
const expect = chai.expect;

describe("DELETE /users/:id", () => {
  it("should delete a user", async () => {
    const res = await request(app).delete("/users/1");
    expect(res.statusCode).to.equal(200);
  });
});

describe("POST /users", () => {
  it("should create a new user", async () => {
    const res = await request(app).post("/users").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "Test@1234",
      role: "client",
    });
    expect(res.statusCode).to.equal(201);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("username", "testuser");
  });
});

describe("GET /users", () => {
  it("should get all users", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an("array");
  });
});

describe("GET /users/:id", () => {
  it("should get a single user", async () => {
    const res = await request(app).get("/users/1");
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("username");
  });
});

describe("PUT /users/:id", () => {
  it("should update a user", async () => {
    const res = await request(app).put("/users/1").send({
      username: "updateduser",
      email: "updateduser@example.com",
      password: "Updated@1234",
      role: "admin",
    });
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("username", "updateduser");
  });
});

// Add more tests for other routes
