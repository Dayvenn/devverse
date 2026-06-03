import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

// CREATE POST
app.post("/posts", async (req, res) => {
  const { userId, content } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        userId,
        content,
      },
    });

    return res.json(post);
  } catch {
    return res.status(500).json({
      error: "Erro ao criar post",
    });
  }
});

// GET POSTS
app.get("/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(posts);
  } catch {
    return res.status(500).json({
      error: "Erro ao buscar posts",
    });
  }
});

// LIKE POST
app.post("/posts/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    return res.json(post);
  } catch {
    return res.status(500).json({
      error: "Erro ao curtir post",
    });
  }
});

// DELETE POST
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.post.delete({
      where: { id },
    });

    return res.json({
      message: "Post removido",
    });
  } catch {
    return res.status(500).json({
      error: "Erro ao remover post",
    });
  }
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(Number(PORT), () => {
  console.log(`Server running on port ${PORT}`);
});
