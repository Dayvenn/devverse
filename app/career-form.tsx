import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./services/api";



export default function CareerForm() {

  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"form" | "view">("form");

  const [status, setStatus] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [emprego, setEmprego] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [avaliacao, setAvaliacao] = useState("");
  const [pretensao, setPretensao] = useState("");

  useEffect(() => {
    loadCareer();
  }, []);

  async function loadCareer() {
  try {
    const userData = await AsyncStorage.getItem("user");

    if (!userData) return;

    const user = JSON.parse(userData);

    const response = await api.get(`/career/${user.id}`);

    const data = response.data;

    if (data) {
      setStatus(data.status || "");
      setModalidade(data.modalidade || "");
      setEmprego(data.emprego || "");
      setExperiencia(data.experiencia || "");
      setAvaliacao(data.avaliacao || "");
      setPretensao(data.pretensao || "");

      setMode("view");
    }
  } catch {
    console.log("Erro ao carregar currículo");
  }
}

 async function saveForm() {
  try {
    const userData = await AsyncStorage.getItem("user");

    if (!userData) {
      alert("Usuário não encontrado");
      return;
    }

    const user = JSON.parse(userData);

    await api.post("/career", {
      userId: user.id,
      status,
      modalidade,
      emprego,
      experiencia,
      avaliacao,
      pretensao,
    });

    alert("Currículo salvo ");
    setMode("view");

  } catch (error: any) {
    if (error.response) {
      alert(error.response.data.error);
    } else {
      alert("Erro no servidor");
    }
  }
}

  // VIEW
  if (mode === "view") {
    return (
      <View style={styles.container}>

        <Text style={styles.title}>
          Meu Currículo
        </Text>

        <View style={styles.profileCard}>

          <Text style={styles.viewText}>
            Status: {status}
          </Text>

          <Text style={styles.viewText}>
            Modalidade: {modalidade}
          </Text>

          <Text style={styles.viewText}>
            Emprego: {emprego}
          </Text>

          <Text style={styles.viewText}>
            Experiência: {experiencia}
          </Text>

          <Text style={styles.viewText}>
            Pretensão: {pretensao}
          </Text>

          <Text style={styles.viewText}>
            Avaliação: {avaliacao}
          </Text>

        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setMode("form")}
        >
          <Text style={styles.buttonText}>
            Editar currículo
          </Text>
        </TouchableOpacity>

      </View>
    );
  }

  // FORM
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Carreira
      </Text>

      <Text style={styles.step}>
        Etapa {step} de 2
      </Text>

      {step === 1 && (
        <View>

          <View style={styles.pickerBox}>
            <Picker
              selectedValue={status}
              onValueChange={setStatus}
            >
              <Picker.Item label="Status civil" value="" />
              <Picker.Item label="Solteiro" value="Solteiro" />
              <Picker.Item label="Casado" value="Casado" />
            </Picker>
          </View>

          <View style={styles.pickerBox}>
            <Picker
              selectedValue={modalidade}
              onValueChange={setModalidade}
            >
              <Picker.Item label="Modalidade" value="" />
              <Picker.Item label="Remoto" value="Remoto" />
              <Picker.Item label="Presencial" value="Presencial" />
              <Picker.Item label="Híbrido" value="Híbrido" />
            </Picker>
          </View>

          <View style={styles.pickerBox}>
            <Picker
              selectedValue={emprego}
              onValueChange={setEmprego}
            >
              <Picker.Item label="Emprego" value="" />
              <Picker.Item label="CLT" value="CLT" />
              <Picker.Item label="PJ" value="PJ" />
            </Picker>
          </View>

          <View style={styles.pickerBox}>
            <Picker
              selectedValue={experiencia}
              onValueChange={setExperiencia}
            >
              <Picker.Item label="Experiência" value="" />
              <Picker.Item label="Júnior" value="Júnior" />
              <Picker.Item label="Pleno" value="Pleno" />
              <Picker.Item label="Sênior" value="Sênior" />
            </Picker>
          </View>

          <View style={styles.pickerBox}>
            <Picker
              selectedValue={pretensao}
              onValueChange={setPretensao}
            >
              <Picker.Item label="Pretensão" value="" />
              <Picker.Item label="Até 2k" value="Até 2k" />
              <Picker.Item label="2k-5k" value="2k-5k" />
              <Picker.Item label="5k+" value="5k+" />
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setStep(2)}
          >
            <Text style={styles.buttonText}>
              Continuar
            </Text>
          </TouchableOpacity>

        </View>
      )}

      {step === 2 && (
        <View>

          {["Excelente", "Bom", "Regular", "Ruim"].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setAvaliacao(item)}
            >
              <Text style={styles.option}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.button}
            onPress={saveForm}
          >
            <Text style={styles.buttonText}>
              Finalizar
            </Text>
          </TouchableOpacity>

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1B3A",
    padding: 18,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  step: {
    color: "#93C5FD",
    marginBottom: 15,
  },

  pickerBox: {
    backgroundColor: "#12264D",
    borderRadius: 12,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  option: {
    color: "#fff",
    padding: 14,
    fontSize: 16,
    backgroundColor: "#12264D",
    marginBottom: 10,
    borderRadius: 12,
    textAlign: "center",
  },

  profileCard: {
    backgroundColor: "#12264D",
    borderRadius: 18,
    padding: 20,
    marginTop: 10,
  },

  viewText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#1A3566",
    padding: 12,
    borderRadius: 10,
  },
});