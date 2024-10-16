import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";  // Para iconos
import FontAwesome from "react-native-vector-icons/FontAwesome";  // Para el icono de usuario
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';  // Para el menú desplegable
import { collection, query, where, onSnapshot } from "firebase/firestore"; // Para interactuar con Firestore en tiempo real
import { getAuth } from "firebase/auth";
import { db } from "../../credentials";  // Firestore ya configurado

export default function Home({ navigation }) {
  const [visible, setVisible] = useState(false);  // Estado del menú
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);  // Referencia al menú

  const showMenu = () => setVisible(true);  // Mostrar el menú
  const hideMenu = () => setVisible(false);  // Ocultar el menú

  const handleMenuOption = (option) => {
    hideMenu();
    alert(`Seleccionaste la opción: ${option}`);
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
        {/* Icono de tres líneas para abrir el menú */}
        <Menu
          ref={menuRef}
          visible={visible}
          anchor={
            <TouchableOpacity onPress={showMenu}>
              <Ionicons name="menu" size={30} color="#fff" />
            </TouchableOpacity>
          }
          onRequestClose={hideMenu}
        >
          <MenuItem onPress={() => handleMenuOption('Opción 1')}>Opción 1</MenuItem>
          <MenuItem onPress={() => handleMenuOption('Opción 2')}>Opción 2</MenuItem>
          <MenuItem onPress={() => handleMenuOption('Opción 3')}>Opción 3</MenuItem>
          <MenuDivider />
        </Menu>

        {/* Icono de usuario en el centro */}
        <FontAwesome name="user" size={30} color="#fff" />

        {/* Icono de salir a la derecha */}
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
                  <TouchableOpacity
                    key={torneo.id}
                    style={styles.torneoIcon}
                    onPress={() => navigation.navigate("TorneoConfig", { torneoId: torneo.id })}
                  >
                    <Image
                      source={require("../assets/logo.jpg")} // Puedes cambiar la imagen por una imagen representativa
                      style={styles.torneoImage}
                    />
                    <Text style={styles.torneoText}>{torneo.nombre}</Text>
                  </TouchableOpacity>
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
});
