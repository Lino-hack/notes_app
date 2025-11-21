const request = require("supertest");
const app = require("../src/app");

describe("Auth API", () => {
  it("should register a new user and return a token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "Password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
  });

  it("should login an existing user", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email: "login@example.com",
      password: "Password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "Password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

