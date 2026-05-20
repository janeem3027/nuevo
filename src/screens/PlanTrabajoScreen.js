import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import colors from "../constants/colors";

export default function PlanTrabajoScreen({ navigation }) {
  const [docente, setDocente] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [departamento, setDepartamento] = useState("");

  const [evento, setEvento] = useState("");
  const [lugar, setLugar] = useState("");
  const [fechaEvento, setFechaEvento] = useState("");

  const [rol, setRol] = useState("");
  const [comision, setComision] = useState("");

  const [actividad1, setActividad1] = useState("");
  const [actividad2, setActividad2] = useState("");
  const [actividad3, setActividad3] = useState("");

  const [registro, setRegistro] = useState(false);
  const [logistica, setLogistica] = useState(false);
  const [material, setMaterial] = useState(false);
  const [evidencia, setEvidencia] = useState(false);

  const [observaciones, setObservaciones] = useState("");

  const generarPDF = async () => {
    try {
      const html = `
      <html>
      <body style="font-family: Arial; padding: 30px; color:#0F172A;">
      <h1>PLAN DE TRABAJO</h1>
      <h2>Información General</h2>
      <p><strong>Docente:</strong> ${docente}</p>
      <p><strong>Periodo:</strong> ${periodo}</p>
      <p><strong>Departamento:</strong> ${departamento}</p>
      <h2>Evento</h2>
      <p><strong>Evento:</strong> ${evento}</p>
      <p><strong>Lugar:</strong> ${lugar}</p>
      <p><strong>Fecha:</strong> ${fechaEvento}</p>
      <h2>Comisión</h2>
      <p><strong>Rol:</strong> ${rol}</p>
      <p><strong>Comisión:</strong> ${comision}</p>
      <h2>Actividades</h2>
      <ul>
        <li>${actividad1}</li>
        <li>${actividad2}</li>
        <li>${actividad3}</li>
      </ul>
      <h2>Checklist Operativo</h2>
      <p>${registro ? "☑" : "☐"} Registro realizado</p>
      <p>${logistica ? "☑" : "☐"} Logística completada</p>
      <p>${material ? "☑" : "☐"} Material preparado</p>
      <p>${evidencia ? "☑" : "☐"} Evidencias recopiladas</p>
      <h2>Observaciones</h2>
      <p>${observaciones}</p>
      </body>
      </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      const fileName = `PlanTrabajo_${Date.now()}.pdf`;
      const newPath = FileSystem.documentDirectory + fileName;

      await FileSystem.copyAsync({
        from: uri,
        to: newPath,
      });

      Alert.alert("PDF Guardado", "Documento generado correctamente");
      await Sharing.shareAsync(newPath);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo generar el PDF");
    }
  };

  const TaskItem = ({ title, value, onPress }) => (
    <TouchableOpacity style={styles.taskCard} onPress={onPress}>
      <View style={[styles.circle, value && styles.circleActive]}>
        {value && <Ionicons name="checkmark" size={16} color={colors.white} />}
      </View>
      <Text style={styles.taskText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plan de Trabajo</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.subtitle}>Gestión Institucional de Actividades</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.quickContainer}>
          <View style={styles.quickCard}>
            <View style={[styles.quickIconBox, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
              <Ionicons name="calendar" size={24} color={colors.secondary} />
            </View>
            <Text style={styles.quickText}>Eventos</Text>
          </View>

          <View style={styles.quickCard}>
            <View style={[styles.quickIconBox, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
              <Ionicons name="people" size={24} color={colors.success} />
            </View>
            <Text style={styles.quickText}>Staff</Text>
          </View>

          <View style={styles.quickCard}>
            <View style={[styles.quickIconBox, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
              <Ionicons name="checkmark-done" size={24} color={colors.warning} />
            </View>
            <Text style={styles.quickText}>Checklist</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Información General</Text>
          <TextInput placeholder="Nombre del docente" placeholderTextColor={colors.gray} value={docente} onChangeText={setDocente} style={styles.input} />
          <TextInput placeholder="Periodo" placeholderTextColor={colors.gray} value={periodo} onChangeText={setPeriodo} style={styles.input} />
          <TextInput placeholder="Departamento" placeholderTextColor={colors.gray} value={departamento} onChangeText={setDepartamento} style={styles.input} />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Evento</Text>
          <TextInput placeholder="Nombre del evento" placeholderTextColor={colors.gray} value={evento} onChangeText={setEvento} style={styles.input} />
          <TextInput placeholder="Lugar" placeholderTextColor={colors.gray} value={lugar} onChangeText={setLugar} style={styles.input} />
          <TextInput placeholder="Fecha" placeholderTextColor={colors.gray} value={fechaEvento} onChangeText={setFechaEvento} style={styles.input} />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Comisión</Text>
          <TextInput placeholder="Rol" placeholderTextColor={colors.gray} value={rol} onChangeText={setRol} style={styles.input} />
          <TextInput placeholder="Detalles de la Comisión" placeholderTextColor={colors.gray} value={comision} onChangeText={setComision} style={styles.input} />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Actividades</Text>
          <TextInput placeholder="Actividad 1" placeholderTextColor={colors.gray} value={actividad1} onChangeText={setActividad1} style={styles.input} />
          <TextInput placeholder="Actividad 2" placeholderTextColor={colors.gray} value={actividad2} onChangeText={setActividad2} style={styles.input} />
          <TextInput placeholder="Actividad 3" placeholderTextColor={colors.gray} value={actividad3} onChangeText={setActividad3} style={styles.input} />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Checklist Operativo</Text>
          <TaskItem title="Registro realizado" value={registro} onPress={() => setRegistro(!registro)} />
          <TaskItem title="Logística completada" value={logistica} onPress={() => setLogistica(!logistica)} />
          <TaskItem title="Material preparado" value={material} onPress={() => setMaterial(!material)} />
          <TaskItem title="Evidencias recopiladas" value={evidencia} onPress={() => setEvidencia(!evidencia)} />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Observaciones</Text>
          <TextInput
            style={styles.textArea}
            multiline
            placeholder="Añadir observaciones..."
            placeholderTextColor={colors.gray}
            value={observaciones}
            onChangeText={setObservaciones}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={generarPDF}>
        <Ionicons name="document-text" size={28} color={colors.white} />
      </TouchableOpacity>
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
    paddingTop: 10,
    paddingBottom: 100,
  },
  quickContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  quickCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    width: "31%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  quickIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  quickText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textDark,
  },
  sectionCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textDark,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    fontSize: 15,
    color: colors.textDark,
  },
  textArea: {
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 14,
    padding: 14,
    minHeight: 120,
    fontSize: 15,
    color: colors.textDark,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 8, // Square-ish modern checkbox
    borderWidth: 2,
    borderColor: colors.gray,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  circleActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  taskText: {
    fontSize: 15,
    color: colors.textDark,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    backgroundColor: colors.warning, // Highlight action
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});