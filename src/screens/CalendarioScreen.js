import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { apiUrl } from "../config/api";
import { AuthContext } from "../context/AuthContext";
import colors from "../constants/colors";

export default function CalendarioScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const esAdmin =
    user?.rol === "presidente" || user?.rol === "secretario" || user?.rol === "jefe";

  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [lugar, setLugar] = useState("");
  const [sesiones, setSesiones] = useState([]);

  useEffect(() => {
    obtenerSesiones();
  }, []);

  const agregarSesion = async () => {
    if (!titulo || !fecha || !hora || !lugar) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch(apiUrl("guardar_sesion.php"), {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:
          `titulo=${encodeURIComponent(titulo)}` +
          `&fecha=${encodeURIComponent(fecha)}` +
          `&hora=${encodeURIComponent(hora)}` +
          `&lugar=${encodeURIComponent(lugar)}`,
      });

      const data = await response.json();

      if (data.success) {
        await obtenerSesiones();
        setTitulo("");
        setFecha("");
        setHora("");
        setLugar("");
        setModalVisible(false);
        Alert.alert("Éxito", "Sesión guardada correctamente");
      } else {
        Alert.alert("Error", data.message || "No se pudo guardar");
      }
    } catch (error) {
      console.log("ERROR:", error);
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  const obtenerSesiones = async () => {
    try {
      const res = await fetch(apiUrl("calendario.php"));
      const data = await res.json();
      if (Array.isArray(data)) {
        setSesiones(data);
      } else {
        setSesiones([]);
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  const cambiarEstado = (id) => {
    const nuevasSesiones = sesiones.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          estado: item.estado === "pendiente" ? "completada" : "pendiente",
        };
      }
      return item;
    });
    setSesiones(nuevasSesiones);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calendario</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.subtitle}>Programación de sesiones académicas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {sesiones.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.sessionTitle}>{item.titulo}</Text>
                <View style={[styles.statusBadge, item.estado === "pendiente" ? styles.badgePending : styles.badgeCompleted]}>
                  <Text style={item.estado === "pendiente" ? styles.statusTextPending : styles.statusTextCompleted}>
                    {item.estado.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.codigo}>Código: {item.codigo}</Text>

              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color={colors.gray} style={styles.infoIcon} />
                <Text style={styles.info}>{item.fecha}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color={colors.gray} style={styles.infoIcon} />
                <Text style={styles.info}>{item.hora}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color={colors.gray} style={styles.infoIcon} />
                <Text style={styles.info}>{item.lugar}</Text>
              </View>

              {esAdmin && (
                <TouchableOpacity
                  style={[styles.actionButton, item.estado === "pendiente" ? styles.btnComplete : styles.btnPending]}
                  onPress={() => cambiarEstado(item.id)}
                >
                  <Text style={styles.actionButtonText}>
                    {item.estado === "pendiente" ? "Marcar Completada" : "Marcar Pendiente"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {esAdmin && (
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={32} color={colors.white} />
        </TouchableOpacity>
      )}

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Programar Sesión</Text>

            <TextInput placeholder="Título" placeholderTextColor={colors.gray} style={styles.input} value={titulo} onChangeText={setTitulo} />
            <TextInput placeholder="Fecha (DD/MM/AAAA)" placeholderTextColor={colors.gray} style={styles.input} value={fecha} onChangeText={setFecha} />
            <TextInput placeholder="Hora (HH:MM)" placeholderTextColor={colors.gray} style={styles.input} value={hora} onChangeText={setHora} />
            <TextInput placeholder="Lugar" placeholderTextColor={colors.gray} style={styles.input} value={lugar} onChangeText={setLugar} />

            <TouchableOpacity style={styles.btnGuardar} onPress={agregarSesion}>
              <Text style={styles.btnGuardarText}>Guardar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}>
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  backButton: {
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
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100, // Espacio para el FAB
  },
  section: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textDark,
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePending: {
    backgroundColor: "rgba(245, 158, 11, 0.15)", // Warning light
  },
  badgeCompleted: {
    backgroundColor: "rgba(16, 185, 129, 0.15)", // Success light
  },
  statusTextPending: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: "bold",
  },
  statusTextCompleted: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "bold",
  },
  codigo: {
    color: colors.secondary,
    fontWeight: "600",
    marginBottom: 16,
    fontSize: 13,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
    width: 20,
  },
  info: {
    fontSize: 14,
    color: colors.textDark,
  },
  actionButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnComplete: {
    backgroundColor: colors.success,
  },
  btnPending: {
    backgroundColor: colors.warning,
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 30,
    backgroundColor: colors.secondary,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.6)", // Fondo oscuro semitransparente
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textDark,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.light,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.grayLight,
    fontSize: 15,
    color: colors.textDark,
  },
  btnGuardar: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
    alignItems: "center",
  },
  btnGuardarText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  btnCancelar: {
    padding: 16,
    marginTop: 8,
    alignItems: "center",
  },
  btnCancelarText: {
    color: colors.gray,
    fontWeight: "600",
    fontSize: 15,
  },
});