import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const initialPosts = [
  {
    id: "1",
    user: "João Dev",
    content: "Consegui meu primeiro job como dev 🚀",
    liked: false,
  },
  {
    id: "2",
    user: "Maria Code",
    content: "Aprendendo React Native hoje 💙",
    liked: false,
  },
];

export default function Home() {
  const [posts, setPosts] = useState(initialPosts);

  function toggleLike(id: string) {
    setPosts((oldPosts) =>
      oldPosts.map((post) =>
        post.id === id ? { ...post, liked: !post.liked } : post
      )
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>DEVVERSE</Text>

        <TouchableOpacity>
          <Ionicons
            name="notifications-outline"
            size={26}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* POSTS */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>

            {/* USER */}
            <View style={styles.userRow}>

              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.user.charAt(0)}
                </Text>
              </View>

              <View>
                <Text style={styles.user}>{item.user}</Text>
                <Text style={styles.time}>Agora mesmo</Text>
              </View>
            </View>

            {/* CONTENT */}
            <Text style={styles.content}>
              {item.content}
            </Text>

            {/* ACTIONS */}
            <View style={styles.actions}>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => toggleLike(item.id)}
              >
                <Ionicons
                  name={item.liked ? "heart" : "heart-outline"}
                  size={18}
                  color={item.liked ? "#ff4d4d" : "#3B82F6"}
                />

                <Text
                  style={[
                    styles.actionText,
                    item.liked && { color: "#ff4d4d" },
                  ]}
                >
                  Curtir
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons
                  name="chatbubble-outline"
                  size={18}
                  color="#3B82F6"
                />

                <Text style={styles.actionText}>
                  Comentar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05152C",
    paddingHorizontal: 16,
    paddingTop: 55,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  logo: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  card: {
    backgroundColor: "#0C1B36",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    elevation: 6,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#3B82F6",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  user: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  time: {
    color: "#7C8BA1",
    fontSize: 12,
    marginTop: 2,
  },

  content: {
    color: "#E5E7EB",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 18,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#1E2D4A",
    paddingTop: 12,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  actionText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
});