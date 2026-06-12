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
    include: {
      user: true,
      _count: { select: { comments: true } },
    },
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
   UPDATE USER
===================== */
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, bio, cargo, stack, cidade, github } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name, bio, cargo, stack, cidade, github },
    });

    return res.json(user);
  } catch {
    return res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

/* =====================
   POSTS BY USER
===================== */
app.get("/posts/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json(posts);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

/* =====================
   CHANGE PASSWORD
===================== */
app.put("/users/:id/password", async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user || user.password !== currentPassword) {
      return res.status(400).json({ error: "Senha atual incorreta" });
    }

    await prisma.user.update({
      where: { id },
      data: { password: newPassword },
    });

    return res.json({ message: "Senha alterada com sucesso" });
  } catch {
    return res.status(500).json({ error: "Erro ao alterar senha" });
  }
});

/* =====================
   USERS (para listar no chat)
===================== */
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });
    return res.json(users);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

/* =====================
   MESSAGES
===================== */
app.post("/messages", async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  try {
    const message = await prisma.message.create({
      data: { senderId, receiverId, content },
      include: { sender: true, receiver: true },
    });
    return res.json(message);
  } catch {
    return res.status(500).json({ error: "Erro ao enviar mensagem" });
  }
});

app.get("/messages/:userA/:userB", async (req, res) => {
  const { userA, userB } = req.params;

  try {
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
  } catch {
    return res.status(500).json({ error: "Erro ao buscar mensagens" });
  }
});

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

    // Pega a última mensagem de cada conversa
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
  } catch {
    return res.status(500).json({ error: "Erro ao buscar conversas" });
  }
});

/* =====================
   COMMENTS
===================== */
app.post("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { userId, content } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: { postId: id, userId, content },
      include: { user: true },
    });
    return res.json(comment);
  } catch {
    return res.status(500).json({ error: "Erro ao comentar" });
  }
});

app.get("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: id },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });
    return res.json(comments);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar comentários" });
  }
});

/* =====================
   START
===================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});