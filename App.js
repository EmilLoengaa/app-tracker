// DistanceTracker.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import * as Location from 'expo-location';

const DistanceTracker = ({ onDistanceChange }) => {
  const [distance, setDistance] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const previousLocation = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
    })();
  }, []);

  const startTracking = async () => {
    setIsTracking(true);

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 1, // Update every meter
      },
      (newLocation) => {
        if (previousLocation.current) {
          const dist = calculateDistance(
            previousLocation.current.coords.latitude,
            previousLocation.current.coords.longitude,
            newLocation.coords.latitude,
            newLocation.coords.longitude
          );
          setDistance((prevDistance) => {
            const newDistance = prevDistance + dist;
            onDistanceChange(newDistance);
            return newDistance;
          });
        }

        previousLocation.current = newLocation;
      }
    );
  };

  const stopTracking = () => {
    setIsTracking(false);
    // Optionally, you can stop the location tracking here
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters
    return distance;
  };

  return (
    <View style={{ alignItems: 'center', padding: 20 }}>
      <Text>Total Distance: {distance.toFixed(2)} meters</Text>
      <Button
        title={isTracking ? "Stop Tracking" : "Start Tracking"}
        onPress={isTracking ? stopTracking : startTracking}
      />
    </View>
  );
};

export default DistanceTracker;