import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";  // Para iconos
import FontAwesome from "react-native-vector-icons/FontAwesome";  // Para el icono de usuario
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';  // Para el menú desplegable

export default function Home({ navigation }) {
  const [visible, setVisible] = useState(false);  // Estado del menú
  const menuRef = useRef(null);  // Referencia al menú

  const showMenu = () => setVisible(true);  // Mostrar el menú
  const hideMenu = () => setVisible(false);  // Ocultar el menú

  const handleMenuOption = (option) => {
    hideMenu();
    alert(`Seleccionaste la opción: ${option}`);
  };

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
          <MenuItem onPress={() => handleMenuOption('Opción 1')}>Opcion 1</MenuItem>
          <MenuItem onPress={() => handleMenuOption('Opción 2')}>Opcion 2</MenuItem>
          <MenuItem onPress={() => handleMenuOption('Opción 3')}>Opcion 3</MenuItem>
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
        {/* Contenido en el cuerpo */}
        <View style={styles.container}>
          <Text style={styles.text}>Aun no hay torneos</Text>

          {/* Botón para agregar nuevo torneo */}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NuevoTorneo')}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Agregar nuevo torneo</Text>
          </TouchableOpacity>
        </View>
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#fff",  // Cambié el color del texto para que sea visible sobre la imagen
    fontWeight: "bold",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',  // Agrega sombra al texto para mejor visibilidad
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#32CD32", 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
});
