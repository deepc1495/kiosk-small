import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

const CountdownTimer = ({ initialSeconds,onTimeOut ,timerFont}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {

        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
         
      return () => {
        clearInterval(timer);
      };
    }
  }, [seconds]);

  useEffect(() => {
    if (seconds === 0) {
        onTimeOut()
    }
  }, [seconds]);

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return <Text style={{fontSize:timerFont??20,fontWeight:'700',textAlign:'center',color:'#000'}}>{formatTime(seconds)}</Text>;
};

export default CountdownTimer;
