import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

let users: any[] = [];
let careers: any[] = [];

// HOME
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});


// REGISTER
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const exists = users.find(u => u.email === email);

  if (exists) {
    return res.status(400).json({ error: "Usuário já existe" });
  }

  const user = {
    id: String(Date.now()),
    name,
    email,
    password,
  };

  users.push(user);

  return res.json(user);
});


// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(400).json({ error: "Login inválido" });
  }

  return res.json({
    message: "Login ok 🚀",
    user,
  });
});


// SAVE CAREER
app.post("/career", (req, res) => {
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

  const index = careers.findIndex(c => c.userId === userId);

  const data = {
    userId,
    status,
    modalidade,
    emprego,
    experiencia,
    avaliacao,
    pretensao,
    uf,
  };

  if (index >= 0) {
    careers[index] = data;
  } else {
    careers.push(data);
  }

  return res.json(data);
});


// GET CAREER
app.get("/career/:userId", (req, res) => {
  const { userId } = req.params;

  const career = careers.find(c => c.userId === userId);

  return res.json(career || null);
});


// START SERVER
app.listen(3000, "0.0.0.0", () => {
  console.log("Servidor rodando 🚀");
});