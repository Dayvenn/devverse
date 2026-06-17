/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/* =====================
   HOME
===================== */
app.get("/", (req, res) => {
  res.json({ status: "API rodando 🚀" });
});

/* =====================
   REGISTER
===================== */
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  try {
    const exists = await prisma.user.findUnique({ where: { email } });

    if (exists) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const user = await prisma.user.create({
      data: { name, email, password, photo: null },
    });

    return res.json({ user });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ error: "Erro ao cadastrar" });
  }
});

/* =====================
   LOGIN
===================== */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha obrigatórios" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Login inválido" });
    }

    return res.json({ message: "Login ok 🚀", user });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ error: "Erro no servidor" });
  }
});

/* =====================
   USERS
===================== */
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

/* =====================
   GET USER BY ID (PERFIL)
===================== */
app.get("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

/* =====================
   UPDATE USER
===================== */
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, bio, cargo, stack, cidade, github, photo } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome obrigatório" });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name, bio, cargo, stack, cidade, github, photo },
    });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

/* =====================
   CAREER (CORRIGIDO)
===================== */
app.get("/career/:userId", async (req, res) => {
  try {
    const career = await prisma.career.findUnique({
      where: { userId: req.params.userId },
    });

    return res.json(career);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar carreira" });
  }
});

app.post("/career", async (req, res) => {
  const { userId, status, modalidade, emprego, experiencia, avaliacao, pretensao } =
    req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId obrigatório" });
  }

  try {
    const career = await prisma.career.create({
      data: { userId, status, modalidade, emprego, experiencia, avaliacao, pretensao },
    });

    return res.json(career);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar carreira" });
  }
});

//POST 

app.post("/posts", async (req, res) => {
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  try {
    const post = await prisma.post.create({
      data: { userId, content },
      include: { user: true },
    });

    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar post" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { user: true, _count: { select: { comments: true } } },
      orderBy: { createdAt: "desc" },
    });

    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

// REAÇÃO 

app.post("/posts/:id/like", async (req, res) => {
  const { id } = req.params;

  const post = await prisma.post.update({
    where: { id },
    data: { likes: { increment: 1 } },
  });

  return res.json(post);
});

app.delete("/posts/:id", async (req, res) => {
  await prisma.post.delete({ where: { id: req.params.id } });
  return res.json({ message: "Post removido" });
});

app.post("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { userId, content } = req.body;

  const comment = await prisma.comment.create({
    data: { postId: id, userId, content },
    include: { user: true },
  });

  return res.json(comment);
});

//MENSAGENS 

app.post("/messages", async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  const message = await prisma.message.create({
    data: { senderId, receiverId, content },
    include: { sender: true, receiver: true },
  });

  return res.json(message);
});

app.get("/messages/:userA/:userB", async (req, res) => {
  const { userA, userB } = req.params;

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userA, receiverId: userB },
        { senderId: userB, receiverId: userA },
      ],
    },
    orderBy: { createdAt: "asc" },
    include: { sender: true },
  });

  return res.json(messages);
});

// CONVERSAS 
app.get("/conversations/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: { sender: true, receiver: true },
      orderBy: { createdAt: "desc" },
    });

    const seen = new Set<string>();
    const conversations: any[] = [];

    for (const msg of messages) {
      const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!seen.has(otherId)) {
        seen.add(otherId);
        const other = msg.senderId === userId ? msg.receiver : msg.sender;
        conversations.push({
          user: other,
          lastMessage: msg.content,
          lastAt: msg.createdAt,
        });
      }
    }

    return res.json(conversations);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar conversas" });
  }
});

// POSTS DO USUÁRIO

app.get("/posts/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar posts do usuário" });
  }
}); 

// SERV

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});