import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, Animated, Easing } from 'react-native';
import * as Animatable from 'react-native-animatable'
const Splash = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [vibrateAnim] = useState(new Animated.Value(0));
  const [show, setShow] = useState(true)
  const text = `It's time for a change.. !`
  useEffect(() => {
    animate();
    const changeStateAfterDelay = () => {
      setTimeout(() => {
        // setYourState('New Value After Delay');
        // animate()
        setShow(!show)
      }, 2000); // 2000 milliseconds = 2 seconds
    };

    // Call the function
    changeStateAfterDelay();
  }, []);


  const animate = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 680,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 680,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.loop(
        Animated.timing(vibrateAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.bounce,
          useNativeDriver: true,
        })
      ).start();
    });
  };

  const animatedImageStyles = {
    opacity: fadeAnim,
    transform: [
      {
        translateX: vibrateAnim.interpolate({
          inputRange: [0, 0.5, 1, 1.5, 2],
          outputRange: [0, 10, 0, -10, 0], // Vibration effect
        }),
      },
    ],
  };


  // };
const TypewriterText = ({ text, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let interval;

    if (currentIndex < text.length) {
      interval = setInterval(() => {
        setDisplayText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);
    }

    return () => {
      clearInterval(interval);
    };
  }, [text, speed, currentIndex]);

  useEffect(() => {
    setDisplayText(''); // Reset text on text change
    setCurrentIndex(0); // Reset index as well
  }, [text]);

  return <Text style={{ fontSize: 25, fontWeight: '700', color:'red', width:'auto' }}>{displayText}</Text>;
};



  return (
    <View style={styles.container}>
      { show ? <Animated.Image
        source={require('../assets/logo/quiver.png')} // Replace with your image path
        style={[styles.image, animatedImageStyles]}
        resizeMode="contain" // Adjust the resizeMode as needed
      /> :
      <TypewriterText text={text} speed={30}/> }
     <Animatable.Text style={styles.poweredBy} animation="slideOutUp" duration={1000} delay={500} easing={'ease-in'}>
        Powered by{' '}
        <Text style={styles.weldx}>WeldX </Text>
        <Text style={styles.it}>IT</Text>
      </Animatable.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Change as needed
  },
  image: {
    width: 280, // Adjust width as needed
  },
  text: {
    marginTop: 0, // No margin top
  },
  poweredBy: {
    position: 'absolute',
    bottom: 0,
    marginBottom: -10,
    fontSize: 11,
    color: 'gray',
  },
  weldx: {
    fontSize: 14,
    fontWeight: '600',
    color: 'deepskyblue',
  },
  it: {
    fontSize: 14,
    fontWeight: '600',
    color: 'deeppink',
  },
});

export default Splash;
