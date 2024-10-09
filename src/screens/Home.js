import React, { useLayoutEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';

export default function Home({ navigation }) {

    // Usamos useLayoutEffect para configurar el botón "Salir" en la esquina superior derecha
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => {
                        navigation.navigate('Login'); // Redirigir a la pantalla de Login
                    }}
                >
                    <Text style={styles.logoutButtonText}>Salir</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text>This is your home siuu</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButton: {
        marginRight: 10,
        padding: 10,
    },
    logoutButtonText: {
        color: 'blue',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
