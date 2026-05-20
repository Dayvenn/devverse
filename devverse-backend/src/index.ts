import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API rodando ");
});


// ================= REGISTER =================
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Preencha todos os campos",
    });
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return res.status(400).json({
        error: "Usuário já existe",
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return res.status(201).json(user);

  } catch {
    return res.status(500).json({
      error: "Erro ao criar usuário",
    });
  }
});


// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Preencha todos os campos",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "Usuário não encontrado",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        error: "Senha incorreta",
      });
    }

    return res.json({
      message: "Login realizado com sucesso ",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch {
    return res.status(500).json({
      error: "Erro no servidor",
    });
  }
});


// ================= SALVAR CURRÍCULO =================
app.post("/career", async (req, res) => {
  const {
    userId,
    status,
    modalidade,
    emprego,
    experiencia,
    avaliacao,
    pretensao,
    uf,
  } = req.body;

  if (!userId) {
    return res.status(400).json({
      error: "Usuário inválido",
    });
  }

  try {
    const career = await prisma.career.upsert({
      where: {
        userId,
      },

      update: {
        status,
        modalidade,
        emprego,
        experiencia,
        avaliacao,
        pretensao,
        uf,
      },

      create: {
        userId,
        status,
        modalidade,
        emprego,
        experiencia,
        avaliacao,
        pretensao,
        uf,
      },
    });

    return res.json(career);

  } catch {
    return res.status(500).json({
      error: "Erro ao salvar currículo",
    });
  }
});


// ================= PEGAR CURRÍCULO =================
app.get("/career/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const career = await prisma.career.findUnique({
      where: {
        userId,
      },
    });

    return res.json(career);

  } catch {
    return res.status(500).json({
      error: "Erro ao buscar currículo",
    });
  }
});


// ================= SERVER =================
app.listen(3000, "0.0.0.0", () => {
  console.log(
    "Servidor rodando em http://192.168.15.2:3000 "
  );
});