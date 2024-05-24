import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraDevices,
} from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreatePostScreen = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [photo, setPhoto] = useState(null);
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = useCameraDevice('back');

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      const microphonePermission = await Camera.requestMicrophonePermission();
      console.log(cameraPermission);
      if (cameraPermission === 'granted') {
        setHasPermission(true);
      } else {
        setHasPermission(false);
      }
    };

    requestPermissions();
  }, []);

  const takePicture = async () => {
    const photo = await camera.current.takePhoto({
      flash: 'off',
    });
    setPhoto(photo.path);
    console.log('Photo path:', photo.path);
    await simulateUploadToS3(photo.path);
    const newPost = {
      details: 'New Post',
      createdAt: new Date().toISOString(),
      path: photo.path,
    };
    const savedPosts = JSON.parse(await AsyncStorage.getItem('posts')) || [];
    savedPosts.push(newPost);
    await AsyncStorage.setItem('posts', JSON.stringify(savedPosts));

    navigation.navigate('Main');
  };

  const simulateUploadToS3 = async path => {
    // Simulate a delay
    return new Promise(resolve => setTimeout(resolve, 2000));
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 16, color: '#000'}}>
          Camera permissions are not granted.
        </Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 16, color: '#000'}}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!photo ? (
        <Camera
          style={styles.camera}
          device={device}
          isActive={true}
          ref={camera}
          photo={true}
        />
      ) : (
        <Image source={{uri: `file://${photo}`}} style={styles.photo} />
      )}
      <View
        style={{
          height: '90%',
          width: '100%',
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity onPress={takePicture}>
          <View
            style={{
              height: 50,
              width: 50,
              borderRadius: 50,
              backgroundColor: '#3cb371',
            }}></View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  photo: {
    flex: 1,
    width: '100%',
  },
});

export default CreatePostScreen;
