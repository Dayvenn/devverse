import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

const chats = [
  {
    id: 1,
    user: "Maria",
    message: "Vamos estudar React Native hoje?",
  },
  {
    id: 2,
    user: "Carlos",
    message: "Te enviei o projeto 🚀",
  },
];

export default function Chat() {
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>

        <Ionicons
          name="chatbubble-ellipses-outline"
          size={26}
          color="#fff"
        />
      </View>

      {/* CHAT LIST */}
      {chats.map((chat) => (
        <TouchableOpacity
          key={chat.id}
          style={styles.chatCard}
        >

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {chat.user.charAt(0)}
            </Text>
          </View>

          <View style={styles.chatInfo}>
            <Text style={styles.user}>
              {chat.user}
            </Text>

            <Text style={styles.message}>
              {chat.message}
            </Text>
          </View>

        </TouchableOpacity>
      ))}
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
    marginBottom: 25,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  chatCard: {
    backgroundColor: "#0C1B36",
    borderRadius: 16,
    padding: 14,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 14,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,

    backgroundColor: "#3B82F6",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  chatInfo: {
    flex: 1,
  },

  user: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  message: {
    color: "#9CA3AF",
    fontSize: 14,
  },
});