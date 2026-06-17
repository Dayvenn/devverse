import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { api } from "../../services/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [editModal, setEditModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editCargo, setEditCargo] = useState("");
  const [editStack, setEditStack] = useState("");
  const [editCidade, setEditCidade] = useState("");
  const [editGithub, setEditGithub] = useState("");

  const [photo, setPhoto] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [hasCareer, setHasCareer] = useState(0);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  async function loadStats(userId: string) {
    try {
      const [postsRes, careerRes] = await Promise.all([
        api.get(`/posts/user/${userId}`),
        api.get(`/career/${userId}`),
      ]);

      const posts = postsRes.data;

      const totalLikes = posts.reduce(
        (acc: number, post: any) => acc + (post.likes || 0),
        0
      );

      setPostCount(posts.length);
      setLikeCount(totalLikes);
      setHasCareer(careerRes.data ? 1 : 0);
    } catch {
      console.log("Erro ao carregar estatísticas");
    }
  }

  useFocusEffect(
    useCallback(() => {
      async function load() {
        const data = await AsyncStorage.getItem("user");
        if (!data) return;

        const parsed = JSON.parse(data);

        setUser(parsed);

        setEditName(parsed.name || "");
        setEditBio(parsed.bio || "");
        setEditCargo(parsed.cargo || "");
        setEditStack(parsed.stack || "");
        setEditCidade(parsed.cidade || "");
        setEditGithub(parsed.github || "");

        setPhoto(parsed.photo || null);

        await loadStats(parsed.id);
      }

      load();
    }, [])
  );

  function getInitials(name?: string) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permissão negada");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  async function handleSaveProfile() {
    if (!editName.trim()) {
      Alert.alert("Nome obrigatório");
      return;
    }

    setSaving(true);

    try {
      const updated = {
        ...user,
        name: editName,
        bio: editBio,
        cargo: editCargo,
        stack: editStack,
        cidade: editCidade,
        github: editGithub,
        photo,
      };

      await api.put(`/users/${user.id}`, updated);
      await AsyncStorage.setItem("user", JSON.stringify(updated));

      setUser(updated);
      setEditModal(false);

      Alert.alert("Sucesso");
    } catch {
      Alert.alert("Erro ao salvar!");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Preencha todos os campos!");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Senhas não coincidem");
      return;
    }

    setSavingPassword(true);

    try {
      const response = await fetch(
        `http://192.168.101.7:3000/users/${user.id}/password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Erro", data.error);
        return;
      }

      Alert.alert("Senha alterada!");
      setPasswordModal(false);
    } catch {
      Alert.alert("Erro servidor");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleLogout() {
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>

        <TouchableOpacity
          style={styles.gearBtn}
          onPress={() => setSettingsModal(true)}
        >
          <Ionicons name="settings-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* PERFIL */}
      <View style={styles.card}>
        <View style={styles.avatarWrapper}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(user?.name)}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditModal(true)}
        >
          <Text style={styles.editText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* ESTATÍSTICAS */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{postCount}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{likeCount}</Text>
          <Text style={styles.statLabel}>Curtidas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{hasCareer}</Text>
          <Text style={styles.statLabel}>Carreira</Text>
        </View>
      </View>

      {/* SOBRE */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Sobre</Text>

        <View style={styles.infoRow}>
          <Ionicons name="briefcase-outline" size={20} color="#3B82F6" />
          <Text style={styles.infoText}>{user?.cargo || "Cargo não informado"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="code-slash-outline" size={20} color="#3B82F6" />
          <Text style={styles.infoText}>{user?.stack || "Stack não informada"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color="#3B82F6" />
          <Text style={styles.infoText}>{user?.cidade || "Cidade não informada"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="logo-github" size={20} color="#3B82F6" />
          <Text style={styles.infoText}>{user?.github || "GitHub não informado"}</Text>
        </View>
      </View>

      {/* CARREIRA */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/career-form")}>
        <Ionicons name="briefcase-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Minha Carreira</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />

      {/* MODAL EDITAR PERFIL */}
      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Editar Perfil</Text>
                <TouchableOpacity onPress={() => setEditModal(false)}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalAvatarWrapper}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.modalAvatarImage} />
                ) : (
                  <View style={styles.modalAvatar}>
                    <Text style={styles.modalAvatarText}>{getInitials(editName)}</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.cameraBtn} onPress={handlePickImage}>
                  <Ionicons name="camera" size={14} color="#fff" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Nome</Text>
              <TextInput style={styles.input} value={editName} onChangeText={setEditName} placeholder="Seu nome" placeholderTextColor="#7C8BA1" />

              <Text style={styles.label}>Bio</Text>
              <TextInput style={[styles.input, styles.inputMultiline]} value={editBio} onChangeText={setEditBio} placeholder="Fale um pouco sobre você..." placeholderTextColor="#7C8BA1" multiline numberOfLines={3} />

              <Text style={styles.label}>Cargo</Text>
              <TextInput style={styles.input} value={editCargo} onChangeText={setEditCargo} placeholder="Ex: Frontend Developer" placeholderTextColor="#7C8BA1" />

              <Text style={styles.label}>Stack</Text>
              <TextInput style={styles.input} value={editStack} onChangeText={setEditStack} placeholder="Ex: React Native, Node.js" placeholderTextColor="#7C8BA1" />

              <Text style={styles.label}>Cidade</Text>
              <TextInput style={styles.input} value={editCidade} onChangeText={setEditCidade} placeholder="Ex: São Paulo, SP" placeholderTextColor="#7C8BA1" />

              <Text style={styles.label}>GitHub</Text>
              <TextInput style={styles.input} value={editGithub} onChangeText={setEditGithub} placeholder="Ex: github.com/seunome" placeholderTextColor="#7C8BA1" />

              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                <Text style={styles.saveBtnText}>{saving ? "Salvando..." : "Salvar"}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* MODAL CONFIGURAÇÕES */}
      <Modal visible={settingsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Configurações</Text>
              <TouchableOpacity onPress={() => setSettingsModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => {
                setSettingsModal(false);
                setTimeout(() => setPasswordModal(true), 300);
              }}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#3B82F6" />
              <Text style={styles.settingText}>Alterar senha</Text>
              <Ionicons name="chevron-forward" size={18} color="#3B82F6" style={{ marginLeft: "auto" }} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingRow, { marginTop: 10, borderTopWidth: 1, borderTopColor: "#1E2D4A" }]}
              onPress={() => {
                setSettingsModal(false);
                setTimeout(() => handleLogout(), 300);
              }}
            >
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={[styles.settingText, { color: "#EF4444" }]}>Sair da conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL ALTERAR SENHA */}
      <Modal visible={passwordModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Alterar Senha</Text>
              <TouchableOpacity onPress={() => setPasswordModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Senha atual</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Digite sua senha atual"
              placeholderTextColor="#7C8BA1"
              secureTextEntry
            />

            <Text style={styles.label}>Nova senha</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Digite a nova senha"
              placeholderTextColor="#7C8BA1"
              secureTextEntry
            />

            <Text style={styles.label}>Confirmar nova senha</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirme a nova senha"
              placeholderTextColor="#7C8BA1"
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.saveBtn, savingPassword && { opacity: 0.7 }]}
              onPress={handleChangePassword}
              disabled={savingPassword}
            >
              <Text style={styles.saveBtnText}>
                {savingPassword ? "Salvando..." : "Alterar Senha"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  gearBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0C1B36",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#0C1B36",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 18,
  },
  avatarWrapper: {
    position: "relative",
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
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2563EB",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0C1B36",
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
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#0C1B36",
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 4,
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
  button: {
    backgroundColor: "#3B82F6",
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalAvatarWrapper: {
    position: "relative",
    alignSelf: "center",
    marginBottom: 20,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  modalAvatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  modalAvatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  label: {
    color: "#9CA3AF",
    fontSize: 13,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#12284A",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 15,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  saveBtn: {
    backgroundColor: "#3B82F6",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  settingText: {
    color: "#fff",
    fontSize: 15,
  },
});