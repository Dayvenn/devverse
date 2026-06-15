import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

import { useFocusEffect } from "expo-router";
import { api } from "../../services/api";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [commentModal, setCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  async function fetchPosts() {
    try {
      const userData = await AsyncStorage.getItem("user");

      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }

      const response = await api.get("/posts");

      setPosts(
        response.data.map((p: any) => ({
          ...p,
          liked: false,
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchPosts();
    }, [])
  );

  async function toggleLike(id: string) {
    const post = posts.find((p) => p.id === id);
    if (post?.liked) return;

    try {
      await api.post(`/posts/${id}/like`);

      setPosts((old) =>
        old.map((p) =>
          p.id === id ? { ...p, liked: true, likes: (p.likes ?? 0) + 1 } : p
        )
      );
    } catch (error) {
      console.error("Erro ao curtir:", error);
    }
  }

  async function deletePost(id: string) {
    try {
      await api.delete(`/posts/${id}`);
      setPosts((old) => old.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }

  async function openComments(post: any) {
    setSelectedPost(post);
    setCommentModal(true);
    setLoadingComments(true);

    try {
      const res = await api.get(`/posts/${post.id}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    } finally {
      setLoadingComments(false);
    }
  }

  async function handleSendComment() {
    if (!commentText.trim() || !currentUser || !selectedPost) return;

    setSendingComment(true);

    try {
      const res = await api.post(
        `/posts/${selectedPost.id}/comments`,
        {
          userId: currentUser.id,
          content: commentText.trim(),
        }
      );

      setComments((prev) => [...prev, res.data]);
      setCommentText("");
    } catch (error) {
      console.error("Erro ao comentar:", error);
    } finally {
      setSendingComment(false);
    }
  }

  function formatDate(dateStr: string) {
    const diff = Math.floor(
      (new Date().getTime() - new Date(dateStr).getTime()) / 60000
    );

    if (diff < 1) return "Agora mesmo";
    if (diff < 60) return `${diff}min atrás`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h atrás`;
    return `${Math.floor(diff / 1440)}d atrás`;
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>DEVVERSE</Text>
        <Ionicons name="notifications-outline" size={26} color="#fff" />
      </View>

      {/* POSTS */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchPosts();
            }}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.user}>
              {item.user?.name ?? "Usuário"}
            </Text>

            <Text style={styles.content}>{item.content}</Text>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => toggleLike(item.id)}>
                <Ionicons name="heart-outline" size={18} color="#3B82F6" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openComments(item)}>
                <Ionicons name="chatbubble-outline" size={18} color="#3B82F6" />
              </TouchableOpacity>

              {currentUser?.id === item.user?.id && (
                <TouchableOpacity onPress={() => deletePost(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#ff4d4d" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      {/* MODAL COMMENTS */}
      <Modal visible={commentModal} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modal}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Comentários</Text>

              {loadingComments ? (
                <ActivityIndicator color="#3B82F6" />
              ) : (
                <FlatList
                  data={comments}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <Text style={{ color: "#fff", marginBottom: 10 }}>
                      {item.content}
                    </Text>
                  )}
                />
              )}

              <TextInput
                placeholder="Comentar..."
                placeholderTextColor="#888"
                value={commentText}
                onChangeText={setCommentText}
                style={styles.input}
              />

              <TouchableOpacity onPress={handleSendComment}>
                <Text style={{ color: "#3B82F6", marginTop: 10 }}>
                  Enviar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setCommentModal(false)}>
                <Text style={{ color: "#ff4d4d", marginTop: 10 }}>
                  Fechar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05152C", padding: 16 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  logo: { color: "#fff", fontSize: 22, fontWeight: "bold" },

  card: { backgroundColor: "#0C1B36", padding: 16, borderRadius: 12, marginBottom: 12 },
  user: { color: "#fff", fontWeight: "bold" },
  content: { color: "#ddd", marginVertical: 8 },

  actions: { flexDirection: "row", gap: 15 },

  modal: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  modalBox: { backgroundColor: "#0C1B36", padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalTitle: { color: "#fff", fontSize: 18, marginBottom: 10 },

  input: {
    backgroundColor: "#12284A",
    padding: 10,
    borderRadius: 10,
    color: "#fff",
    marginTop: 10,
  },
});