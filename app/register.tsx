import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

const API_URL = "http://192.168.15.2:3000";

export default function Register() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");

  async function handleRegister() {
    if (!nome || !email || !senha || !confirmar) {
      alert("Preencha todos os campos");
      return;
    }

    if (senha !== confirmar) {
      alert("As senhas não coincidem");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nome,
          email: email,
          password: senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Conta criada com sucesso");
        router.replace("/login");
      } else {
        alert(data.error || "Erro ao cadastrar");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor");
    }
  }

  return (
    <View style={styles.container}>
      
      
      <View style={styles.center}>
        <Text style={styles.title}>CRIAR CONTA</Text>

        <TextInput
          placeholder="Nome"
          placeholderTextColor="#aaa"
          style={styles.input}
          onChangeText={setNome}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          style={styles.input}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
          onChangeText={setSenha}
        />

        <TextInput
          placeholder="Confirmar senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
          onChangeText={setConfirmar}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>CADASTRAR</Text>
        </TouchableOpacity>

        <Text style={styles.login} onPress={() => router.push("/login")}>
          Já tem conta? <Text style={styles.link}>Entrar</Text>
        </Text>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.terms}>Termos de uso</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05152C",
    justifyContent: "space-between",
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    backgroundColor: "#0f1f3d",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },

  login: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },

  link: {
    color: "#3B82F6",
    fontWeight: "bold",
  },

  footer: {
    alignItems: "center",
    marginBottom: 10,
  },

  terms: {
    color: "#666",
    fontSize: 12,
  },
});