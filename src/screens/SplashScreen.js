import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Login");
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="school" size={72} color={colors.white} />
        </View>
        <Text style={styles.title}>SISTEMA</Text>
        <Text style={styles.subtitle}>ACADÉMICO</Text>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={styles.footerText}>Preparando entorno...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 140,
    height: 140,
    backgroundColor: "rgba(59, 130, 246, 0.15)", // Un azul muy sutil translúcido
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  title: {
    color: colors.white,
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 6,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.accent,
    fontSize: 16,
    letterSpacing: 10,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    color: colors.gray,
    marginTop: 16,
    fontSize: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});