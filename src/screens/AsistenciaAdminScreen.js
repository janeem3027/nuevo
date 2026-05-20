import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../context/AuthContext";
import { apiUrl } from "../config/api";
import colors from "../constants/colors";

export default function AsistenciaAdminScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // 🔵 PEDIR PERMISOS
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  // 🔵 SOLO PRESIDENTE / SECRETARIO / JEFE
  if (user?.rol !== "presidente" && user?.rol !== "secretario" && user?.rol !== "jefe") {
    return (
      <View style={styles.deniedContainer}>
        <Ionicons name="lock-closed" size={80} color={colors.warning} />
        <Text style={styles.deniedTitle}>Acceso Denegado</Text>
        <Text style={styles.deniedText}>
          No tienes permiso para acceder al escáner. Solo disponible para administradores.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.backText}>Regresar a Inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🔵 ESCANEAR QR
  const handleBarcodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);

    try {
      // 🔵 LEER DATOS QR
      const docente = JSON.parse(data);

      // 🔵 HORA ACTUAL
      const horaActual = new Date();
      const hora = horaActual.toLocaleTimeString("es-MX", { hour12: false });

      // 🔵 ESTADO
      let estado = "Presente";
      const limite = new Date();
      limite.setHours(10);
      limite.setMinutes(15);
      limite.setSeconds(0);

      if (horaActual > limite) {
        estado = "Retardo";
      }

      // 🔵 API
      const response = await fetch(apiUrl("guardar_asistencia.php"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: docente.id,
          estado,
          hora,
        }),
      });

      const result = await response.json();
      console.log(result);

      // 🔵 ÉXITO
      if (result.success) {
        Alert.alert("Asistencia registrada", `${docente.nombre} - ${estado}`);
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "QR inválido o error del servidor");
    }
  };

  // 🔵 SIN PERMISOS
  if (!permission?.granted) {
    return (
      <View style={styles.deniedContainer}>
        <Ionicons name="camera-outline" size={80} color={colors.gray} />
        <Text style={styles.deniedTitle}>Permiso Requerido</Text>
        <Text style={styles.deniedText}>
          Se necesita permiso para usar la cámara para escanear los códigos QR.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.backText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔵 HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackButton}>
            <Ionicons name="chevron-back" size={28} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Escanear Asistencia</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.subtitle}>Escanea el QR del docente</Text>
      </View>

      <View style={styles.content}>
        {/* 🔵 CÁMARA */}
        <View style={styles.cameraWrapper}>
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />
            {/* Overlay Grid */}
            <View style={styles.overlayGrid}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>
        </View>

        {/* 🔵 INFO OR SCAN AGAIN */}
        {scanned ? (
          <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
            <Ionicons name="scan-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Escanear otro QR</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={24} color={colors.secondary} style={{ marginRight: 8 }} />
            <Text style={styles.infoText}>Enfoca el código QR en el centro del recuadro para registrar la asistencia.</Text>
          </View>
        )}
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
  cameraWrapper: {
    width: "100%",
    aspectRatio: 3 / 4,
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#000",
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  overlayGrid: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: colors.success,
  },
  topLeft: {
    top: 40,
    left: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: 40,
    right: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: 40,
    left: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: 40,
    right: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "rgba(59, 130, 246, 0.08)", // Light primary
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    width: "100%",
  },
  infoText: {
    flex: 1,
    color: colors.primary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  scanAgainButton: {
    flexDirection: "row",
    backgroundColor: colors.success,
    paddingVertical: 16,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  // 🔵 ACCESO DENEGADO Y PERMISOS
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
  permissionButton: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
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