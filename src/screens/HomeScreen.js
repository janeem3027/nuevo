import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useMemo, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../constants/colors";
import { AuthContext } from "../context/AuthContext";
import NotificacionesScreen from "./NotificacionesScreen";

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

  // ✅ Roles corregidos (consistentes con registro)
  const ADMIN_ROLES = ["presidente", "secretario", "jefe_carrera"];
  const esAdmin = ADMIN_ROLES.includes(user?.rol);

  const esDocente = user?.rol === "docente";

  const menus = useMemo(() => {
    if (esDocente) {
      return [
        {
          titulo: "Pase de Lista",
          icono: "checkmark-done",
          color: "#2563EB",
          screen: "PaseLista",
        },
        {
          titulo: "Calendario",
          icono: "calendar",
          color: "#7C3AED",
          screen: "Calendario",
        },
        {
          titulo: "Actividades",
          icono: "document-text",
          color: "#0F766E",
          screen: "PlanTrabajo",
        },
        {
          titulo: "Reportes",
          icono: "bar-chart",
          color: "#EA580C",
          screen: "Reportes",
        },
      ];
    }

    if (esAdmin) {
      return [
        {
          titulo: "Asistencia",
          icono: "people",
          color: "#2563EB",
          screen: "AsistenciaAdmin",
        },
        {
          titulo: "Minutas",
          icono: "document-text",
          color: "#0F766E",
          screen: "Minuta",
        },
        {
          titulo: "Actividades",
          icono: "document-text",
          color: "#7C3AED",
          screen: "PlanTrabajo",
        },
        {
          titulo: "Reportes",
          icono: "bar-chart",
          color: "#EA580C",
          screen: "Reportes",
        },
        {
          titulo: "Docentes",
          icono: "school",
          color: "#DC2626",
          screen: "Docentes",
        },
        {
          titulo: "Calendario",
          icono: "calendar",
          color: "#0891B2",
          screen: "Calendario",
        },
      ];
    }

    return [
      {
        titulo: "Calendario",
        icono: "calendar",
        color: "#2563EB",
        screen: "Calendario",
      },
    ];
  }, [user?.rol, esAdmin, esDocente]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.topHeader}>
            <View style={styles.userSection}>
              <Text style={styles.welcome}>Bienvenido(a)</Text>
              <Text style={styles.userName}>
                {user?.nombre || "Usuario"}
              </Text>

              <View style={styles.roleBadge}>
                <Ionicons name="shield-checkmark" size={14} color="#FFF" />
                <Text style={styles.roleText}>{user?.rol}</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => setMostrarNotificaciones(true)}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="#0B1F3A"
                />
                <View style={styles.notificationDot} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
                  }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* BANNER */}
          <View style={styles.banner}>
            <View style={styles.bannerLeft}>
              <Text style={styles.bannerTitle}>Sistema Académico</Text>
              <Text style={styles.bannerSubtitle}>
                Gestión de actividades y control institucional
              </Text>
            </View>

            <View style={styles.bannerIcon}>
              <Ionicons name="school" size={38} color="#FFF" />
            </View>
          </View>
        </View>

        {/* TITULO */}
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Módulos del sistema</Text>
          <Text style={styles.panelSubtitle}>Accesos rápidos</Text>
        </View>

        {/* CARDS */}
        <View style={styles.panel}>
          {menus.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: item.color },
                ]}
              >
                <Ionicons name={item.icono} size={32} color="#FFF" />
              </View>

              <Text style={styles.cardText}>{item.titulo}</Text>

              <View style={styles.cardArrow}>
                <Ionicons name="arrow-forward" size={18} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* NOTIFICACIONES */}
      <NotificacionesScreen
        visible={mostrarNotificaciones}
        onClose={() => setMostrarNotificaciones(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },

  container: {
    flexGrow: 1,
    backgroundColor: colors.light,
    paddingBottom: 40,
  },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 34,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userSection: { flex: 1 },

  welcome: { color: colors.border, fontSize: 14, letterSpacing: 0.5 },

  userName: { color: colors.white, fontSize: 26, fontWeight: "800", letterSpacing: 0.5 },

  roleBadge: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    alignSelf: "flex-start",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  roleText: {
    color: colors.white,
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },

  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.white,
  },

  banner: {
    marginTop: 28,
    backgroundColor: colors.secondary,
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  bannerLeft: { flex: 1, paddingRight: 16 },

  bannerTitle: { color: colors.white, fontSize: 22, fontWeight: "800", marginBottom: 4 },

  bannerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 18 },

  bannerIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  panelHeader: {
    paddingHorizontal: 22,
    marginTop: 32,
    marginBottom: 20,
  },

  panelTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textDark,
    marginBottom: 4,
  },

  panelSubtitle: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: "500",
  },

  panel: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  card: {
    width: "47%",
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  cardText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textDark,
  },

  cardArrow: {
    marginTop: 12,
    alignSelf: "flex-end",
    backgroundColor: colors.light,
    padding: 6,
    borderRadius: 12,
  },
});