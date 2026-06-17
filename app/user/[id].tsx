import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../services/api";

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [userRes, postsRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/posts`),
        ]);

        setUser(userRes.data);

        const userPosts = postsRes.data.filter(
          (post: any) => post.user?.id === id || post.userId === id
        );
        setPosts(userPosts);
      } catch (err) {
        console.log("Erro ao buscar usuário", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  function getInitials(name?: string) {
    if (!name) return "U";
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  }

  function timeAgo(dateString: string) {
    const diff = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    if (diff < 60) return "Agora mesmo";
    if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    return `${Math.floor(diff / 86400)}d atrás`;
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Ionicons name="person-outline" size={48} color="#1E3A5F" />
        <Text style={styles.emptyText}>Usuário não encontrado</Text>
      </View>
    );
  }

  const totalLikes = posts.reduce((acc, post) => acc + (post.likes || 0), 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Perfil */}

      <View style={styles.card}>
        <View style={styles.avatarWrapper}>
          {user.photo ? (
            <Image source={{ uri: user.photo }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
            </View>
          )}
        </View>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>

        {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}

        <View style={styles.badge}>
          <Text style={styles.badgeText}>🥉 Dev Iniciante</Text>
        </View>
      </View>

     

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{posts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{totalLikes}</Text>
          <Text style={styles.statLabel}>Curtidas</Text>
        </View>
      </View>

      
      {(user.cargo || user.stack || user.cidade || user.github) ? (
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Sobre</Text>

          {user.cargo ? (
            <View style={styles.infoRow}>
              <Ionicons name="briefcase-outline" size={20} color="#3B82F6" />
              <Text style={styles.infoText}>{user.cargo}</Text>
            </View>
          ) : null}

          {user.stack ? (
            <View style={styles.infoRow}>
              <Ionicons name="code-slash-outline" size={20} color="#3B82F6" />
              <Text style={styles.infoText}>{user.stack}</Text>
            </View>
          ) : null}

          {user.cidade ? (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#3B82F6" />
              <Text style={styles.infoText}>{user.cidade}</Text>
            </View>
          ) : null}

          {user.github ? (
            <View style={styles.infoRow}>
              <Ionicons name="logo-github" size={20} color="#3B82F6" />
              <Text style={styles.infoText}>{user.github}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* POSTS DO USUÁRIO */}
      <View style={styles.postsSection}>
        <Text style={styles.sectionTitle}>Posts</Text>

        {posts.length === 0 ? (
          <View style={styles.emptyPosts}>
            <Ionicons name="newspaper-outline" size={40} color="#1E3A5F" />
            <Text style={styles.emptyPostsText}>Nenhum post ainda</Text>
          </View>
        ) : (
          posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <Text style={styles.postContent}>{post.content}</Text>
              <View style={styles.postFooter}>
                <View style={styles.postStat}>
                  <Ionicons name="heart-outline" size={14} color="#7C8BA1" />
                  <Text style={styles.postStatText}>{post.likes}</Text>
                </View>
                <Text style={styles.postTime}>{timeAgo(post.createdAt)}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 40 }} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05152C",
    paddingTop: 55,
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    backgroundColor: "#05152C",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0C1B36",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#0C1B36",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 18,
  },
  avatarWrapper: {
    marginBottom: 15,
  },
  avatar: {
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 95,
    height: 95,
    borderRadius: 48,
  },
  avatarText: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
  },
  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    color: "#9CA3AF",
    marginTop: 5,
  },
  bio: {
    color: "#CBD5E1",
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
  badge: {
    backgroundColor: "#1A3566",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#0C1B36",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    color: "#3B82F6",
    fontSize: 22,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#fff",
    marginTop: 5,
  },
  infoCard: {
    backgroundColor: "#0C1B36",
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 12,
  },
  infoText: {
    color: "#fff",
    fontSize: 15,
    flex: 1,
  },
  postsSection: {
    backgroundColor: "#0C1B36",
    borderRadius: 18,
    padding: 20,
  },
  postCard: {
    backgroundColor: "#12284A",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  postContent: {
    color: "#E5E7EB",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  postStatText: {
    color: "#7C8BA1",
    fontSize: 13,
  },
  postTime: {
    color: "#7C8BA1",
    fontSize: 12,
  },
  emptyPosts: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 10,
  },
  emptyPostsText: {
    color: "#1E3A5F",
    fontSize: 15,
  },
  emptyText: {
    color: "#1E3A5F",
    fontSize: 16,
  },
});