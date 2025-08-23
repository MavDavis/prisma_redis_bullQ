const express = require("express");
const { PrismaClient } = require("./generated/prisma");
const redis = require("./redis"); 

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Example: get user by ID with Redis cache
app.get("/api/user/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    // 1) check cache
    const key = `user:${id}`;
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // 2) fetch from DB
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // 3) cache and return
await redis.set(`user:${id}`, JSON.stringify(user), "EX", 60); 
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/api/user", async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { name, email },  });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }});
app.listen(3000, () => console.log("API on http://localhost:3000"));
