const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");

const app = require("../src/app");

test("GET /api/issues returns an array of issues", async () => {
  const response = await request(app)
    .get("/api/issues")
    .expect(200);

  assert.ok(Array.isArray(response.body));
});

test("POST /api/issues creates a new issue", async () => {
  const response = await request(app)
    .post("/api/issues")
    .send({
      title: "Test issue",
      description: "Created by the unit test"
    })
    .expect(200);

  assert.strictEqual(response.body.title, "Test issue");
  assert.strictEqual(
    response.body.description,
    "Created by the unit test"
  );

  assert.ok(response.body.id);
});

test("GET /api/issues/search finds an issue", async () => {
  const response = await request(app)
    .get("/api/issues/search")
    .query({
      q: "Test"
    })
    .expect(200);

  assert.ok(Array.isArray(response.body));

  assert.ok(
    response.body.some(issue => issue.title === "Test issue")
  );
});

test("GET /api/config reports that the API is configured", async () => {
  const response = await request(app)
    .get("/api/config")
    .expect(200);

  assert.strictEqual(response.body.apiConfigured, true);
});

test("GET /hello returns an HTML greeting", async () => {
  const response = await request(app)
    .get("/hello")
    .query({
      name: "GH500"
    })
    .expect(200);

  assert.match(response.text, /Hello GH500/);
});