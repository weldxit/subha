import React, { useState, useEffect, useMemo } from 'react';
import { Text } from 'react-native';

const TypewriterText = ({ text, speed}) => {
  const [displayText, setDisplayText] = useState('');

  const updateDisplayText = useMemo(() => {
    let currentIndex = 0;
    return () => {
      const interval = setInterval(() => {
        setDisplayText((prevText) => {
          const nextChar = text[currentIndex];
          currentIndex += 1;
          return prevText + nextChar;
        });

        if (currentIndex === text.length) {
          clearInterval(interval);
        //   
        }
      }, speed);
      setDisplayText('')
      return () => clearInterval(interval);
    };
  }, [text, speed]);

  useEffect(() => {
    const clearInterval = updateDisplayText();
    return clearInterval;
  }, [updateDisplayText]);

  return <Text style={{ fontSize: 20, fontWeight: '700' }}>{displayText}</Text>;
};

export default React.memo(TypewriterText);
