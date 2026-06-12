import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = "http://192.168.101.7:3000";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [commentModal, setCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  async function fetchPosts() {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setCurrentUser(JSON.parse(userData));

      const response = await fetch(`${API_URL}/posts`);
      const data = await response.json();
      setPosts(data.map((p: any) => ({ ...p, liked: false })));
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
      await fetch(`${API_URL}/posts/${id}/like`, { method: "POST" });
      setPosts((old) =>
        old.map((p) =>
          p.id === id ? { ...p, liked: true, likes: p.likes + 1 } : p
        )
      );
    } catch (error) {
      console.error("Erro ao curtir:", error);
    }
  }

  async function deletePost(id: string) {
    try {
      await fetch(`${API_URL}/posts/${id}`, { method: "DELETE" });
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
      const res = await fetch(`${API_URL}/posts/${post.id}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    } finally {
      setLoadingComments(false);
    }
  }

  async function handleSendComment() {
    if (!commentText.trim() || !currentUser) return;
    setSendingComment(true);
    try {
      const res = await fetch(`${API_URL}/posts/${selectedPost.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, content: commentText.trim() }),
      });
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
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
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>DEVVERSE</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* POSTS */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchPosts(); }}
            tintColor="#3B82F6"
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>

            {/* USER */}
            <View style={styles.userRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.user?.name?.charAt(0) ?? "?"}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.user}>{item.user?.name ?? "Usuário"}</Text>
                <Text style={styles.time}>{formatDate(item.createdAt)}</Text>
              </View>

              {currentUser?.id === item.user?.id && (
                <TouchableOpacity onPress={() => deletePost(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#7C8BA1" />
                </TouchableOpacity>
              )}
            </View>

            {/* CONTENT */}
            <Text style={styles.content}>{item.content}</Text>

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
                <Text style={[styles.actionText, item.liked && { color: "#ff4d4d" }]}>
                  {item.likes > 0 ? `${item.likes} ` : ""}Curtir
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                 style={styles.actionButton}
                 onPress={() => openComments(item)}
>
  <Ionicons name="chatbubble-outline" size={18} color="#3B82F6" />
  <Text style={styles.actionText}>
    {item._count?.comments > 0 ? `${item._count.comments} ` : ""}Comentários
  </Text>
</TouchableOpacity>
            </View>

          </View>
        )}
      />

      {/* MODAL COMENTÁRIOS */}
      <Modal visible={commentModal} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>

              {/* HEADER MODAL */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Comentários</Text>
                <TouchableOpacity onPress={() => { setCommentModal(false); setComments([]); }}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* LISTA DE COMENTÁRIOS */}
              {loadingComments ? (
                <ActivityIndicator color="#3B82F6" style={{ marginTop: 20 }} />
              ) : (
                <FlatList
                  data={comments}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  style={{ maxHeight: 350 }}
                  ListEmptyComponent={
                    <View style={styles.emptyComments}>
                      <Text style={styles.emptyText}>Nenhum comentário ainda. Seja o primeiro!</Text>
                    </View>
                  }
                  renderItem={({ item }) => (
                    <View style={styles.commentRow}>
                      <View style={styles.commentAvatar}>
                        <Text style={styles.commentAvatarText}>
                          {item.user?.name?.charAt(0).toUpperCase() ?? "?"}
                        </Text>
                      </View>
                      <View style={styles.commentBubble}>
                        <Text style={styles.commentUser}>{item.user?.name ?? "Usuário"}</Text>
                        <Text style={styles.commentContent}>{item.content}</Text>
                        <Text style={styles.commentTime}>{formatDate(item.createdAt)}</Text>
                      </View>
                    </View>
                  )}
                />
              )}

              {/* INPUT COMENTÁRIO */}
              <View style={styles.commentInputRow}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Escreva um comentário..."
                  placeholderTextColor="#7C8BA1"
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                />
                <TouchableOpacity
                  style={[styles.sendBtn, (!commentText.trim() || sendingComment) && { opacity: 0.5 }]}
                  onPress={handleSendComment}
                  disabled={!commentText.trim() || sendingComment}
                >
                  <Ionicons name="send" size={18} color="#fff" />
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

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
    shadowOffset: { width: 0, height: 4 },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#0C1B36",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  commentRow: {
    flexDirection: "row",
    marginBottom: 14,
    gap: 10,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  commentAvatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: "#12284A",
    borderRadius: 14,
    padding: 12,
  },
  commentUser: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 4,
  },
  commentContent: {
    color: "#E5E7EB",
    fontSize: 14,
    lineHeight: 20,
  },
  commentTime: {
    color: "#7C8BA1",
    fontSize: 11,
    marginTop: 6,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginTop: 16,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#12284A",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 14,
    maxHeight: 80,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyComments: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyText: {
    color: "#7C8BA1",
    fontSize: 14,
  },
});