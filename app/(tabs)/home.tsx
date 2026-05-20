import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

const initialPosts = [
  {
    id: "1",
    user: "João Dev",
    content: "Consegui meu primeiro job como dev ",
    liked: false,
  },
  {
    id: "2",
    user: "Maria Code",
    content: "Aprendendo React Native hoje ",
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
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            
           
            <Text style={styles.user}> {item.user}</Text>

            
            <Text style={styles.content}>{item.content}</Text>

            
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => toggleLike(item.id)}>
                <Text
                  style={[
                    styles.action,
                    item.liked && { color: "#ff4d4d" },
                  ]}
                >
                  {item.liked ? "Curtido " : "Curtir "}
                </Text>
              </TouchableOpacity>

              <Text style={styles.action}>Comentar 💬</Text>
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
    padding: 10,
  },

  card: {
    backgroundColor: "#0f1f3d",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  user: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },

  content: {
    color: "#ddd",
    marginBottom: 10,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  action: {
    color: "#3B82F6",
    fontWeight: "bold",
  },
});