const express = require("express");
const { PrismaClient } = require("./generated/prisma");
const redis = require("./redis"); 

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Example: get user by ID with Redis cache
app.get("/user/:id", async (req, res) => {
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
    await redis.setEx(key, 60, JSON.stringify(user)); // TTL 60s
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => console.log("API on http://localhost:3000"));
