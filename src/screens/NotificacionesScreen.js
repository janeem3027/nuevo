import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "../constants/colors";

export default function NotificacionesScreen({ visible, onClose }) {
  const [notificaciones, setNotificaciones] = useState([
    {
      id: "1",
      titulo: "Nueva actividad asignada",
      descripcion: "Se agregó una nueva actividad en el plan de trabajo.",
      hora: "9:25 a.m.",
      fecha: "11 mayo",
      leida: false,
    },
    {
      id: "2",
      titulo: "Minuta compartida",
      descripcion: "La minuta de la reunión fue subida correctamente.",
      hora: "8:10 a.m.",
      fecha: "11 mayo",
      leida: false,
    },
    {
      id: "3",
      titulo: "Nuevo reporte disponible",
      descripcion: "Los reportes mensuales ya están listos.",
      hora: "Ayer",
      fecha: "",
      leida: true,
    },
  ]);

  const marcarTodasLeidas = () => {
    const nuevas = notificaciones.map((item) => ({ ...item, leida: true }));
    setNotificaciones(nuevas);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Notificaciones</Text>
            <TouchableOpacity onPress={marcarTodasLeidas}>
              <Text style={styles.readAll}>Marcar leídas</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={notificaciones}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={0.8} style={styles.notificationCard}>
                <View style={[styles.iconContainer, !item.leida && styles.iconContainerUnread]}>
                  <Ionicons
                    name="notifications"
                    size={22}
                    color={item.leida ? colors.gray : colors.primary}
                  />
                </View>

                <View style={styles.info}>
                  <Text style={[styles.messageTitle, !item.leida && styles.messageTitleUnread]}>
                    {item.titulo}
                  </Text>
                  <Text style={styles.messageDesc} numberOfLines={2}>
                    {item.descripcion}
                  </Text>

                  <View style={styles.timeRow}>
                    <Ionicons name="time-outline" size={14} color={colors.gray} />
                    <Text style={styles.time}>
                      {item.hora} {item.fecha ? `• ${item.fecha}` : ""}
                    </Text>
                  </View>
                </View>

                {!item.leida && <View style={styles.dot} />}
              </TouchableOpacity>
            )}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)", // Dark overlay
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: "85%",
    backgroundColor: colors.light,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textDark,
  },
  readAll: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 12,
    borderRadius: 20,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.light,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconContainerUnread: {
    backgroundColor: "rgba(59, 130, 246, 0.15)", // Light primary
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  messageTitle: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: "600",
    marginBottom: 4,
  },
  messageTitleUnread: {
    fontWeight: "800",
  },
  messageDesc: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  time: {
    marginLeft: 6,
    color: colors.gray,
    fontSize: 13,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
  },
  closeButton: {
    backgroundColor: colors.textDark,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  closeText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});