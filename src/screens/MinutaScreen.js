import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import * as DocumentPicker from "expo-document-picker";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

// 🔵 API
import { apiUrl } from "../config/api";
import colors from "../constants/colors";
export default function MinutaScreen({ navigation }) {
  const [titulo, setTitulo] = useState("");
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [tipoSesion, setTipoSesion] = useState("");
  const [numeroSesion, setNumeroSesion] = useState("");
  const [ciclo, setCiclo] = useState("");

  const [lectura, setLectura] = useState("");
  const [acuerdos, setAcuerdos] = useState("");
  const [avisos, setAvisos] = useState("");

  const [archivo, setArchivo] = useState(null);

  const [docenteNombre, setDocenteNombre] = useState("");
  const [docentes, setDocentes] = useState([]);

  const [presidenteAcademia, setPresidenteAcademia] = useState("");
  const [secretariaAcademia, setSecretariaAcademia] = useState("");
  const [jefeDivision, setJefeDivision] = useState("");

  const seleccionarArchivo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setArchivo(result.assets[0]);
        Alert.alert("Archivo agregado correctamente");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar el archivo");
    }
  };

  const guardarMinuta = () => {
    if (!titulo.trim() || !lugar.trim() || !fecha.trim()) {
      Alert.alert("Error", "Completa los campos obligatorios");
      return;
    }

    Alert.alert("Éxito", "Minuta guardada correctamente");
  };

  const agregarDocente = () => {
    if (!docenteNombre.trim()) {
      Alert.alert("Error", "Escribe el nombre del docente");
      return;
    }

    setDocentes([...docentes, docenteNombre.trim()]);
    setDocenteNombre("");
  };

  const eliminarDocente = (index) => {
    const nuevaLista = docentes.filter((_, i) => i !== index);
    setDocentes(nuevaLista);
  };

  const generarPDF = async () => {
    if (!titulo.trim() || !lugar.trim() || !fecha.trim()) {
      Alert.alert("Error", "Completa título, lugar y fecha antes de exportar");
      return;
    }

    const listaDocentesTexto =
      docentes.length > 0
        ? docentes.map((docente) => `<b>${docente}</b>`).join(", ")
        : "<b>Sin docentes registrados</b>";

    const filasDocentes =
      docentes.length > 0
        ? docentes
            .map(
              (docente) => `
                <tr>
                  <td><b>${docente}</b></td>
                  <td></td>
                </tr>
              `
            )
            .join("")
        : `
          <tr>
            <td><b>Sin docentes registrados</b></td>
            <td></td>
          </tr>
        `;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Minuta de Academia</title>

      <style>
        @page {
          size: letter;
          margin: 35px 45px;
        }

        * {
          box-sizing: border-box;
        }

        body {
          font-family: "Times New Roman", serif;
          color: #111827;
          font-size: 13.5px;
          line-height: 1.45;
          margin: 0;
          padding: 0;
        }

        .page {
          width: 100%;
          min-height: 100vh;
          padding-bottom: 70px;
          page-break-after: always;
        }

        .page:last-child {
          page-break-after: auto;
        }

        .header {
          width: 100%;
          margin-bottom: 24px;
          border-bottom: 2px solid #1d4ed8;
          padding-bottom: 10px;
        }

        .logos {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          font-family: Arial, sans-serif;
          font-size: 10.5px;
          color: #1e3a8a;
          font-weight: bold;
        }

        .logo-box {
          width: 19%;
          text-align: center;
          border-bottom: 1px solid #93c5fd;
          padding-bottom: 6px;
        }

        .institution {
          text-align: right;
          font-size: 13px;
          font-weight: bold;
          color: #1e293b;
        }

        .division {
          text-align: right;
          font-size: 12px;
          color: #334155;
        }

        .document-title {
          text-align: center;
          margin-top: 20px;
          margin-bottom: 20px;
          font-size: 16px;
          font-weight: bold;
          color: #1e3a8a;
          text-transform: uppercase;
        }

        .date {
          text-align: right;
          margin-top: 22px;
          margin-bottom: 22px;
          font-size: 14.5px;
        }

        .blue {
          color: #1d4ed8;
          font-weight: bold;
        }

        .italic {
          font-style: italic;
        }

        .bold {
          font-weight: bold;
        }

        .justify {
          text-align: justify;
        }

        .section-title {
          font-weight: bold;
          font-size: 14px;
          margin-top: 20px;
          margin-bottom: 8px;
          text-transform: uppercase;
          color: #1e3a8a;
          border-left: 4px solid #1d4ed8;
          padding-left: 8px;
        }

        .agreement {
          margin-left: 35px;
          text-align: justify;
          margin-top: 13px;
          margin-bottom: 16px;
          background-color: #f8fbff;
          border-left: 3px solid #93c5fd;
          padding: 8px 10px;
        }

        .content-text {
          white-space: pre-line;
          text-align: justify;
          margin-bottom: 15px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          margin-bottom: 20px;
        }

        th {
          border: 1px solid #1e3a8a;
          padding: 8px;
          text-align: center;
          font-size: 13.5px;
          font-weight: bold;
          background-color: #dbeafe;
          color: #1e3a8a;
        }

        td {
          border: 1px solid #1e3a8a;
          padding: 9px;
          font-size: 13.5px;
          height: 36px;
        }

        .firma-table td:nth-child(1) {
          width: 60%;
        }

        .firma-table td:nth-child(2) {
          width: 40%;
        }

        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 55px;
          text-align: center;
          font-size: 13px;
        }

        .signature-box {
          width: 30%;
        }

        .line {
          border-top: 1px solid #1e3a8a;
          margin-bottom: 5px;
        }

        .footer {
          position: fixed;
          bottom: 10px;
          left: 45px;
          right: 45px;
          text-align: center;
          font-size: 10px;
          border-top: 4px solid #1d4ed8;
          padding-top: 5px;
          color: #334155;
        }

        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .page {
            page-break-after: always;
          }

          .page:last-child {
            page-break-after: auto;
          }
        }
      </style>
    </head>

    <body>
      <div class="page">
        <div class="header">
          <div class="logos">
            <div class="logo-box">Educación</div>
            <div class="logo-box">TecNM</div>
            <div class="logo-box">ITSOEH</div>
            <div class="logo-box">Educación Pública</div>
            <div class="logo-box">Hidalgo</div>
          </div>

          <div class="institution">
            Instituto Tecnológico Superior del Occidente del Estado de Hidalgo
          </div>
          <div class="division">
            División de Ingeniería en Sistemas Computacionales
          </div>
        </div>

        <div class="document-title">
          ${titulo || "Minuta de Academia"}
        </div>

        <div class="date">
          ${lugar || "Mixquiahuala de Juárez, Hidalgo"}, a 
          <span class="blue">${fecha}</span>
        </div>

        <p class="justify">
          En ${lugar || "Mixquiahuala de Juárez, Hidalgo"}, en las instalaciones del
          Instituto Tecnológico Superior del Occidente del Estado de Hidalgo se llevó a cabo
          el día <span class="blue">${fecha}</span> a las 
          <span class="blue">${hora || "____ horas"}</span> la Sesión 
          <span class="blue italic">${tipoSesion || "Ordinaria"}</span> de Academia No.
          <span class="blue">${numeroSesion || "__"}</span> de la División de Ingeniería en Sistemas Computacionales
          del ciclo <span class="blue">${ciclo || "enero - junio 2026"}</span>, efectuándose de la siguiente manera:
        </p>

        <div class="section-title">
          1. Lista de asistencia y declaración de quórum legal
        </div>

        <p class="justify">
          Se inicia la sesión estando presentes los siguientes integrantes:
          ${listaDocentesTexto}.
        </p>

        <div class="agreement">
          <b>ACUERDO No. SO-01 ACSIS/01:</b>
          Con fundamento en el Manual Normativo para la Integración y Operación de las Academias,
          se declara Quórum Legal en la Sesión 
          <span class="blue italic">${tipoSesion || "Ordinaria"}</span> No.
          <span class="blue">${numeroSesion || "__"}</span> de la Academia de 
          <b><i>Ingeniería en Sistemas Computacionales</i></b> adscrita a la División de
          <b><i>Ingeniería en Sistemas Computacionales</i></b> del ITSOEH.
        </div>

        <div class="section-title">
          2. Lectura y aprobación del orden del día
        </div>

        <p class="justify">
          Una vez que ha sido revisada y de no haber observaciones a la misma se toma el siguiente acuerdo:
        </p>

        <div class="agreement">
          <b>ACUERDO No. SO-01 ACSIS/02:</b>
          Con fundamento en el Manual Normativo para la Integración y Operación de las Academias,
          se da por aprobado el Orden del Día, correspondiente a la Sesión 
          <span class="blue italic">${tipoSesion || "Ordinaria"}</span> No.
          <span class="blue">${numeroSesion || "__"}</span>, quedando de la siguiente forma:
        </div>

        <div class="content-text">
          ${lectura || "Sin información registrada."}
        </div>

        <div class="section-title">
          3. Acuerdos de la sesión
        </div>

        <div class="content-text">
          ${acuerdos || "No se registraron acuerdos adicionales durante la sesión."}
        </div>

        <div class="section-title">
          4. Avisos del jefe de carrera
        </div>

        <div class="content-text">
          ${avisos || "No se registraron avisos adicionales durante la sesión."}
        </div>
      </div>

      <div class="page">
        <div class="header">
          <div class="logos">
            <div class="logo-box">Educación</div>
            <div class="logo-box">TecNM</div>
            <div class="logo-box">ITSOEH</div>
            <div class="logo-box">Educación Pública</div>
            <div class="logo-box">Hidalgo</div>
          </div>

          <div class="institution">
            Instituto Tecnológico Superior del Occidente del Estado de Hidalgo
          </div>
          <div class="division">
            División de Ingeniería en Sistemas Computacionales
          </div>
        </div>

        <div class="document-title">
          Integrantes de la Academia
        </div>

        <p><b><i>Lista de Asistencia</i></b></p>

        <table class="firma-table">
          <tr>
            <th>Nombre Completo</th>
            <th>Firma</th>
          </tr>
          ${filasDocentes}
        </table>

        <p class="justify">
          Estas firmas pertenecen a los integrantes de la 
          <b>Academia de Ingeniería en Sistemas Computacionales</b> referente a la reunión de trabajo
          en la cual se trataron los puntos previstos en el Orden del Día de la Sesión
          <span class="blue bold">${tipoSesion || "Ordinaria"} No. ${
      numeroSesion || "__"
    }</span>
          celebrada el día <span class="blue">${fecha}</span>.
        </p>

        <div class="signatures">
          <div class="signature-box">
            <div class="line"></div>
            Presidente de Academia<br />
            ${presidenteAcademia || "Nombre del presidente"}
          </div>

          <div class="signature-box">
            <div class="line"></div>
            Secretaria de Academia<br />
            ${secretariaAcademia || "Nombre de la secretaria"}
          </div>

          <div class="signature-box">
            <div class="line"></div>
            Vo. Bo.<br />
            Jefe de División<br />
            ${jefeDivision || "Nombre del jefe de división"}
          </div>
        </div>
      </div>

      <div class="footer">
        Carretera Mixquiahuala-Tula km. 2.5, Paseo del Agrarismo No. 200, Mixquiahuala de Juárez, Hgo.
      </div>
    </body>
    </html>
    `;

    try {
      if (Platform.OS === "web") {
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        const ventana = window.open(url, "_blank");

        if (!ventana) {
          Alert.alert("Error", "No se pudo abrir la vista del PDF");
          return;
        }

        setTimeout(() => {
          ventana.focus();
          ventana.print();
        }, 1000);

        return;
      }

      const file = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(file.uri);
    } catch (error) {
      Alert.alert("Error", "No se pudo generar el PDF");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Minuta de Academia</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.subtitle}>Registro y generación de documento</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Datos Generales</Text>

            <TextInput
              style={styles.input}
              placeholder="Título de la minuta"
              placeholderTextColor={colors.gray}
              value={titulo}
              onChangeText={setTitulo}
            />

            <TextInput
              style={styles.input}
              placeholder="Lugar (ej. Mixquiahuala)"
              placeholderTextColor={colors.gray}
              value={lugar}
              onChangeText={setLugar}
            />

            <TextInput
              style={styles.input}
              placeholder="Fecha (ej. 21 de enero de 2026)"
              placeholderTextColor={colors.gray}
              value={fecha}
              onChangeText={setFecha}
            />

            <TextInput
              style={styles.input}
              placeholder="Hora (ej. 11:00 horas)"
              placeholderTextColor={colors.gray}
              value={hora}
              onChangeText={setHora}
            />

            <TextInput
              style={styles.input}
              placeholder="Tipo de sesión (ej. Ordinaria)"
              placeholderTextColor={colors.gray}
              value={tipoSesion}
              onChangeText={setTipoSesion}
            />

            <TextInput
              style={styles.input}
              placeholder="Número de sesión (ej. 01)"
              placeholderTextColor={colors.gray}
              value={numeroSesion}
              onChangeText={setNumeroSesion}
            />

            <TextInput
              style={styles.input}
              placeholder="Ciclo (ej. enero - junio 2026)"
              placeholderTextColor={colors.gray}
              value={ciclo}
              onChangeText={setCiclo}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Lectura y Aprobación del Día</Text>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Escribe los puntos del orden del día"
              placeholderTextColor={colors.gray}
              value={lectura}
              onChangeText={setLectura}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Acuerdos</Text>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Escribe los acuerdos de la sesión"
              placeholderTextColor={colors.gray}
              value={acuerdos}
              onChangeText={setAcuerdos}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Avisos del Jefe de Carrera</Text>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Escribe los avisos importantes"
              placeholderTextColor={colors.gray}
              value={avisos}
              onChangeText={setAvisos}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Lista de Asistencia</Text>

            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Nombre completo del docente"
                placeholderTextColor={colors.gray}
                value={docenteNombre}
                onChangeText={setDocenteNombre}
              />

              <TouchableOpacity style={styles.btnAgregar} onPress={agregarDocente}>
                <Ionicons name="add" size={24} color={colors.white} />
              </TouchableOpacity>
            </View>

            {docentes.length > 0 && (
              <View style={styles.docentesList}>
                {docentes.map((docente, index) => (
                  <View key={index} style={styles.docenteItem}>
                    <Ionicons name="person-outline" size={18} color={colors.primary} style={{ marginRight: 8 }} />
                    <Text style={styles.docenteText}>{docente}</Text>
                    <TouchableOpacity onPress={() => eliminarDocente(index)} style={styles.btnEliminar}>
                      <Ionicons name="trash-outline" size={18} color={colors.warning} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Firmas Finales</Text>

            <TextInput
              style={styles.input}
              placeholder="Presidente de academia"
              placeholderTextColor={colors.gray}
              value={presidenteAcademia}
              onChangeText={setPresidenteAcademia}
            />

            <TextInput
              style={styles.input}
              placeholder="Secretaria de academia"
              placeholderTextColor={colors.gray}
              value={secretariaAcademia}
              onChangeText={setSecretariaAcademia}
            />

            <TextInput
              style={styles.input}
              placeholder="Jefe de división"
              placeholderTextColor={colors.gray}
              value={jefeDivision}
              onChangeText={setJefeDivision}
            />
          </View>
        </View>
      </ScrollView>

      {/* FIXED BOTTOM ACTION BAR */}
      <View style={styles.bottomBar}>
        <View style={styles.fileRow}>
          <TouchableOpacity style={styles.btnSecondary} onPress={seleccionarArchivo}>
            <Ionicons name="attach" size={20} color={colors.primary} />
            <Text style={styles.textSecondary}>Adjuntar Archivo</Text>
          </TouchableOpacity>
          {archivo && (
            <Text style={styles.fileText} numberOfLines={1} ellipsizeMode="middle">
              {archivo.name}
            </Text>
          )}
        </View>

        <View style={styles.mainActionRow}>
          <TouchableOpacity style={[styles.btnAction, styles.btnSave]} onPress={guardarMinuta}>
            <Ionicons name="save-outline" size={20} color={colors.white} />
            <Text style={styles.textBtn}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btnAction, styles.btnPdf]} onPress={generarPDF}>
            <Ionicons name="document-text-outline" size={20} color={colors.white} />
            <Text style={styles.textBtn}>PDF</Text>
          </TouchableOpacity>
        </View>
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
  content: {
    padding: 20,
    paddingBottom: 160, // Padding for fixed bottom bar
  },
  formContainer: {
    marginTop: 10,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardTitle: {
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
    minHeight: 120,
    paddingTop: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  btnAgregar: {
    backgroundColor: colors.success,
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  docentesList: {
    marginTop: 16,
    backgroundColor: colors.light,
    borderRadius: 14,
    padding: 8,
  },
  docenteItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  docenteText: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
  },
  btnEliminar: {
    padding: 4,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  btnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.1)", // Primary light
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 12,
  },
  textSecondary: {
    color: colors.primary,
    fontWeight: "600",
    marginLeft: 4,
  },
  fileText: {
    flex: 1,
    color: colors.gray,
    fontSize: 13,
  },
  mainActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnSave: {
    backgroundColor: colors.primary,
    marginRight: 10,
  },
  btnPdf: {
    backgroundColor: colors.warning, // Highlight action
  },
  textBtn: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 8,
  },
});