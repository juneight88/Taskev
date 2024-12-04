import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert, Animated } from 'react-native';
import { createTask } from '../services/api';

const CreateTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [buttonPressed, setButtonPressed] = useState(false);

  const rotateValue = new Animated.Value(0); 
  const scaleValue = new Animated.Value(1); 

  const handleSubmit = () => {
    if (!title || !description || !dueDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const task = { title, description, dueDate };

    createTask(task)
      .then(() => {
        Alert.alert('Success', 'Task created successfully!');
        navigation.navigate('Home');
      })
      .catch((err) => {
        console.error('Error creating task:', err);
        Alert.alert('Error', 'Failed to create task. Please try again.');
      });
  };


  const animateButton = () => {
    Animated.sequence([
      Animated.timing(rotateValue, { toValue: 360, duration: 800, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1.1, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Task</Text>

    
      <Animated.View style={[styles.layer, { transform: [{ translateY: rotateValue }] }]}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
      </Animated.View>

   
      <Animated.View style={[styles.layer, { transform: [{ translateX: rotateValue }] }]}>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </Animated.View>

      {/* Floating Layer for Due Date Input */}
      <Animated.View style={[styles.layer, { transform: [{ translateY: rotateValue }] }]}>
        <TextInput
          style={styles.input}
          placeholder="Date format (e.g June 30, 2023)"
          value={dueDate}
          onChangeText={setDueDate}
        />
      </Animated.View>

      {/* Floating Save Button */}
      <Animated.View style={[styles.buttonContainer, { transform: [{ rotate: rotateValue }, { scale: scaleValue }] }]}>
        <TouchableOpacity style={styles.saveButton} onPress={() => {
            setButtonPressed(true);
            animateButton();
            handleSubmit();
          }}
        >
          <Text style={styles.saveButtonText}>Save Task</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f5f9',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', 
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
    zIndex: 10,
  },
  layer: {
    width: '40%',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 5, 
  },
  input: {
    height: 45,
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 15,
    paddingHorizontal: 10,
    zIndex: 10,
  },
  buttonContainer: {
    width: '20%',
    marginTop: 30,
    alignItems: 'center',
    zIndex: 10,
  },
  saveButton: {
    backgroundColor: '#481E14', 
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CreateTaskScreen;
