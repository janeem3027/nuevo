import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { apiUrl } from "../config/api";
import colors from "../constants/colors";

export default function ReportesScreen({ navigation }) {
  const [reportes, setReportes] = useState([]);

  const obtenerReportes = async () => {
    try {
      const response = await fetch(apiUrl("reportes.php"));
      const data = await response.json();
      setReportes(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudieron cargar los reportes");
    }
  };

  useEffect(() => {
    obtenerReportes();
  }, []);

  const abrirDocumento = (url) => {
    if (!url) {
      Alert.alert("Error", "Documento no disponible");
      return;
    }
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reportes</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.subtitle}>Documentos generados del sistema</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {reportes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color={colors.grayLight} />
              <Text style={styles.emptyText}>No hay reportes disponibles</Text>
            </View>
          ) : (
            reportes.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.titleRow}>
                    <Ionicons name="document-text" size={22} color={colors.primary} style={{ marginRight: 8 }} />
                    <Text style={styles.docTitle} numberOfLines={2}>
                      {item.titulo}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, item.estado === "nuevo" ? styles.badgeNew : styles.badgeViewed]}>
                    <Text style={item.estado === "nuevo" ? styles.statusTextNew : styles.statusTextViewed}>
                      {item.estado.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.gray} style={styles.infoIcon} />
                  <Text style={styles.info}>{item.fecha}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="folder-open-outline" size={16} color={colors.gray} style={styles.infoIcon} />
                  <Text style={styles.info}>{item.tipo}</Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={() => abrirDocumento(item.url)}>
                  <Text style={styles.buttonText}>Abrir documento</Text>
                  <Ionicons name="open-outline" size={18} color={colors.white} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    marginRight: 10,
  },
  docTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textDark,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeNew: {
    backgroundColor: "rgba(220, 38, 38, 0.15)", // Red light
  },
  badgeViewed: {
    backgroundColor: "rgba(16, 185, 129, 0.15)", // Green light
  },
  statusTextNew: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "bold",
  },
  statusTextViewed: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "bold",
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
  button: {
    flexDirection: "row",
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 15,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.gray,
    fontWeight: "500",
  },
});