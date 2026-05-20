import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const data = await AsyncStorage.getItem("user");

      if (data) {
        setUser(JSON.parse(data));
      }
    }

    loadUser();
  }, []);

  
  function getInitials(name?: string) {
    if (!name) return "U";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  return (
    <View style={styles.container}>

   
      <Text style={styles.title}>Perfil</Text>

    
      <View style={styles.card}>

        
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(user?.name)}
          </Text>
        </View>

        <Text style={styles.name}>
          {user?.name || "Sem nome"}
        </Text>

        <Text style={styles.email}>
          {user?.email || "sememail@email.com"}
        </Text>
      </View>

     
      <View style={styles.infoBox}>
        <Text style={styles.info}> Desenvolvedor</Text>
        <Text style={styles.info}>Membro DevVerse</Text>
      </View>

      
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/career-form")}
      >
        <Text style={styles.buttonText}>Carreira</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05152C",
    padding: 15,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#0f1f3d",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },

  
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  email: {
    color: "#aaa",
    marginTop: 5,
  },

  infoBox: {
    marginTop: 20,
  },

  info: {
    color: "#fff",
    marginBottom: 8,
  },

  button: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});