import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiUrl } from "../config/api";
import colors from "../constants/colors";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [apellidoP, setApellidoP] = useState("");
  const [apellidoM, setApellidoM] = useState("");
  const [correo, setCorreo] = useState("");
  const [matricula, setMatricula] = useState("");
  const [sexo, setSexo] = useState("");
  const [rol, setRol] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const registerUser = async () => {
    if (
      !nombre ||
      !apellidoP ||
      !apellidoM ||
      !correo ||
      !matricula ||
      !sexo ||
      !rol ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("nombre", nombre);
      formData.append("apellido_p", apellidoP);
      formData.append("apellido_m", apellidoM);
      formData.append("correo", correo);
      formData.append("matricula", matricula);
      formData.append("sexo", sexo);
      formData.append("rol", rol);
      formData.append("password", password);

      const response = await fetch(apiUrl("registro.php"), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const text = await response.text();

      if (!text) {
        throw new Error("El servidor no devolvió respuesta");
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log("Respuesta del servidor:", text);
        throw new Error("Respuesta inválida del servidor (no JSON)");
      }

      if (data.success) {
        Alert.alert("Éxito", "Usuario registrado correctamente");
        navigation.goBack();
      } else {
        Alert.alert("Error", data.message || "No se pudo registrar");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Cuenta</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          {/* Nombre */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={colors.gray} style={styles.inputIcon} />
            <TextInput placeholder="Nombre" placeholderTextColor={colors.gray} style={styles.input} value={nombre} onChangeText={setNombre} />
          </View>

          {/* Apellidos */}
          <View style={styles.rowInputs}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <TextInput placeholder="A. Paterno" placeholderTextColor={colors.gray} style={styles.input} value={apellidoP} onChangeText={setApellidoP} />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <TextInput placeholder="A. Materno" placeholderTextColor={colors.gray} style={styles.input} value={apellidoM} onChangeText={setApellidoM} />
            </View>
          </View>

          {/* Correo */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.gray} style={styles.inputIcon} />
            <TextInput placeholder="Correo electrónico" placeholderTextColor={colors.gray} style={styles.input} value={correo} onChangeText={setCorreo} autoCapitalize="none" keyboardType="email-address" />
          </View>

          {/* Matrícula */}
          <View style={styles.inputContainer}>
            <Ionicons name="card-outline" size={20} color={colors.gray} style={styles.inputIcon} />
            <TextInput placeholder="Matrícula" placeholderTextColor={colors.gray} style={styles.input} value={matricula} onChangeText={setMatricula} />
          </View>

          {/* Sexo */}
          <Text style={styles.label}>Sexo</Text>
          <View style={styles.chipRow}>
            {["M", "F"].map((s) => (
              <TouchableOpacity key={s} style={[styles.chip, sexo === s && styles.chipSelected]} onPress={() => setSexo(s)}>
                <Text style={sexo === s ? styles.chipTextSelected : styles.chipText}>{s === "M" ? "Masculino" : "Femenino"}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Rol */}
          <Text style={styles.label}>Rol</Text>
          <View style={styles.chipRow}>
            {["presidente", "secretario", "docente", "jefe_carrera"].map((r) => (
              <TouchableOpacity key={r} style={[styles.chip, rol === r && styles.chipSelected]} onPress={() => setRol(r)}>
                <Text style={rol === r ? styles.chipTextSelected : styles.chipText}>
                  {r === "jefe_carrera" ? "Jefe de Carrera" : r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.gray} style={styles.inputIcon} />
            <TextInput placeholder="Contraseña" placeholderTextColor={colors.gray} secureTextEntry={!showPassword} style={styles.input} value={password} onChangeText={setPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={colors.gray} />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.gray} style={styles.inputIcon} />
            <TextInput placeholder="Confirmar contraseña" placeholderTextColor={colors.gray} secureTextEntry={!showPassword} style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} />
          </View>

          {/* Botón */}
          <TouchableOpacity style={styles.button} onPress={registerUser}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.light,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.light,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light,
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textDark,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.textDark,
    marginBottom: 12,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  chip: {
    backgroundColor: colors.light,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  chipSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  chipText: {
    color: colors.gray,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: colors.white,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});