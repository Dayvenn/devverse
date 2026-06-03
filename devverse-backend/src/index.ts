import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/* =====================
   HOME
===================== */
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

/* =====================
   REGISTER
===================== */
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const user = await prisma.user.create({
      data: { name, email, password },
    });

    return res.json(user);
  } catch {
    return res.status(500).json({ error: "Erro ao cadastrar" });
  }
});

/* =====================
   LOGIN
===================== */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Login inválido" });
    }

    return res.json({
      message: "Login ok 🚀",
      user,
    });
  } catch {
    return res.status(500).json({ error: "Erro no servidor" });
  }
});

/* =====================
   CAREER (currículo)
===================== */
app.post("/career", async (req, res) => {
  const {
    userId,
    status,
    modalidade,
    emprego,
    experiencia,
    avaliacao,
    pretensao,
  } = req.body;

  try {
    const career = await prisma.career.upsert({
      where: { userId },
      update: {
        status,
        modalidade,
        emprego,
        experiencia,
        avaliacao,
        pretensao,
      },
      create: {
        userId,
        status,
        modalidade,
        emprego,
        experiencia,
        avaliacao,
        pretensao,
      },
    });

    return res.json(career);
  } catch {
    return res.status(500).json({ error: "Erro ao salvar currículo" });
  }
});

/* =====================
   GET CAREER
===================== */
app.get("/career/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const career = await prisma.career.findUnique({
      where: { userId },
    });

    return res.json(career);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar currículo" });
  }
});

/* =====================
   POSTS
===================== */
app.post("/posts", async (req, res) => {
  const { userId, content } = req.body;

  const post = await prisma.post.create({
    data: { userId, content },
  });

  return res.json(post);
});

app.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return res.json(posts);
});

app.post("/posts/:id/like", async (req, res) => {
  const { id } = req.params;

  const post = await prisma.post.update({
    where: { id },
    data: {
      likes: { increment: 1 },
    },
  });

  return res.json(post);
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.post.delete({
    where: { id },
  });

  return res.json({ message: "Post removido" });
});

/* =====================
   START
===================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});