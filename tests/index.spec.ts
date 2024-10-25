import request from "supertest";
import { server } from "../main";

describe("User API Tests", () => {
 let testUserId: string | undefined; 

  describe("Basic CRUD Operations", () => {
    it("should retrieve an empty list of users", async () => {
      const res = await request(server).get("/api/users");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should create a new user", async () => {
      const res = await request(server)
        .post("/api/users")
        .set("Accept", "application/json")
        .send({
          username: "testUser",
          age: 25,
          hobbies: ["reading", "coding"],
        });
      testUserId = res.body.id;
      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        username: "testUser",
        age: 25,
        hobbies: ["reading", "coding"],
      });
    });

    it("should retrieve the user by ID", async () => {
      const res = await request(server).get(`/api/users/${testUserId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        username: "testUser",
        age: 25,
        hobbies: ["reading", "coding"],
      });
    });

    it("should update the user details", async () => {
      const res = await request(server)
        .put(`/api/users/${testUserId}`)
        .set("Accept", "application/json")
        .send({
          username: "updatedUser",
          age: 26,
          hobbies: ["hiking"],
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        id: testUserId,
        username: "updatedUser",
        age: 26,
        hobbies: ["hiking"],
      });
    });

    it("should delete the user", async () => {
      const res = await request(server).delete(`/api/users/${testUserId}`);
      expect(res.statusCode).toBe(204);
    });

    it("should return 404 for deleted user retrieval", async () => {
      const res = await request(server).get(`/api/users/${testUserId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "User not found" });
    });
  });

  describe("Invalid UUID Requests", () => {
    const invalidUUID = "invalid-uuid";

    it("should return 400 for non-UUID GET request", async () => {
      const res = await request(server).get(`/api/users/${invalidUUID}`);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "Invalid UUID" });
    });

    it("should return 400 for non-UUID PUT request", async () => {
      const res = await request(server)
        .put(`/api/users/${invalidUUID}`)
        .set("Accept", "application/json")
        .send({ username: "anyUser", age: 30, hobbies: ["coding"] });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "Invalid UUID" });
    });

    it("should return 400 for non-UUID DELETE request", async () => {
      const res = await request(server).delete(`/api/users/${invalidUUID}`);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "Invalid UUID" });
    });

    it("should return 400 for missing required fields in POST request", async () => {
      const res = await request(server)
        .post("/api/users")
        .set("Accept", "application/json")
        .send({ username: "missingAgeUser", hobbies: ["playing"] });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: "Missing required fields" });
    });
  });

  describe("Non-existent User or Route", () => {
    const nonExistentUUID = "f61a1454-05df-4c49-bfc1-13775338fc41";

    it("should return 404 for non-existent user GET request", async () => {
      const res = await request(server).get(`/api/users/${nonExistentUUID}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "User not found" });
    });

    it("should return 404 for non-existent user PUT request", async () => {
      const res = await request(server)
        .put(`/api/users/${nonExistentUUID}`)
        .set("Accept", "application/json")
        .send({ username: "newUser", age: 27, hobbies: ["travelling"] });
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "User not found" });
    });

    it("should return 404 for non-existent user DELETE request", async () => {
      const res = await request(server).delete(`/api/users/${nonExistentUUID}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "User not found" });
    });

    it("should return 404 for requests to invalid routes", async () => {
      const invalidRoutes = ["/api/players", "/api/players/random-id"];

      for (const route of invalidRoutes) {
        const res = await request(server).get(route);
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: "Route not found" });
      }
    });
  });
});
