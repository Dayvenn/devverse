import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const data = await AsyncStorage.getItem("user");

      if (data) {
        setUser(JSON.parse(data));
      }
    }

    loadUser();
  }, []);

  function getInitials(name?: string) {
    if (!name) return "U";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Perfil
        </Text>

        <Ionicons
          name="settings-outline"
          size={24}
          color="#fff"
        />
      </View>

      {/* PROFILE CARD */}
      <View style={styles.card}>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(user?.name)}
          </Text>
        </View>

        <Text style={styles.name}>
          {user?.name || "Usuário"}
        </Text>

        <Text style={styles.email}>
          {user?.email || "email@email.com"}
        </Text>

      </View>

      {/* INFO */}
      <View style={styles.infoCard}>

        <View style={styles.infoRow}>
          <Ionicons
            name="code-slash-outline"
            size={20}
            color="#3B82F6"
          />

          <Text style={styles.infoText}>
            Desenvolvedor
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="rocket-outline"
            size={20}
            color="#3B82F6"
          />

          <Text style={styles.infoText}>
            Membro DevVerse
          </Text>
        </View>

      </View>

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/career-form")}
      >

        <Ionicons
          name="briefcase-outline"
          size={20}
          color="#fff"
        />

        <Text style={styles.buttonText}>
          Carreira
        </Text>

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05152C",
    paddingTop: 55,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 28,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#0C1B36",

    borderRadius: 20,

    padding: 28,

    alignItems: "center",

    marginBottom: 22,
  },

  avatar: {
    width: 90,
    height: 90,

    borderRadius: 45,

    backgroundColor: "#3B82F6",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 16,
  },

  avatarText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },

  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },

  email: {
    color: "#9CA3AF",
    fontSize: 15,
  },

  infoCard: {
    backgroundColor: "#0C1B36",

    borderRadius: 18,

    padding: 20,

    marginBottom: 24,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 16,
  },

  infoText: {
    color: "#fff",
    marginLeft: 12,
    fontSize: 15,
  },

  button: {
    backgroundColor: "#3B82F6",

    height: 56,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",

    gap: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});