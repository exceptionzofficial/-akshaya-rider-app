import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [vehicleType, setVehicleType] = useState('Bike');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);

    const handleRegister = async () => {
        if (!name || !phone || !password || !vehicleType || !vehicleNumber) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        const riderData = {
            name,
            phone,
            password,
            vehicleType,
            vehicleNumber
        };

        const result = await register(riderData);
        setLoading(false);

        if (!result.success) {
            Alert.alert('Registration Failed', result.message);
        }
        // Navigation handled by AuthContext updating user state
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={24} color="#2C3E50" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Join as Rider</Text>
                    <Text style={styles.subtitle}>Start earning with Satvamirtham</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Icon name="person-outline" size={20} color="#95A5A6" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor="#95A5A6"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name="call-outline" size={20} color="#95A5A6" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            placeholderTextColor="#95A5A6"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name="lock-closed-outline" size={20} color="#95A5A6" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#95A5A6"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Vehicle Details</Text>

                    <View style={styles.vehicleTypeContainer}>
                        {['Bike', 'Scooter', 'EV'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.vehicleTypeButton,
                                    vehicleType === type && styles.vehicleTypeActive
                                ]}
                                onPress={() => setVehicleType(type)}
                            >
                                <Icon
                                    name={type === 'EV' ? 'flash' : 'bicycle'}
                                    size={20}
                                    color={vehicleType === type ? '#FFF' : '#7F8C8D'}
                                />
                                <Text style={[
                                    styles.vehicleTypeText,
                                    vehicleType === type && styles.vehicleTypeTextActive
                                ]}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name="card-outline" size={20} color="#95A5A6" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Vehicle Number (e.g. TN-01-AB-1234)"
                            placeholderTextColor="#95A5A6"
                            autoCapitalize="characters"
                            value={vehicleNumber}
                            onChangeText={setVehicleNumber}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.registerButtonText}>Register</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        marginBottom: 30,
    },
    backButton: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#7F8C8D',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E8ECEF',
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#2C3E50',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
        marginTop: 10,
        marginBottom: 12,
    },
    vehicleTypeContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    vehicleTypeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E8ECEF',
    },
    vehicleTypeActive: {
        backgroundColor: '#2D7A4F',
        borderColor: '#2D7A4F',
    },
    vehicleTypeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7F8C8D',
    },
    vehicleTypeTextActive: {
        color: '#FFFFFF',
    },
    registerButton: {
        backgroundColor: '#2D7A4F',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        shadowColor: '#2D7A4F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginText: {
        color: '#7F8C8D',
        fontSize: 15,
    },
    loginLink: {
        color: '#2D7A4F',
        fontSize: 15,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
