import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { api } from "../../services/api";
export default function Chat() {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  async function loadData() {
    setLoading(true);

    try {
      const data = await AsyncStorage.getItem("user");
      if (!data) return;

      const user = JSON.parse(data);
      setCurrentUser(user);

      const [convRes, usersRes] = await Promise.all([
        api.get(`/conversations/${user.id}`),
        api.get("/users"),
      ]);

      setConversations(convRes.data);
      setAllUsers(usersRes.data.filter((u: any) => u.id !== user.id));
    } catch (error) {
      console.error("Erro ao carregar chats:", error);
    } finally {
      setLoading(false);
    }
  }

  function openChat(otherUser: any) {
    router.push({
      pathname: "/conversation",
      params: {
        otherId: otherUser.id,
        otherName: otherUser.name,
      },
    });
  }

  // Usuários com quem ainda não tem conversa
  const conversationIds = new Set(conversations.map((c) => c.user.id));
  const newUsers = allUsers.filter((u) => !conversationIds.has(u.id));

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
        <Ionicons name="chatbubble-ellipses-outline" size={26} color="#fff" />
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.user.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            {/* CONVERSAS EXISTENTES */}
            {conversations.length > 0 && (
              <Text style={styles.sectionTitle}>Conversas</Text>
            )}
          </>
        }
        ListFooterComponent={
          <>
            {/* NOVOS USUÁRIOS */}
            {newUsers.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Devs na plataforma</Text>
                {newUsers.map((user) => (
                  <TouchableOpacity
                    key={user.id}
                    style={styles.chatCard}
                    onPress={() => openChat(user)}
                  >
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {user.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.chatInfo}>
                      <Text style={styles.user}>{user.name}</Text>
                      <Text style={styles.message}>Iniciar conversa...</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#3B82F6"
                    />
                  </TouchableOpacity>
                ))}
              </>
            )}
          </>
        }
        ListEmptyComponent={
          conversations.length === 0 && newUsers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={48} color="#3B82F6" />
              <Text style={styles.emptyText}>Nenhum dev encontrado</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatCard}
            onPress={() => openChat(item.user)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.chatInfo}>
              <Text style={styles.user}>{item.user.name}</Text>
              <Text style={styles.message} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#3B82F6" />
          </TouchableOpacity>
        )}
      />
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
  sectionTitle: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
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
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
    gap: 12,
  },
  emptyText: {
    color: "#7C8BA1",
    fontSize: 16,
  },
});
