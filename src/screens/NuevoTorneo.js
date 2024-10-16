import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ImageBackground, Modal, Platform, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";  // Para el icono de la flecha
import DateTimePicker from '@react-native-community/datetimepicker';  // DateTimePicker para seleccionar la fecha


export default function NuevoTorneo({ navigation }) {
  const [selectedOption, setSelectedOption] = useState(null);  // Para manejar la opción seleccionada
  const [startDate, setStartDate] = useState(new Date());  // Estado para la fecha seleccionada
  const [showDatePicker, setShowDatePicker] = useState(false);  // Controla la visibilidad del DatePicker
  const [formatoTorneo, setFormatoTorneo] = useState('');  // Para manejar el formato del torneo
  const [showModal, setShowModal] = useState(false);  // Controla la visibilidad del modal de equipos
  const [showDurationModal, setShowDurationModal] = useState(false);  // Controla la visibilidad del modal de duración
  const [selectedDetail, setSelectedDetail] = useState('');  // Almacena la cantidad de equipos seleccionada
  const [selectedDuration, setSelectedDuration] = useState('');  // Almacena la duración seleccionada

  // Función para mostrar el DatePicker
  const showDateSelector = () => {
    setShowDatePicker(true);
  };

  // Función que se ejecuta cuando se selecciona una fecha
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(Platform.OS === 'ios');  // Oculta el DatePicker si no es iOS
    setStartDate(currentDate);  // Actualiza la fecha seleccionada
  };

  // Función para seleccionar el formato del torneo
  const selectFormatoTorneo = (formato) => {
    setFormatoTorneo(formato);
  };

  // Función para manejar la selección de cantidad de equipos
  const selectDetail = (detail) => {
    setSelectedDetail(`${detail} equipos`);  // Guardar la cantidad de equipos seleccionada
    setShowModal(false);  // Cerrar el modal después de seleccionar
  };

  // Función para manejar la selección de duración
  const selectDuration = (duration) => {
    setSelectedDuration(`${duration} minutos`);  // Guardar la duración seleccionada
    setShowDurationModal(false);  // Cerrar el modal después de seleccionar
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Barra superior */}
      <View style={styles.header}>
        {/* Icono de flecha para regresar a Home */}
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Texto "Crear Torneo" en el centro */}
        <Text style={styles.headerTitle}>Crear Torneo</Text>

        {/* Espacio vacío a la derecha */}
        <View style={{ width: 30 }} />
      </View>

      {/* Imagen de fondo */}
      <ImageBackground
        source={require('../assets/campo.jpg')}  // Imagen predeterminada de fondo
        style={styles.imageBackground}
      >
        {/* ScrollView para permitir desplazamiento */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            {/*<Text style={styles.text}>Selecciona una opción</Text>*/}

            {/* Botón para seleccionar Fútbol de campo */}
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedOption === "campo" && styles.selectedOption,  // Estilo para la opción seleccionada
              ]}
              onPress={() => setSelectedOption("campo")}
            >
              <Text style={styles.optionText}>Fútbol de campo</Text>
            </TouchableOpacity>

            {/* Mostrar formulario si se selecciona Fútbol de campo */}
            {selectedOption === "campo" && (
              <View style={styles.form}>
                <Text style={styles.label}>Nombre del Torneo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre del torneo"
                  placeholderTextColor="#999"
                />

                {/* Opción para seleccionar el formato del torneo */}
                <Text style={styles.label}>Formato del torneo</Text>
                <View style={styles.radioContainer}>
                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => selectFormatoTorneo("fase_grupos")}
                  >
                    <Ionicons
                      name={formatoTorneo === "fase_grupos" ? "radio-button-on" : "radio-button-off"}
                      size={24}
                      color="#32CD32"
                    />
                    <Text style={styles.radioText}>Fase de grupos</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => selectFormatoTorneo("eliminacion_directa")}
                  >
                    <Ionicons
                      name={formatoTorneo === "eliminacion_directa" ? "radio-button-on" : "radio-button-off"}
                      size={24}
                      color="#32CD32"
                    />
                    <Text style={styles.radioText}>Eliminación directa</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Seleccione la fecha de inicio del torneo</Text>
                {/* Campo de selección de fecha */}
                <TouchableOpacity onPress={showDateSelector} style={styles.dateButton}>
                  <Text style={styles.dateText}>Fecha de inicio: {startDate.toLocaleDateString()}</Text>
                </TouchableOpacity>

                {/* Mostrar DatePicker si se selecciona */}
                {showDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={onChange}
                  />
                )}

                {/* Opción para seleccionar la cantidad de equipos */}
                <Text style={styles.label}>Cantidad de equipos</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowModal(true)}>
                  <Text style={styles.dateText}>Seleccionar cantidad de equipos</Text>
                </TouchableOpacity>

                {/* Mostrar la cantidad de equipos seleccionada */}
                {selectedDetail ? (
                  <Text style={styles.selectedDetailText}>
                    Cantidad de equipos: {selectedDetail}
                  </Text>
                ) : null}

                {/* Opción para seleccionar la duración de los partidos */}
                <Text style={styles.label}>Duración de partidos</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDurationModal(true)}>
                  <Text style={styles.dateText}>Seleccionar duración de partidos</Text>
                </TouchableOpacity>

                {/* Mostrar la duración seleccionada */}
                {selectedDuration ? (
                  <Text style={styles.selectedDetailText}>
                    Duración seleccionada: {selectedDuration}
                  </Text>
                ) : null}
              </View>
            )}

            {/* Botón para seleccionar Fútbol de salón */}
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedOption === "salon" && styles.selectedOption,  // Estilo para la opción seleccionada
              ]}
              onPress={() => setSelectedOption("salon")}
            >
              <Text style={styles.optionText}>Fútbol de salón</Text>
            </TouchableOpacity>

            {/* Mostrar formulario si se selecciona Fútbol de salón */}
            {selectedOption === "salon" && (
              <View style={styles.form}>
                <Text style={styles.label}>Nombre del Torneo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre del torneo"
                  placeholderTextColor="#999"
                />
                <Text style={styles.label}>Seleccione la fecha de inicio del torneo</Text>
                {/* Campo de selección de fecha */}
                <TouchableOpacity onPress={showDateSelector} style={styles.dateButton}>
                  <Text style={styles.dateText}>Fecha de inicio: {startDate.toLocaleDateString()}</Text>
                </TouchableOpacity>

                {/* Mostrar DatePicker si se selecciona */}
                {showDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={onChange}
                  />
                )}

                {/* Opción para seleccionar la cantidad de equipos */}
                <Text style={styles.label}>Cantidad de equipos</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowModal(true)}>
                  <Text style={styles.dateText}>Seleccionar cantidad de equipos</Text>
                </TouchableOpacity>

                {/* Mostrar la cantidad de equipos seleccionada */}
                {selectedDetail ? (
                  <Text style={styles.selectedDetailText}>
                    Cantidad de equipos: {selectedDetail}
                  </Text>
                ) : null}

                {/* Opción para seleccionar la duración de los partidos */}
                <Text style={styles.label}>Duración de partidos</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDurationModal(true)}>
                  <Text style={styles.dateText}>Seleccionar duración de partidos</Text>
                </TouchableOpacity>

                {/* Mostrar la duración seleccionada */}
                {selectedDuration ? (
                  <Text style={styles.selectedDetailText}>
                    Duración seleccionada: {selectedDuration}
                  </Text>
                ) : null}
              </View>
            )}

            {/* Botón debajo del contenido, visible solo cuando hay una opción seleccionada */}
            {selectedOption && (
              <TouchableOpacity style={styles.bottomButton}>
                <Text style={styles.buttonText}>Guardar Torneo</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Modal para seleccionar la cantidad de equipos */}
        <Modal
          transparent={true}
          visible={showModal}
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cantidad de equipos</Text>

              <TouchableOpacity onPress={() => selectDetail(8)}>
                <Text style={styles.modalOption}>8 equipos</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => selectDetail(16)}>
                <Text style={styles.modalOption}>16 equipos</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => selectDetail(32)}>
                <Text style={styles.modalOption}>32 equipos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para seleccionar la duración de partidos */}
        <Modal
          transparent={true}
          visible={showDurationModal}
          animationType="slide"
          onRequestClose={() => setShowDurationModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Duración del partido</Text>

              <TouchableOpacity onPress={() => selectDuration(20)}>
                <Text style={styles.modalOption}>20 minutos</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => selectDuration(30)}>
                <Text style={styles.modalOption}>30 minutos</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => selectDuration(45)}>
                <Text style={styles.modalOption}>45 minutos</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => selectDuration(60)}>
                <Text style={styles.modalOption}>60 minutos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowDurationModal(false)}
              >
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#32CD32",  // Color verde limón
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",  // La imagen cubrirá toda el área disponible
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20, // Asegurar que haya espacio al final para el botón
  },
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 20,
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    padding: 15,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedOption: {
    borderColor: "#32CD32",  // Cambia el color de borde si está seleccionado
  },
  optionText: {
    fontSize: 18,
    color: "#000",
  },
  form: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,  // Agrega más espacio debajo de cada etiqueta
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 20,  // Agrega más espacio debajo del input
  },
  radioContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#32CD32",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,  // Agrega más espacio debajo del botón de selección de fecha
    width: '80%',
    alignSelf: 'center',
  },
  dateText: {
    color: "#fff",
    fontSize: 16,
  },
  selectedDetailText: {
    marginTop: 10,
    marginBottom: 20,  // Más espacio debajo del texto seleccionado
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  modalOption: {
    fontSize: 16,
    paddingVertical: 10,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#32CD32",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 16,
  },
  bottomButton: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 20,  // Añade espacio en la parte inferior
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
