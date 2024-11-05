import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert } from "react-native";
import { doc, getDoc, deleteDoc, updateDoc, addDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../credentials";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RadioButton } from 'react-native-paper';

export default function TorneoConfig({ route, navigation }) {
  const { torneoId } = route.params;
  const [torneo, setTorneo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedTorneo, setEditedTorneo] = useState({});
  const [mostrarAgregarEquipos, setMostrarAgregarEquipos] = useState(false);
  const [mostrarEmparejamientos, setMostrarEmparejamientos] = useState(false); // Estado para la sección de emparejamientos
  const [nombreEquipo, setNombreEquipo] = useState(''); // Estado para el nombre del equipo
  const [equipos, setEquipos] = useState([]); // Estado para la lista de equipos
  const [equipoEditado, setEquipoEditado] = useState(null); // Estado para manejar el equipo en edición
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Controlar la visibilidad del modal de edición
  const [emparejamientos, setEmparejamientos] = useState(null);

  // Función para obtener los datos del torneo
  const fetchTorneo = async () => {
    const docRef = doc(db, "torneos", torneoId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const torneoData = docSnap.data();
      setTorneo(torneoData);
      setEditedTorneo(torneoData);
    } else {
      Alert.alert("Error", "No se encontró el torneo.");
    }
  };

  // Obtener los equipos del torneo desde Firebase
  const fetchEquipos = () => {
    const q = query(collection(db, "equipos"), where("torneoId", "==", torneoId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const equiposList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEquipos(equiposList);
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    fetchTorneo();
    fetchEquipos();
  }, []);

  // Función para agregar un equipo
  const agregarEquipo = async () => {
    if (equipos.length >= torneo.cantidadEquipos) {
      Alert.alert("Advertencia", `El límite de equipos (${torneo.cantidadEquipos}) ha sido alcanzado.`);
      return; // Si se alcanza el límite, no agrega el equipo
    }

    if (nombreEquipo.trim() === "") {
      Alert.alert("Error", "El nombre del equipo no puede estar vacío.");
      return;
    }

    try {
      await addDoc(collection(db, "equipos"), {
        nombre: nombreEquipo,
        torneoId: torneoId, // Relaciona el equipo con el torneo actual
      });
      setNombreEquipo(''); // Limpiar el input después de agregar el equipo
    } catch (error) {
      console.error("Error agregando equipo: ", error);
      Alert.alert("Error", "Hubo un problema al agregar el equipo.");
    }
  };

  // Función para editar un equipo
  const editarEquipo = (equipo) => {
    setEquipoEditado(equipo); // Establecer el equipo seleccionado para editar
    setIsEditModalVisible(true); // Mostrar el modal de edición
  };

  const guardarEdicionEquipo = async () => {
    if (!equipoEditado.nombre.trim()) {
      Alert.alert("Error", "El nombre del equipo no puede estar vacío.");
      return;
    }

    try {
      const equipoRef = doc(db, "equipos", equipoEditado.id);
      await updateDoc(equipoRef, { nombre: equipoEditado.nombre });
      setIsEditModalVisible(false); // Cerrar el modal después de guardar
      Alert.alert("Éxito", "Equipo actualizado correctamente.");
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al actualizar el equipo.");
    }
  };

  // Función para eliminar un equipo
  const eliminarEquipo = async (equipoId) => {
    Alert.alert(
      "Eliminar Equipo",
      "¿Estás seguro de que deseas eliminar este equipo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "equipos", equipoId));
              Alert.alert("Equipo eliminado.");
            } catch (error) {
              Alert.alert("Error", "Hubo un problema al eliminar el equipo.");
            }
          },
        },
      ]
    );
  };

  const guardarCambios = async () => {
    try {
      const docRef = doc(db, "torneos", torneoId);
      await updateDoc(docRef, editedTorneo);
      setTorneo(editedTorneo);
      setIsModalVisible(false);
      Alert.alert("Éxito", "Torneo actualizado correctamente.");
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al actualizar el torneo.");
    }
  };

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
              navigation.navigate("Home");
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

  // Función para generar emparejamientos
const generarEmparejamientos = () => {
  if (equipos.length < torneo.cantidadEquipos) {
    Alert.alert("Error", "No hay suficientes equipos para generar los emparejamientos.");
    return;
  }

  let equiposAleatorios = [...equipos].sort(() => Math.random() - 0.5);

  // Generar solo la primera ronda para Eliminación directa
  if (torneo.tipoformato === "Eliminacion directa") {
    let primeraRonda = equiposAleatorios.map((equipo, index, array) => {
      if (index % 2 === 0 && array[index + 1]) {
        return {
          equipo1: equipo,
          equipo2: array[index + 1],
          resultado1: null,
          resultado2: null,
        };
      }
      return null;
    }).filter((match) => match);
    setEmparejamientos([primeraRonda]); // Solo inicializa la primera ronda
  } else {
    // Generar emparejamientos en formato de grupos para Fase de Grupos
    let grupos = [];
    for (let i = 0; i < equiposAleatorios.length; i += 4) {
      grupos.push(equiposAleatorios.slice(i, i + 4));
    }
    setEmparejamientos(grupos);
  }

  Alert.alert("Emparejamientos generados");
};

// Función para gestionar el cambio de resultado y avance de ronda
const handleResultChange = (rondaIndex, matchIndex, resultadoField, value) => {
  const newEmparejamientos = [...emparejamientos];
  const match = newEmparejamientos[rondaIndex][matchIndex];
  // Verificar si el valor es un número, incluyendo el 0
  if (value === "") {
    match[resultadoField] = null; // Si el campo está vacío, establecemos null
  } else if (!isNaN(value)) {
    match[resultadoField] = parseInt(value, 10); // Si es un número válido, incluido el 0, lo guardamos
  }
  setEmparejamientos(newEmparejamientos);
};

// Función para confirmar los ganadores de la ronda actual y generar la siguiente ronda
const confirmarRonda = (rondaIndex) => {
  const rondaActual = emparejamientos[rondaIndex];
  const nuevaRonda = [];

  for (let i = 0; i < rondaActual.length; i += 2) {
    const match1 = rondaActual[i];
    const match2 = rondaActual[i + 1];

    if (match1 && match2) {
      const ganador1 = match1.resultado1 > match1.resultado2 ? match1.equipo1 : match1.equipo2;
      const ganador2 = match2.resultado1 > match2.resultado2 ? match2.equipo1 : match2.equipo2;
      nuevaRonda.push({
        equipo1: ganador1,
        equipo2: ganador2,
        resultado1: null,
        resultado2: null,
      });
    }
  }

  // Solo avanza a la siguiente ronda si todos los partidos de la ronda actual tienen resultados
  const rondaCompleta = rondaActual.every((match) => match.resultado1 !== null && match.resultado2 !== null);

  if (rondaCompleta) {
    setEmparejamientos([...emparejamientos, nuevaRonda]);
    Alert.alert("Ronda completada", "La siguiente ronda ha sido generada.");
  } else {
    Alert.alert("Error", "Por favor, ingresa todos los resultados para esta ronda antes de avanzar.");
  }
};
  
return (
  <View style={styles.container}>
    {/* Barra superior verde con la flecha */}
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Configuración del Torneo</Text>
      <TouchableOpacity onPress={() => alert('Settings')}>
        <Ionicons name="settings-outline" size={30} color="#fff" />
      </TouchableOpacity>
    </View>

    {/* Barra de navegación adicional */}
    <View style={styles.navIcons}>
      <TouchableOpacity onPress={() => { setMostrarAgregarEquipos(false); setMostrarEmparejamientos(false); }}>
        <Ionicons name="home-outline" size={30} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setMostrarAgregarEquipos(true); setMostrarEmparejamientos(false); }}>
        <Ionicons name="football-outline" size={30} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setMostrarEmparejamientos(true); setMostrarAgregarEquipos(false); }}>
        <Ionicons name="trophy-outline" size={30} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => alert('Chat')}>
        <Ionicons name="chatbubble-outline" size={30} color="#fff" />
      </TouchableOpacity>
    </View>

    {mostrarAgregarEquipos ? (
      <View style={styles.agregarEquiposContainer}>
        <Text style={styles.title}>Añadir equipos</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del Equipo"
          value={nombreEquipo}
          onChangeText={setNombreEquipo}
        />
        <TouchableOpacity style={styles.addButton} onPress={agregarEquipo}>
          <Text style={styles.addButtonText}>Añadir</Text>
        </TouchableOpacity>

        {/* Lista de equipos */}
        <Text style={styles.totalEquiposText}>Total: {equipos.length}</Text>
        {equipos.map((equipo) => (
          <View key={equipo.id} style={styles.equipoItem}>
            <Ionicons name="trophy-outline" size={30} color="#32CD32" />
            <View>
              <Text style={styles.equipoNombreAgregar}>{equipo.nombre}</Text>
              <Text style={styles.equipoJugadores}>0 Jugador</Text>
            </View>
            <View style={styles.iconContainer}>
              {/* Botón de editar */}
              <TouchableOpacity onPress={() => editarEquipo(equipo)}>
                <Ionicons name="pencil-outline" size={24} color="#007BFF" />
              </TouchableOpacity>
              {/* Botón de eliminar */}
              <TouchableOpacity onPress={() => eliminarEquipo(equipo.id)}>
                <Ionicons name="trash-outline" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    ) : mostrarEmparejamientos ? (
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 10 }}>
    <TouchableOpacity style={styles.generarButton} onPress={generarEmparejamientos}>
      <Text style={styles.generarButtonText}>Generar Emparejamientos</Text>
    </TouchableOpacity>
    {emparejamientos ? (
      torneo.tipoformato === "Eliminacion directa" ? (
        emparejamientos.map((ronda, rondaIndex) => (
          <View key={rondaIndex} style={styles.roundContainer}>
            <Text style={styles.roundTitle}>Ronda {rondaIndex + 1}</Text>
            {ronda.map((match, matchIndex) => (
              <View key={matchIndex} style={styles.matchContainer}>
                <Text style={styles.matchTitle}>Match {rondaIndex + 1}-{matchIndex + 1}</Text>
                <View style={styles.teamContainer}>
                  <Text>{match.equipo1?.nombre}</Text>
                  <TextInput
                    style={styles.resultInput}
                    keyboardType="numeric"
                    placeholder="Resultado"
                    value={match.resultado1 !== null ? String(match.resultado1) : ""}
                    onChangeText={(value) => handleResultChange(rondaIndex, matchIndex, 'resultado1', value)}
                  />
                </View>
                <View style={styles.teamContainer}>
                  <Text>{match.equipo2?.nombre}</Text>
                  <TextInput
                    style={styles.resultInput}
                    keyboardType="numeric"
                    placeholder="Resultado"
                    value={match.resultado2 !== null ? String(match.resultado2) : ""}
                    onChangeText={(value) => handleResultChange(rondaIndex, matchIndex, 'resultado2', value)}
                  />
                </View>
              </View>
            ))}
            {rondaIndex === emparejamientos.length - 1 && (
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => confirmarRonda(rondaIndex)}
              >
                <Text style={styles.confirmButtonText}>Confirmar Ronda {rondaIndex + 1}</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      ) : (
        emparejamientos.map((grupo, index) => (
          <View key={index} style={styles.grupoContainer}>
            <Text style={styles.grupoTitle}>Grupo {String.fromCharCode(65 + index)}</Text>
            {grupo.map((equipo) => (
              <View key={equipo.id} style={styles.equipoRow}>
                <Text style={styles.equipoNombre}>{equipo.nombre.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))
      )
    ) : (
      <Text style={styles.title}>Aún no hay emparejamientos</Text>
    )}
  </ScrollView>
) : (
  <ScrollView>
    <View style={styles.infoContainer}>
      <Text style={styles.label}>Nombre del Torneo:</Text>
      <Text style={styles.value}>{torneo.nombre}</Text>

      <Text style={styles.label}>Deporte:</Text>
      <Text style={styles.value}>
        {torneo.tipoTorneo === "Fútbol de Campo" ? "Fútbol de Campo" : "Fútbol de Salón"}
      </Text>

      <Text style={styles.label}>Formato del Torneo:</Text>
      <Text style={styles.value}>
        {torneo.tipoformato === "Fase de grupos" ? "Fase de Grupos" : "Eliminación Directa"}
      </Text>

      <Text style={styles.label}>Fecha de Inicio:</Text>
      <Text style={styles.value}>{new Date(torneo.fechaInicio.seconds * 1000).toLocaleDateString()}</Text>

      <Text style={styles.label}>Cantidad de Equipos:</Text>
      <Text style={styles.value}>{torneo.cantidadEquipos}</Text>

      <Text style={styles.label}>Duración de Partidos:</Text>
      <Text style={styles.value}>{torneo.duracionPartidos}</Text>
    </View>
  </ScrollView>
)}

    {/* Modal de edición de equipo */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={isEditModalVisible}
      onRequestClose={() => setIsEditModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Equipo</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del Equipo"
            value={equipoEditado ? equipoEditado.nombre : ''}
            onChangeText={(text) => setEquipoEditado({ ...equipoEditado, nombre: text })}
          />
          <TouchableOpacity style={styles.buttonSave} onPress={guardarEdicionEquipo}>
            <Ionicons name="save-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonClose} onPress={() => setIsEditModalVisible(false)}>
            <Text style={styles.buttonCloseText}>Cerrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>

    {/* Botón para abrir el modal de edición del torneo */}
    {!mostrarAgregarEquipos && !mostrarEmparejamientos && (
      <TouchableOpacity style={styles.buttonEdit} onPress={() => setIsModalVisible(true)}>
        <Ionicons name="pencil-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Editar Torneo</Text>
      </TouchableOpacity>
    )}

    {/* Botón para eliminar el torneo */}
    {!mostrarAgregarEquipos && !mostrarEmparejamientos && (
      <TouchableOpacity style={styles.buttonDelete} onPress={eliminarTorneo}>
        <Ionicons name="trash-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Eliminar Torneo</Text>
      </TouchableOpacity>
    )}

    {/* Modal de edición del torneo */}
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
          <TextInput
            style={styles.input}
            placeholder="Nombre del Torneo"
            value={editedTorneo.nombre}
            onChangeText={(text) => setEditedTorneo({ ...editedTorneo, nombre: text })}
          />

          <Text style={styles.label}>Formato del Torneo:</Text>
          <RadioButton.Group
            onValueChange={(newValue) => setEditedTorneo({ ...editedTorneo, tipoformato: newValue })}
            value={editedTorneo.tipoformato}
          >
            <RadioButton.Item label="Fase de Grupos" value="Fase de grupos" />
            <RadioButton.Item label="Eliminación Directa" value="Eliminacion directa" />
          </RadioButton.Group>

          <Text style={styles.label}>Deporte:</Text>
          <RadioButton.Group
            onValueChange={(newValue) => setEditedTorneo({ ...editedTorneo, tipoTorneo: newValue })}
            value={editedTorneo.tipoTorneo}
          >
            <RadioButton.Item label="Fútbol de Campo" value="Fútbol de Campo" />
            <RadioButton.Item label="Fútbol de Salón" value="salon" />
          </RadioButton.Group>

          <Text style={styles.label}>Cantidad de Equipos:</Text>
          <RadioButton.Group
            onValueChange={(newValue) => setEditedTorneo({ ...editedTorneo, cantidadEquipos: newValue })}
            value={editedTorneo.cantidadEquipos}
          >
            <RadioButton.Item label="8 equipos" value="8 equipos" />
            <RadioButton.Item label="16 equipos" value="16 equipos" />
            <RadioButton.Item label="32 equipos" value="32 equipos" />
          </RadioButton.Group>

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
    backgroundColor: "#32CD32",
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
    backgroundColor: "#f5f5f5",
  },
  navIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#32CD32',
    paddingVertical: 10,
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
    color: "#000",
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
  agregarEquiposContainer: {
    padding: 20,
    justifyContent: "center",
  },
  equipoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  equipoNombre: {
    fontSize: 16,
    fontWeight: "bold",
  },
  equipoJugadores: {
    fontSize: 12,
    color: "#666",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 10,
  },
  addButton: {
    backgroundColor: "#32CD32",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  totalEquiposText: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  emparejamientosContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  generarButton: {
    backgroundColor: "#32CD32",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    alignSelf: "center", // Centrar el botón horizontalmente
    width: "80%", // Ajustar el ancho del botón al 80% de la pantalla
  },
  generarButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center", // Centrar el texto horizontalmente
    marginTop: 10,
    color: "#666",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20, // Añade un margen inferior para facilitar el desplazamiento
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
  llaveContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#e0f7fa",
    borderRadius: 5,
  },
  grupoContainer: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#001f5b",
    borderRadius: 8,
  },
  grupoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
    textAlign: "left",
    paddingLeft: 5,
  },
  equipoRow: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomColor: "#4a4a4a",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  equipoNombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  bracketContainer: {
    flexDirection: "row",
    padding: 10,
  },
  roundContainer: {
    marginHorizontal: 10,
  },
  roundTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  matchContainer: {
    backgroundColor: "#e0f7fa",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  bracketContainer: {
  flexDirection: "row",
  padding: 10,
  justifyContent: "center",
},
roundContainer: {
  marginHorizontal: 10,
  alignItems: "center",
},
roundTitle: {
  fontSize: 18,
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: 10,
},
matchContainer: {
  backgroundColor: "#e0f7fa",
  padding: 10,
  borderRadius: 5,
  marginBottom: 10,
  width: 150,
  alignItems: "center",
},
matchTitle: {
  fontWeight: "bold",
  marginBottom: 5,
},
teamContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginBottom: 5,
},
resultInput: {
  backgroundColor: "#fff",
  borderColor: "#ccc",
  borderWidth: 1,
  borderRadius: 5,
  width: 40,
  textAlign: "center",
},
confirmButton: {
  backgroundColor: "#32CD32",
  padding: 10,
  borderRadius: 10,
  marginTop: 10,
  alignItems: "center",
},
confirmButtonText: {
  color: "#fff",
  fontSize: 16,
},
equipoNombreAgregar: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#000000", // Cambia el color a negro
},

});