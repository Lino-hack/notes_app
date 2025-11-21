const path = require("path");
const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../src/app");

const INVALID_FILE_PATH = path.join(__dirname, "fixtures", "invalid.txt");
const NON_EXISTENT_ID = "507f1f77bcf86cd799439012";
const PNG_BUFFER = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const registerAndLogin = async () => {
  await request(app).post("/api/auth/register").send({
    name: "Note Owner",
    email: "owner@example.com",
    password: "Password123",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "owner@example.com",
    password: "Password123",
  });

  return loginRes.body.token;
};

const createNote = async (token, payload = {}) => {
  const {
    title = "Sample note",
    category = "personnel",
    content = "<p>Contenu</p>",
  } = payload;

  const res = await request(app)
    .post("/api/notes")
    .set("Authorization", `Bearer ${token}`)
    .field("title", title)
    .field("category", category)
    .field("content", content);

  if (res.status !== 201) {
    throw new Error(`Note creation failed: ${res.status} ${JSON.stringify(res.body)}`);
  }

  return res.body.note;
};

describe("Notes API", () => {
  it("should reject unauthenticated access", async () => {
    const res = await request(app).get("/api/notes");
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token/i);
  });

  it("should reject invalid JWT tokens", async () => {
    const res = await request(app)
      .get("/api/notes")
      .set("Authorization", "Bearer invalid-token");

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalide/i);
  });

  it("should reject tokens for deleted users", async () => {
    const fakeUserId = "507f1f77bcf86cd799439011";
    const token = jwt.sign({ id: fakeUserId }, process.env.JWT_SECRET || "test-secret");
    const res = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/introuvable/i);
  });

  it("should create and list notes with search filters", async () => {
    const token = await registerAndLogin();
    await createNote(token, {
      title: "Urgent meeting",
      category: "urgent",
      content: "<p>Préparer la réunion</p>",
    });

    const listRes = await request(app)
      .get("/api/notes")
      .query({ search: "urgent" })
      .set("Authorization", `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.meta.total).toBe(1);
    expect(listRes.body.notes[0].category).toBe("urgent");
  });

  it("should validate payloads before persisting a note", async () => {
    const token = await registerAndLogin();
    const res = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .field("category", "travail");

    expect(res.status).toBe(422);
    expect(res.body.errors[0].path).toBe("title");
  });

  it("should reject unsupported file uploads", async () => {
    const token = await registerAndLogin();
    const res = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Note avec import invalide")
      .field("category", "travail")
      .attach("image", INVALID_FILE_PATH);

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/Type de fichier/i);
  });

  it("should update, sanitize and delete a note", async () => {
    const token = await registerAndLogin();
    const note = await createNote(token, {
      title: "Note dangereuse",
      content: '<p>Safe</p><script>alert("xss")</script>',
    });

    expect(note.content).toContain("Safe");
    expect(note.content).not.toContain("script");

    const getRes = await request(app)
      .get(`/api/notes/${note._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.note.title).toBe("Note dangereuse");

    const updateRes = await request(app)
      .put(`/api/notes/${note._id}`)
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Note mise à jour")
      .field("category", "travail")
      .field("content", "<p>Contenu enrichi</p>");

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.note.category).toBe("travail");
    expect(updateRes.body.note.content).toContain("Contenu enrichi");

    const deleteRes = await request(app)
      .delete(`/api/notes/${note._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toMatch(/supprimée/);
  });

  it("should return 404 for missing notes when updating or deleting", async () => {
    const token = await registerAndLogin();
    const updateRes = await request(app)
      .put(`/api/notes/${NON_EXISTENT_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Fantôme")
      .field("category", "travail");
    expect(updateRes.status).toBe(404);

    const deleteRes = await request(app)
      .delete(`/api/notes/${NON_EXISTENT_ID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(deleteRes.status).toBe(404);
  });

  it("should manage attachment lifecycle", async () => {
    const token = await registerAndLogin();

    const createRes = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Note avec fichier")
      .field("category", "personnel")
      .attach("image", PNG_BUFFER, {
        filename: "evidence.png",
        contentType: "image/png",
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.note.attachment.filename).toBe("evidence.png");

    const noteId = createRes.body.note._id;

    const updateRes = await request(app)
      .put(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("image", PNG_BUFFER, {
        filename: "replacement.png",
        contentType: "image/png",
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.note.attachment.filename).toBe("replacement.png");

    const deleteRes = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);
  });

  it("should handle advanced filters, pagination and sorting", async () => {
    const token = await registerAndLogin();
    await Promise.all([
      createNote(token, {
        title: "Urgent release",
        category: "urgent",
      }),
      createNote(token, {
        title: "Travail sprint",
        category: "travail",
      }),
      createNote(token, {
        title: "Moment perso",
        category: "personnel",
      }),
    ]);

    const filteredRes = await request(app)
      .get("/api/notes")
      .query({
        category: "travail",
        sort: "category",
        limit: 2,
        page: 1,
        from: "2020-01-01",
        to: "2100-01-01",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(filteredRes.status).toBe(200);
    expect(filteredRes.body.notes).toHaveLength(1);
    expect(filteredRes.body.meta.hasMore).toBeFalsy();
  });

  it("should return stats overview", async () => {
    const token = await registerAndLogin();
    await createNote(token, { title: "Task 1", category: "travail" });
    await createNote(token, { title: "Task 2", category: "urgent" });

    const statsRes = await request(app)
      .get("/api/notes/stats/overview")
      .set("Authorization", `Bearer ${token}`);

    expect(statsRes.status).toBe(200);
    expect(statsRes.body.categories.travail).toBeGreaterThanOrEqual(1);
    expect(statsRes.body.totalNotes).toBeGreaterThanOrEqual(2);
    expect(statsRes.body.withAttachments).toBeGreaterThanOrEqual(0);
  });
});

