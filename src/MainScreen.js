// MainScreen.js
import React, { useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {useFocusEffect} from '@react-navigation/native';

const MainScreen = ({navigation}) => {
  const [posts, setPosts] = useState([]);
  const {width: viewportWidth, height: viewportHeight} =
    Dimensions.get('window');
  const [activeSlide, setActiveSlide] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPosts = async () => {
        const savedPosts =
          JSON.parse(await AsyncStorage.getItem('posts')) || [];
        setPosts(savedPosts);
        console.log('in main screen', savedPosts);
      };
      fetchPosts();
    }, []),
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.navigate('Login');
  };

  const handleCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  const renderPost = ({item}) => (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image source={{uri: `file://${item.path}`}} style={styles.image} />
      <Text style={{fontSize: 14, color: '#000'}}>Detail: {item.details}</Text>
      <Text style={{fontSize: 14, color: '#000'}}>
        Created At: {item.createdAt}
      </Text>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <View style={{backgroundColor: '#fff', padding: 12}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#3cb371'}}>
            Main Screen
          </Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={{fontSize: 16, color: '#000'}}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity
            onPress={handleCreatePost}
            style={{
              backgroundColor: '#3cb371',
              padding: 12,
              borderRadius: 16,
              alignItems: 'center',
              width: '100%',
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>
              Create Post
            </Text>
          </TouchableOpacity>
        </View>

        <Carousel
          data={posts}
          renderItem={renderPost}
          sliderWidth={viewportWidth}
          itemWidth={viewportWidth}
          onSnapToItem={(index) => setActiveSlide(index)}
        />
        <Pagination
          dotsLength={posts.length}
          activeDotIndex={activeSlide}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.paginationDot}
          inactiveDotStyle={styles.paginationInactiveDot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  postCard: {
    borderRadius: 5,
    height: 350,
    marginRight: 25,
  },

  image: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
  paginationContainer: {
    position: 'absolute',
    width:'100%',
    height:'200%',
    alignItems:'center',
  },
  paginationDot: {
    width: 12,
    height: 12,
    borderRadius: 12,
    marginHorizontal: 8,
    backgroundColor: '#008000',
  },
  paginationInactiveDot: {
    backgroundColor: '#98fb98',
  },
});

export default MainScreen;
