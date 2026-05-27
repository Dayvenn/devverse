import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function Create() {
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Criar Post</Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>

        {/* USER */}
        <View style={styles.userRow}>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>

          <Text style={styles.username}>
            Maylon
          </Text>
        </View>

        {/* INPUT */}
        <TextInput
          placeholder="Compartilhe algo..."
          placeholderTextColor="#7C8BA1"
          multiline
          style={styles.input}
        />

        {/* BUTTON */}
        <TouchableOpacity style={styles.button}>
          <Ionicons
            name="send"
            size={18}
            color="#fff"
          />

          <Text style={styles.buttonText}>
            Publicar
          </Text>
        </TouchableOpacity>

      </View>
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
    marginBottom: 24,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#0C1B36",
    borderRadius: 18,
    padding: 18,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3B82F6",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  username: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  input: {
    backgroundColor: "#12284A",
    borderRadius: 14,
    padding: 16,

    color: "#fff",

    minHeight: 140,

    textAlignVertical: "top",

    marginBottom: 20,
  },

  button: {
    backgroundColor: "#3B82F6",

    height: 52,

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",
    gap: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});