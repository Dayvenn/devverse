import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

const topics = [
  "React Native",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "UI Design",
  "Mobile Dev",
];

export default function Explore() {
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <Text style={styles.title}>
        Explorar
      </Text>

      {/* SEARCH */}
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
        />
      </View>

      {/* TOPICS */}
      <Text style={styles.sectionTitle}>
        Tecnologias
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 10,
        }}
      >
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic}
            style={styles.tag}
          >
            <Text style={styles.tagText}>
              {topic}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* TREND CARD */}
      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          🚀 Tendência
        </Text>

        <Text style={styles.cardText}>
          React Native continua crescendo como uma das
          tecnologias mobile mais usadas do mercado.
        </Text>

      </View>

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

    marginBottom: 24,
  },

  input: {
    flex: 1,
    color: "#fff",
    marginLeft: 10,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },

  tag: {
    backgroundColor: "#12284A",

    paddingHorizontal: 18,
    paddingVertical: 10,

    borderRadius: 14,

    marginRight: 10,
  },

  tagText: {
    color: "#3B82F6",
    fontWeight: "600",
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
});