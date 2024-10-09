import React, { useState, useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

//IMPORTACION PARA FIREBASE
import appFirebase from '../../credentials';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const auth = getAuth(appFirebase);

const LoginScreen = ({ navigation }) => {

  //LOGICA PARA AUTENTICACION CON FIREBASE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const logueo = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Iniciando sesion', 'Accediendo...');
      navigation.navigate('Home');  // Navegar a la pantalla Home después del login
    } catch (error) {
      Alert.alert('Error', 'Inicio de sesión fallido. Por favor, verifica tu email o contraseña.');
    }
  };

  //UI DE LOGINSCREEN
  return (
    <View style={styles.container}>
     <Image source={require('../assets/logo.jpg')} style={styles.logo} />

      <Text style={styles.title}>Login</Text>
      
      <TextInput style={styles.input} placeholder="Username" onChangeText={(text)=>setEmail(text)} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={(text)=>setPassword(text)}/>
      
      <TouchableOpacity style={styles.button} onPress={logueo}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Register</Text>
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
    width: 100,
    height: 100,
    marginBottom: 20,
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
  registerText: {
    color: '#007BFF',
    marginTop: 20,
  },
});

export default LoginScreen;
