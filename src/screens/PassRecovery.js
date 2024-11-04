import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth"; // Asegúrate de tener configurada la autenticación de Firebase
import { auth } from "../../credentials"; // Importa tu instancia de autenticación de Firebase
import Ionicons from "react-native-vector-icons/Ionicons";

export default function PassRecovery({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor, ingresa un correo electrónico.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Éxito", "Se ha enviado un enlace de recuperación a tu correo.");
      setEmail("");
      navigation.navigate("LoginScreen");
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar el enlace de recuperación. Asegúrate de que el correo esté registrado.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="arrow-back" size={30} color="#32CD32" style={styles.backIcon} onPress={() => navigation.navigate("Login")} />

      <Text style={styles.title}>Recuperación de Contraseña</Text>
      <Text style={styles.description}>
        Ingresa tu correo electrónico para recibir un enlace de recuperación de contraseña.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handlePasswordReset} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Enviar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backIcon: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#32CD32",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#32CD32",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  goBackText: {
    color: "#32CD32",
    fontSize: 16,
    marginTop: 20,
  },
});
