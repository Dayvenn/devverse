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
    }, [])
  );

 async function loadData() {
  setLoading(true);
  try {
    const data = await AsyncStorage.getItem("user");
    if (!data) return;

    const user = JSON.parse(data);
    setCurrentUser(user);

    try {
      const usersRes = await api.get("/users");
      setAllUsers(usersRes.data.filter((u: any) => u.id !== user.id));
    } catch (err) {
      console.log("Erro ao buscar usuários:", err);
    }

    try {
      const convRes = await api.get(`/conversations/${user.id}`);
      setConversations(convRes.data);
    } catch (err) {
      console.log("Erro ao buscar conversas:", err);
    }
  } catch (error) {
    console.error("Erro ao carregar dados do chat:", error);
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

  function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }

  function formatTime(dateStr: string) {
    const diff = Math.floor(
      (new Date().getTime() - new Date(dateStr).getTime()) / 60000
    );
    if (diff < 1) return "Agora";
    if (diff < 60) return `${diff}min`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}d`;
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Usuários com quem ainda não conversa
  const conversationIds = new Set(conversations.map((c) => c.user.id));
  const newUsers = allUsers.filter((u) => !conversationIds.has(u.id));

  const isEmpty = conversations.length === 0 && newUsers.length === 0;

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
        <Ionicons name="chatbubble-ellipses-outline" size={26} color="#fff" />
      </View>

      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={48} color="#1E3A5F" />
          <Text style={styles.emptyText}>Nenhum dev encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.user.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListHeaderComponent={
            conversations.length > 0 ? (
              <Text style={styles.sectionTitle}>Conversas</Text>
            ) : null
          }
          ListFooterComponent={
            newUsers.length > 0 ? (
              <>
                <Text style={[styles.sectionTitle, { marginTop: conversations.length > 0 ? 20 : 0 }]}>
                  Devs na plataforma
                </Text>
                {newUsers.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.chatCard}
                    onPress={() => openChat(item)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
                    </View>
                    <View style={styles.chatInfo}>
                      <Text style={styles.user}>{item.name}</Text>
                      <Text style={styles.message}>
                        {item.cargo || "Iniciar conversa..."}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#3B82F6" />
                  </TouchableOpacity>
                ))}
              </>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatCard}
              onPress={() => openChat(item.user)}
              activeOpacity={0.8}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(item.user.name)}</Text>
              </View>
              <View style={styles.chatInfo}>
                <Text style={styles.user}>{item.user.name}</Text>
                <Text style={styles.message} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
              <Text style={styles.timeText}>{formatTime(item.lastAt)}</Text>
            </TouchableOpacity>
          )}
        />
      )}
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
  timeText: {
    color: "#7C8BA1",
    fontSize: 12,
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