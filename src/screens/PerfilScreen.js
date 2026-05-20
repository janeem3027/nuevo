import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

import colors from "../constants/colors";
import { AuthContext } from "../context/AuthContext";

export default function PerfilScreen({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    cargarFoto();
  }, []);

  const cargarFoto = async () => {
    try {
      const fotoGuardada = await AsyncStorage.getItem("fotoPerfil");
      if (fotoGuardada) {
        setFoto(fotoGuardada);
      } else {
        setFoto("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"); // Default avatar from home
      }
    } catch (error) {
      console.log(error);
      setFoto("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40");
    }
  };

  const cambiarFoto = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert("Permiso requerido", "Debes permitir acceso a fotos");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled) {
      const uri = resultado.assets[0].uri;
      setFoto(uri);
      await AsyncStorage.setItem("fotoPerfil", uri);
    }
  };

  const cerrarSesion = async () => {
    Alert.alert("Cerrar sesión", "¿Deseas salir del sistema?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("fotoPerfil");
            setUser(null);
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo cerrar sesión");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 🔵 HEADER CUSTOMIZADO */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={cambiarFoto} style={styles.avatarWrapper}>
            <Image
              source={{ uri: foto || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40" }}
              style={styles.avatar}
            />
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={16} color={colors.white} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 🔵 INFO PRINCIPAL (Nombre/Rol) */}
        <View style={styles.mainInfoCard}>
          <Text style={styles.name}>{user?.nombre || "Usuario"}</Text>
          <View style={styles.roleBadge}>
            <Ionicons name="shield-checkmark" size={14} color={colors.secondary} />
            <Text style={styles.role}>{user?.rol || "Invitado"}</Text>
          </View>
        </View>

        {/* 🔵 DATOS DE CONTACTO */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Información Institucional</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="mail" size={20} color={colors.secondary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Correo Electrónico</Text>
              <Text style={styles.infoValue}>{user?.correo || "No registrado"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="card" size={20} color={colors.secondary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Matrícula</Text>
              <Text style={styles.infoValue}>{user?.matricula || "Sin matrícula"}</Text>
            </View>
          </View>
        </View>

        {/* 🔵 BOTÓN CERRAR SESIÓN */}
        <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
          <Ionicons name="log-out-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
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
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.white,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 4,
    backgroundColor: colors.secondary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  mainInfoCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginTop: -40,
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textDark,
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.1)", // Light secondary
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  role: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: "700",
    textTransform: "uppercase",
    marginLeft: 6,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.textDark,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(59, 130, 246, 0.1)", // Light secondary
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayLight,
    marginVertical: 16,
    marginLeft: 60,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoutText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});