// TimeTracker.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const TimeTracker = () => {
  const [tracking, setTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (tracking) {
      const start = new Date();
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const timeElapsed = (now - start) / 1000; // Time in seconds
        setElapsedTime(timeElapsed);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [tracking]);

  const handleStartStop = () => {
    setTracking(!tracking);
    if (!tracking) {
      setElapsedTime(0);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Elapsed Time: {Math.floor(elapsedTime)} seconds</Text>
      <Button title={tracking ? 'Stop' : 'Start'} onPress={handleStartStop} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default TimeTracker;
