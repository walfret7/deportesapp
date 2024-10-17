import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from "react-native";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";  // Importar métodos para actualizar Firestore
import { db } from "../../credentials";  // Firestore ya configurado
import Ionicons from "react-native-vector-icons/Ionicons";
import { RadioButton } from 'react-native-paper';  // Importamos RadioButton de react-native-paper

export default function TorneoConfig({ route, navigation }) {
  const { torneoId } = route.params;  // Recibimos el ID del torneo seleccionado
  const [torneo, setTorneo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);  // Control del modal de edición
  const [editedTorneo, setEditedTorneo] = useState({});  // Estado para los cambios de edición

  // Función para obtener la información del torneo
  const fetchTorneo = async () => {
    const docRef = doc(db, "torneos", torneoId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const torneoData = docSnap.data();
      setTorneo(torneoData);
      setEditedTorneo(torneoData);  // Inicializar con los datos actuales
    } else {
      Alert.alert("Error", "No se encontró el torneo.");
    }
  };

  useEffect(() => {
    fetchTorneo();
  }, []);

  // Función para guardar los cambios en Firestore
  const guardarCambios = async () => {
    try {
      const docRef = doc(db, "torneos", torneoId);
      await updateDoc(docRef, editedTorneo);  // Actualizar Firestore con los datos editados
      setTorneo(editedTorneo);  // Actualizar los datos en la interfaz de usuario
      setIsModalVisible(false);  // Cerrar el modal
      Alert.alert("Éxito", "Torneo actualizado correctamente.");
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al actualizar el torneo.");
    }
  };

  // Función para eliminar el torneo
  const eliminarTorneo = async () => {
    Alert.alert(
      "Eliminar Torneo",
      "¿Estás seguro de que deseas eliminar este torneo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "torneos", torneoId));
              Alert.alert("Torneo eliminado.");
              navigation.navigate("Home");  // Redirige a Home después de eliminar
            } catch (error) {
              Alert.alert("Error", "Hubo un problema al eliminar el torneo.");
            }
          },
        },
      ]
    );
  };

  if (!torneo) {
    return <Text>Cargando datos del torneo...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Barra superior verde con la flecha */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración del Torneo</Text>
        <View style={{ width: 30 }} /> 
      </View>

      {/* Información del torneo */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nombre del Torneo:</Text>
        <Text style={styles.value}>{torneo.nombre}</Text>

        <Text style={styles.label}>Formato del Torneo:</Text>
        <Text style={styles.value}>
          {torneo.formato === "campo" ? "Fútbol de Campo" : "Fútbol de Salón"}
        </Text>

        <Text style={styles.label}>Fecha de Inicio:</Text>
        <Text style={styles.value}>{new Date(torneo.fechaInicio.seconds * 1000).toLocaleDateString()}</Text>

        <Text style={styles.label}>Cantidad de Equipos:</Text>
        <Text style={styles.value}>{torneo.cantidadEquipos}</Text>

        <Text style={styles.label}>Duración de Partidos:</Text>
        <Text style={styles.value}>{torneo.duracionPartidos}</Text>
      </View>

      {/* Botón para abrir el modal de edición */}
      <TouchableOpacity style={styles.buttonEdit} onPress={() => setIsModalVisible(true)}>
        <Ionicons name="pencil-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Editar Torneo</Text>
      </TouchableOpacity>

      {/* Botón para eliminar el torneo */}
      <TouchableOpacity style={styles.buttonDelete} onPress={eliminarTorneo}>
        <Ionicons name="trash-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Eliminar Torneo</Text>
      </TouchableOpacity>

      {/* Modal de edición */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Torneo</Text>

            <Text style={styles.label}>Nombre del Torneo</Text>
            {/* Input para editar nombre del torneo */}
            <TextInput
              style={styles.input}
              placeholder="Nombre del Torneo"
              value={editedTorneo.nombre}
              onChangeText={(text) => setEditedTorneo({ ...editedTorneo, nombre: text })}
            />

            {/* Opciones de radio button para Formato del Torneo */}
            <Text style={styles.label}>Formato del Torneo:</Text>
            <RadioButton.Group
              onValueChange={(newValue) => setEditedTorneo({ ...editedTorneo, formato: newValue })}
              value={editedTorneo.formato}
            >
              <RadioButton.Item label="Fútbol de Campo" value="campo" />
              <RadioButton.Item label="Fútbol de Salón" value="salon" />
            </RadioButton.Group>

            {/* Opciones de radio button para Cantidad de Equipos */}
            <Text style={styles.label}>Cantidad de Equipos:</Text>
            <RadioButton.Group
              onValueChange={(newValue) => setEditedTorneo({ ...editedTorneo, cantidadEquipos: newValue })}
              value={editedTorneo.cantidadEquipos}
            >
              <RadioButton.Item label="8 equipos" value="8 equipos" />
              <RadioButton.Item label="16 equipos" value="16 equipos" />
              <RadioButton.Item label="32 equipos" value="32 equipos" />
            </RadioButton.Group>

            {/* Opciones de radio button para Duración de Partidos */}
            <Text style={styles.label}>Duración de Partidos:</Text>
            <RadioButton.Group
              onValueChange={(newValue) => setEditedTorneo({ ...editedTorneo, duracionPartidos: newValue })}
              value={editedTorneo.duracionPartidos}
            >
              <RadioButton.Item label="20 minutos" value="20 minutos" />
              <RadioButton.Item label="30 minutos" value="30 minutos" />
              <RadioButton.Item label="45 minutos" value="45 minutos" />
              <RadioButton.Item label="60 minutos" value="60 minutos" />
            </RadioButton.Group>

            {/* Botón para guardar los cambios */}
            <TouchableOpacity style={styles.buttonSave} onPress={guardarCambios}>
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>

            {/* Botón para cerrar el modal */}
            <TouchableOpacity style={styles.buttonClose} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.buttonCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  infoContainer: {
    marginBottom: 30,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",  // Negro sólido
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
  },
  buttonEdit: {
    backgroundColor: "#32CD32",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  buttonDelete: {
    backgroundColor: "#ff4d4d",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSave: {
    backgroundColor: "#32CD32",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
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
  buttonClose: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ff4d4d",
  },
  buttonCloseText: {
    color: "#fff",
  },
});
