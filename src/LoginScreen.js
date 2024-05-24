import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    await AsyncStorage.setItem('userToken', 'dummy-token');
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require('../asset/images/loginSVG.jpg')}
          resizeMode="cover"
          style={{height: 350, width: 350}}
        />
      </View>
      <View style={styles.input}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.input}>
        <TextInput
          placeholder="OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginTop: 10,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  loginButton: {
    borderRadius: 12,
    backgroundColor: '#3cb371',
    padding: 15,
    width: '80%',
    alignItems: 'center',
    marginTop: 12,
  },
  loginText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default LoginScreen;
