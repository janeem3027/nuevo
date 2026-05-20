import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../context/AuthContext";
import colors from "../constants/colors";

export default function PaseListaScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [qrValue, setQrValue] = useState("");

  // 🔵 SOLO DOCENTES
  if (user?.rol !== "docente") {
    return (
      <View style={styles.deniedContainer}>
        <Ionicons name="lock-closed" size={80} color={colors.warning} />
        <Text style={styles.deniedTitle}>Acceso Denegado</Text>
        <Text style={styles.deniedText}>
          No tienes permiso para acceder a esta pantalla. Solo disponible para docentes.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.backText}>Regresar a Inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🔵 GENERAR QR
  useEffect(() => {
    const datosQR = {
      id: user?.id,
      nombre: user?.nombre,
      correo: user?.correo,
      rol: user?.rol,
    };
    setQrValue(JSON.stringify(datosQR));
  }, []);

  return (
    <View style={styles.container}>
      {/* 🔵 HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackButton}>
            <Ionicons name="chevron-back" size={28} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pase de Lista</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.subtitle}>Muestra este código QR</Text>
      </View>

      <View style={styles.content}>
        {/* 🔵 TARJETA */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={28} color={colors.primary} />
            </View>
            <Text style={styles.name}>{user?.nombre}</Text>
            <Text style={styles.role}>Docente</Text>
          </View>

          {/* 🔵 QR */}
          <View style={styles.qrWrapper}>
            <View style={styles.qrContainer}>
              {qrValue !== "" ? (
                <QRCode value={qrValue} size={200} color={colors.textDark} backgroundColor={colors.white} />
              ) : (
                <View style={{ width: 200, height: 200, backgroundColor: colors.grayLight }} />
              )}
            </View>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={colors.secondary} style={{ marginRight: 8 }} />
            <Text style={styles.info}>
              El administrador deberá escanear este QR para registrar tu asistencia.
            </Text>
          </View>
        </View>

        {/* 🔵 BOTONES */}
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("MisAsistencias")}>
          <Ionicons name="time-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Ver mis asistencias</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.homeText}>Regresar al Inicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBackButton: {
    padding: 8,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: colors.border,
    marginTop: 12,
    fontSize: 15,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: colors.white,
    marginTop: 10,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(59, 130, 246, 0.1)", // Light primary
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textDark,
    textAlign: "center",
  },
  role: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 4,
    fontWeight: "500",
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: colors.light,
    borderRadius: 24,
    marginBottom: 24,
  },
  qrContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "rgba(59, 130, 246, 0.08)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  info: {
    flex: 1,
    color: colors.primary,
    lineHeight: 20,
    fontSize: 13,
    fontWeight: "500",
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    marginTop: 30,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  homeButton: {
    marginTop: 20,
    padding: 10,
  },
  homeText: {
    color: colors.gray,
    fontSize: 15,
    fontWeight: "600",
  },
  // 🔵 ACCESO DENEGADO
  deniedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: colors.light,
  },
  deniedTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textDark,
    marginTop: 20,
    marginBottom: 10,
  },
  deniedText: {
    fontSize: 15,
    textAlign: "center",
    color: colors.gray,
    marginBottom: 30,
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
  },
  backText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});