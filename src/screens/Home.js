import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";  // Para iconos
import FontAwesome from "react-native-vector-icons/FontAwesome";  // Para el icono de usuario
import { Menu, MenuItem } from 'react-native-material-menu';  // Para el menú desplegable
import { collection, query, where, onSnapshot } from "firebase/firestore"; // Para interactuar con Firestore en tiempo real
import { getAuth } from "firebase/auth";
import { db } from "../../credentials";  // Firestore ya configurado

export default function Home({ navigation }) {
  const [visibleMenus, setVisibleMenus] = useState({});  // Estado para gestionar la visibilidad de menús
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mostrar menú específico basado en ID
  const showMenu = (id) => {
    setVisibleMenus((prevState) => ({ ...prevState, [id]: true }));
  };

  // Ocultar menú específico basado en ID
  const hideMenu = (id) => {
    setVisibleMenus((prevState) => ({ ...prevState, [id]: false }));
  };

  const handleAgregarEquipos = (torneoId) => {
    hideMenu(torneoId);
    navigation.navigate("EquiposAgg", { torneoId });
  };

  // Función para obtener los torneos del usuario actual desde Firestore y escuchar en tiempo real
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const q = query(collection(db, "torneos"), where("userUID", "==", user.uid));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const torneosList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTorneos(torneosList);
        setLoading(false);
      });

      // Limpia la suscripción cuando el componente se desmonte
      return () => unsubscribe();
    }
  }, []);

  if (loading) {
    return <Text>Cargando torneos...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Barra superior */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setVisibleMenus((prevState) => ({ ...prevState, main: !prevState.main }))}>
          <Ionicons name="menu" size={30} color="#fff" />
        </TouchableOpacity>

        <FontAwesome name="user" size={30} color="#fff" />

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Ionicons name="exit-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Imagen de fondo */}
      <ImageBackground
        source={require('../assets/champ.jpg')} 
        style={styles.imageBackground}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            {/* Mostrar torneos en formato de cuadrícula */}
            {torneos.length === 0 ? (
              <Text style={styles.noTorneosText}>Aun no hay torneos</Text>
            ) : (
              <View style={styles.grid}>
                {torneos.map((torneo) => (
                  <View key={torneo.id} style={styles.torneoIcon}>
                    {/* Contenido principal del torneo */}
                    <TouchableOpacity onPress={() => navigation.navigate("TorneoConfig", { torneoId: torneo.id })}>
                      <Image
                        source={require("../assets/logo.jpg")}  // Cambia la imagen si lo deseas
                        style={styles.torneoImage}
                      />
                      <Text style={styles.torneoText}>{torneo.nombre}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Botón para agregar nuevo torneo */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NuevoTorneo')}>
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}>Agregar nuevo torneo</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
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
  imageBackground: {
    flex: 1,
    resizeMode: "cover",  // La imagen cubrirá toda el área disponible
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  container: {
    padding: 20,
  },
  noTorneosText: {
    textAlign: "center",
    fontSize: 18,
    color: "#fff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  torneoIcon: {
    width: "45%",
    height: 150,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  torneoImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  torneoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#32CD32", 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  menuButton: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 1,  // Asegura que esté encima del contenido del torneo
  },
});
