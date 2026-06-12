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

const API_URL = "http://192.168.101.7:3000";

const topics = [
  { label: "React Native", icon: "phone-portrait-outline" },
  { label: "JavaScript", icon: "logo-javascript" },
  { label: "TypeScript", icon: "code-slash-outline" },
  { label: "Node.js", icon: "server-outline" },
  { label: "UI Design", icon: "color-palette-outline" },
  { label: "Mobile Dev", icon: "apps-outline" },
];

export default function Explore() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const [filter, setFilter] = useState<
    "all" | "posts" | "users"
  >("all");

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
      const response = await fetch(`${API_URL}/posts`);
      const data = await response.json();

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explorar</Text>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#7C8BA1"
        />

        <TextInput
          placeholder="Buscar posts ou devs..."
          placeholderTextColor="#7C8BA1"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />

        {search.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons
              name="close-circle"
              size={20}
              color="#7C8BA1"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* FILTROS */}

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && styles.filterActive,
          ]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" &&
                styles.filterTextActive,
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "posts" && styles.filterActive,
          ]}
          onPress={() => setFilter("posts")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "posts" &&
                styles.filterTextActive,
            ]}
          >
            Posts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "users" && styles.filterActive,
          ]}
          onPress={() => setFilter("users")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "users" &&
                styles.filterTextActive,
            ]}
          >
            Usuários
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        Sugestão de pesquisa
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 10,
          gap: 10,
        }}
        style={{ flexGrow: 0 }}
      >
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.label}
            style={[
              styles.tag,
              selectedTopic === topic.label &&
                styles.tagActive,
            ]}
            onPress={() =>
              handleTopicPress(topic.label)
            }
          >
            <Ionicons
              name={topic.icon as any}
              size={16}
              color={
                selectedTopic === topic.label
                  ? "#fff"
                  : "#3B82F6"
              }
            />

            <Text
              style={[
                styles.tagText,
                selectedTopic === topic.label &&
                  styles.tagTextActive,
              ]}
            >
              {topic.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {!searched ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            🔥 Tecnologia em Alta
          </Text>

          <Text style={styles.cardText}>
            React Native continua entre as
            tecnologias mais pesquisadas pelos
            desenvolvedores da comunidade.
          </Text>

          <Text style={styles.trendingText}>
            📈 +27% de buscas esta semana
          </Text>
        </View>
      ) : loading ? (
        <ActivityIndicator
          size="large"
          color="#3B82F6"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          ListHeaderComponent={
            <View style={styles.resultHeader}>
              <Ionicons
                name="search"
                size={18}
                color="#3B82F6"
              />

              <Text style={styles.resultHeaderText}>
                {results.length} resultado
                {results.length !== 1 ? "s" : ""}
                {" "}encontrado
                {results.length !== 1 ? "s" : ""}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="search-outline"
                size={40}
                color="#3B82F6"
              />

              <Text
                style={{
                  color: "#7C8BA1",
                  fontSize: 16,
                }}
              >
                Nenhum resultado encontrado
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.resultCard}>
              <View style={styles.userRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.user?.name
                      ?.charAt(0)
                      .toUpperCase() ?? "?"}
                  </Text>
                </View>

                <View>
                  <Text style={styles.userName}>
                    {item.user?.name ??
                      "Usuário"}
                  </Text>

                  <Text style={styles.time}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>
              </View>

              <Text style={styles.resultText}>
                {item.content}
              </Text>
            </View>
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

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },

  searchContainer: {
    backgroundColor: "#0C1B36",
    height: 55,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
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
    marginBottom: 20,
  },

  filterButton: {
    backgroundColor: "#12284A",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
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

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },

  tag: {
    backgroundColor: "#12284A",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
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
    borderRadius: 18,
    padding: 20,
    marginTop: 30,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  cardText: {
    color: "#C7D2FE",
    lineHeight: 24,
    fontSize: 15,
  },

  trendingText: {
    color: "#60A5FA",
    marginTop: 15,
    fontWeight: "600",
  },

  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 15,
  },

  resultHeaderText: {
    color: "#fff",
    fontWeight: "700",
  },

  resultCard: {
    backgroundColor: "#0C1B36",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    elevation: 6,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  userName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  time: {
    color: "#7C8BA1",
    fontSize: 12,
    marginTop: 2,
  },

  resultText: {
    color: "#E5E7EB",
    fontSize: 15,
    lineHeight: 24,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    gap: 12,
  },
});