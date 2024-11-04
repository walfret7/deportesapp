import React, {useState} from 'react';
import { CommonActions } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

//IMPORTACION PARA FIREBASE
import appFirebase from '../../credentials';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
const auth = getAuth(appFirebase);

const RegisterScreen = ({ navigation }) => {

  //LOGICA PARA EL REGISTRO POR FIREBASE
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registrar = async () => {
    // Verificar que todos los campos estén completos
    if (!username || !email || !password) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    try {
      // Crear usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizar el perfil del usuario con el nombre de usuario
      await updateProfile(user, {
        displayName: username,
      });

      Alert.alert('Registro exitoso', 'Usuario creado con éxito');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
    } catch (error) {
      console.log('Error durante el registro:', error);
      Alert.alert('Error', `No se pudo registrar el usuario: ${error.message}`);
    }
  };

  //UI DEL SCREEN REGISTRO
  return (
    <View style={styles.container}>
      <Ionicons name="arrow-back" size={30} color="#32CD32" style={styles.backIcon} onPress={() => navigation.navigate("Login")} />
      <Image source={require('../assets/logo.jpg')} style={styles.logo} />

      <Text style={styles.title}>Register</Text>
      
      <TextInput style={styles.input} placeholder="Username" onChangeText={(text)=>setUsername(text)}/>
      <TextInput style={styles.input} placeholder="Email Address" onChangeText={(text)=>setEmail(text)}/>
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={(text)=>setPassword(text)}/>
      
      <TouchableOpacity style={styles.button} onPress={registrar}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 300,      
    height: 300,     
    marginBottom: 30, 
    marginTop: -40, 
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loginText: {
    color: '#007BFF',
    marginTop: 20,
  },
  backIcon: {
    position: "absolute",
    top: 40,
    left: 20,
  },
});

export default RegisterScreen;
