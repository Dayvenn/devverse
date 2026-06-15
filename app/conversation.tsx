import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { api } from "../services/api";

export default function Conversation() {
  const router = useRouter();
  const { otherId, otherName } = useLocalSearchParams<{
    otherId: string;
    otherName: string;
  }>();

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const flatRef = useRef<FlatList>(null);

  useFocusEffect(
    useCallback(() => {
      loadMessages();
      const interval = setInterval(loadMessages, 3000); // atualiza a cada 3s
      return () => clearInterval(interval);
    }, []),
  );

  async function loadMessages() {
    try {
      const data = await AsyncStorage.getItem("user");
      if (!data) return;

      const user = JSON.parse(data);
      setCurrentUser(user);

      const res = await api.get(`/messages/${user.id}/${otherId}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!text.trim() || !currentUser) return;

    setSending(true);

    try {
      const res = await api.post("/messages", {
        senderId: currentUser.id,
        receiverId: otherId,
        content: text.trim(),
      });

      const newMsg = res.data;

      setMessages((prev) => [...prev, newMsg]);
      setText("");

      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      console.error("Erro ao enviar:", error);
    } finally {
      setSending(false);
    }
  }

  function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {otherName?.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.headerName}>{otherName}</Text>
      </View>

      {/* MENSAGENS */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatRef.current?.scrollToEnd({ animated: true })
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={40} color="#3B82F6" />
            <Text style={styles.emptyText}>Nenhuma mensagem ainda</Text>
            <Text style={styles.emptySubtext}>Diga olá para {otherName}!</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isMine = item.senderId === currentUser?.id;
          return (
            <View
              style={[
                styles.msgWrapper,
                isMine ? styles.msgRight : styles.msgLeft,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  isMine ? styles.bubbleMine : styles.bubbleOther,
                ]}
              >
                <Text style={styles.msgText}>{item.content}</Text>
                <Text style={styles.msgTime}>{formatTime(item.createdAt)}</Text>
              </View>
            </View>
          );
        }}
      />

      {/* INPUT */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma mensagem..."
          placeholderTextColor="#7C8BA1"
          value={text}
          onChangeText={setText}
          multiline
        />

        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!text.trim() || sending) && { opacity: 0.5 },
          ]}
          onPress={handleSend}
          disabled={!text.trim() || sending}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05152C",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 55,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#0C1B36",
    gap: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerName: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  msgWrapper: {
    marginBottom: 10,
  },
  msgRight: {
    alignItems: "flex-end",
  },
  msgLeft: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "75%",
    borderRadius: 18,
    padding: 12,
    paddingHorizontal: 16,
  },
  bubbleMine: {
    backgroundColor: "#3B82F6",
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: "#0C1B36",
    borderBottomLeftRadius: 4,
  },
  msgText: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
  },
  msgTime: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 30,
    backgroundColor: "#0C1B36",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#12284A",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 15,
    maxHeight: 100,
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
    gap: 10,
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptySubtext: {
    color: "#7C8BA1",
    fontSize: 14,
  },
});
