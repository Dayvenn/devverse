import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";

import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://10.120.120.140:3000";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function validarEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  async function handleLogin() {
    if (!email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    if (!validarEmail(email)) {
      alert("Email inválido");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: senha,
        }),
      });

      const data = await response.json();

      setLoading(false);

      if (response.ok) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        alert(`Bem-vindo ${data.user.name} 🚀`);
        router.replace("/home");
      } else {
        alert(data.error || "Erro ao fazer login");
      }
    } catch (error) {
      setLoading(false);
      alert("Erro de conexão com o servidor");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.center}>

      
        <View style={styles.header}>
          <Image
            source={require("./assets/logo.png")} 
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>BEM VINDO DE VOLTA</Text>
        </View>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          style={styles.input}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            onChangeText={setSenha}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.show}>
              {showPassword ? "Ocultar" : "Ver"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.forgot}>Esqueceu a senha?</Text>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>LOGAR</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.create} onPress={() => router.push("/register")}>
          Não possui conta? <Text style={styles.link}>Criar</Text>
        </Text>
      </View>

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

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  input: {
    backgroundColor: "#0f1f3d",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f1f3d",
    borderRadius: 10,
    marginBottom: 12,
    paddingRight: 10,
  },

  passwordInput: {
    flex: 1,
    color: "#fff",
    padding: 15,
  },

  show: {
    color: "#3B82F6",
    fontWeight: "bold",
  },

  forgot: {
    color: "#3B82F6",
    textAlign: "right",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },

  create: {
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