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
  View
} from "react-native";
import colors from "../constants/colors";

export default function ConfirmTokenScreen({ route, navigation }) {
  const { token } = route.params; // Obtener el token pasado desde la pantalla anterior
  const [enteredToken, setEnteredToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    if (!enteredToken.trim()) {
      Alert.alert("Error", "Ingresa el token recibido");
      return;
    }

    if (enteredToken !== token) {
      Alert.alert("Error", "Token inválido");
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Ingresa una nueva contraseña y confírmala");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    // Simulación de cambio de contraseña
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Éxito", "Tu contraseña ha sido cambiada");
      navigation.navigate("Login"); // Volver a la pantalla de login
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Token</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.iconWrapper}>
          <Ionicons name="shield-checkmark-outline" size={60} color={colors.white} />
        </View>
        <Text style={styles.title}>Verificación</Text>
        <Text style={styles.subtitle}>
          Ingresa el código que te enviamos al correo y establece tu nueva contraseña.
        </Text>

        <View style={styles.formCard}>
          {/* TOKEN INPUT */}
          <View style={styles.inputContainer}>
            <Ionicons name="keypad-outline" size={20} color={colors.gray} style={styles.inputIcon} />
            <TextInput
              placeholder="Ingresa el token (6 dígitos)"
              placeholderTextColor={colors.gray}
              style={styles.input}
              value={enteredToken}
              onChangeText={setEnteredToken}
              keyboardType="number-pad"
            />
          </View>

          {/* NEW PASSWORD */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.gray} style={styles.inputIcon} />
            <TextInput
              placeholder="Nueva contraseña"
              placeholderTextColor={colors.gray}
              secureTextEntry={!showPassword}
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={colors.gray} />
            </TouchableOpacity>
          </View>

          {/* CONFIRM PASSWORD */}
          <View style={styles.inputContainer}>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.gray} style={styles.inputIcon} />
            <TextInput
              placeholder="Confirmar contraseña"
              placeholderTextColor={colors.gray}
              secureTextEntry={!showPassword}
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleConfirm}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Confirmando..." : "Restablecer Contraseña"}
            </Text>
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
    paddingHorizontal: 24,
    alignItems: "center",
  },
  iconWrapper: {
    width: 100,
    height: 100,
    backgroundColor: colors.secondary, // Secondary color for variation
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 20,
    elevation: 6,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textDark,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: colors.gray,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  formCard: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
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
    paddingVertical: 16,
    fontSize: 16,
    color: colors.textDark,
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