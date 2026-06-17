import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { api } from "../../services/api";
import { useRouter } from "expo-router";

const topics = [
  { label: "React Native", icon: "phone-portrait-outline" },
  { label: "JavaScript", icon: "logo-javascript" },
  { label: "TypeScript", icon: "code-slash-outline" },
  { label: "Node.js", icon: "server-outline" },
  { label: "UI Design", icon: "color-palette-outline" },
  { label: "Mobile Dev", icon: "apps-outline" },
];

export default function Explore() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "posts" | "users">("all");

  useEffect(() => {
    if (search.trim().length < 3) return;

    const timer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, filter]);

  async function handleSearch(query?: string) {
    const term = query ?? search;
    if (!term.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await api.get("/posts");
      const data = response.data;

      const filtered = data.filter((post: any) => {
        const contentMatch = post.content
          ?.toLowerCase()
          .includes(term.toLowerCase());

        const userMatch = post.user?.name
          ?.toLowerCase()
          .includes(term.toLowerCase());

        if (filter === "posts") return contentMatch;
        if (filter === "users") return userMatch;

        return contentMatch || userMatch;
      });

      setResults(filtered);
    } catch (error) {
      console.error("Erro ao buscar:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleTopicPress(topic: string) {
    setSelectedTopic(topic);
    setSearch(topic);
    handleSearch(topic);
  }

  function handleClear() {
    setSearch("");
    setResults([]);
    setSearched(false);
    setSelectedTopic(null);
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

  function getInitials(name?: string) {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explorar</Text>

      {/* BUSCA */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#7C8BA1" />

        <TextInput
          placeholder="Buscar posts ou devs..."
          placeholderTextColor="#7C8BA1"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
        />

        {search.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="close-circle" size={20} color="#7C8BA1" />
          </TouchableOpacity>
        )}
      </View>

      {/* FILTROS */}
      <View style={styles.filterContainer}>
        {["all", "posts", "users"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f && styles.filterActive,
            ]}
            onPress={() => setFilter(f as any)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f === "all" ? "Todos" : f === "posts" ? "Posts" : "Usuários"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TOPIC */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingBottom: 4 }}
        style={{ flexGrow: 0, marginBottom: 16 }}
      >
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.label}
            style={[
              styles.tag,
              selectedTopic === topic.label && styles.tagActive,
            ]}
            onPress={() => handleTopicPress(topic.label)}
          >
            <Ionicons
              name={topic.icon as any}
              size={16}
              color={selectedTopic === topic.label ? "#fff" : "#3B82F6"}
            />
            <Text
              style={[
                styles.tagText,
                selectedTopic === topic.label && styles.tagTextActive,
              ]}
            >
              {topic.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* CONTEÚDO */}
      {!searched ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔥 Tecnologia em Alta</Text>
          <Text style={styles.cardText}>
            React Native continua em alta na comunidade dev.
          </Text>
        </View>
      ) : loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListHeaderComponent={
            <Text style={styles.resultsCount}>
              {results.length} resultado{results.length !== 1 ? "s" : ""} para &quot;{search}&quot;
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={40} color="#3B82F6" />
              <Text style={styles.emptyText}>Nenhum resultado encontrado</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.resultCard}>
              <TouchableOpacity
                style={styles.userRow}
                onPress={() => {
                  if (!item.user?.id) return;
                  router.push(`/user/${item.user.id}`);
                }}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {getInitials(item.user?.name)}
                  </Text>
                </View>

                <View>
                  <Text style={styles.userName}>
                    {item.user?.name ?? "Usuário"}
                  </Text>
                  <Text style={styles.time}>{formatDate(item.createdAt)}</Text>
                </View>
              </TouchableOpacity>

              <Text style={styles.resultText}>{item.content}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05152C",
    paddingTop: 55,
    paddingHorizontal: 16,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0C1B36",
    paddingHorizontal: 12,
    borderRadius: 14,
    height: 50,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: "#fff",
    marginLeft: 10,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#12284A",
  },
  filterActive: {
    backgroundColor: "#3B82F6",
  },
  filterText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12284A",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  tagActive: {
    backgroundColor: "#3B82F6",
  },
  tagText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  tagTextActive: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#0C1B36",
    padding: 20,
    borderRadius: 16,
    marginTop: 10,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    color: "#C7D2FE",
    marginTop: 10,
    lineHeight: 22,
  },
  resultsCount: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  resultCard: {
    backgroundColor: "#0C1B36",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  userName: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  time: {
    color: "#7C8BA1",
    fontSize: 12,
    marginTop: 2,
  },
  resultText: {
    color: "#E5E7EB",
    fontSize: 15,
    lineHeight: 22,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    color: "#7C8BA1",
    fontSize: 16,
  },
});