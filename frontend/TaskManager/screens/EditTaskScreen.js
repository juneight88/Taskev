import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { updateTask } from '../services/api';

const EditTaskScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.due_date || '');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.due_date);
    }
  }, [task]);

  const handleUpdate = async () => {
    if (!title || !description || !dueDate) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const updatedTask = { title, description, due_date: dueDate };

    try {
      const response = await updateTask(task._id, updatedTask);
      if (response.status === 200) {
        Alert.alert('Success', 'Task updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update task');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to update task');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Task Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Due Date (e.g. February 14, 2024)"
          value={dueDate}
          onChangeText={setDueDate}
        />
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Update Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '40%',
    backgroundColor: '#F2613F',
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  input: {
    height: 55,
    backgroundColor: '#f4f4f4',
    borderColor: '#d1d1d1',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 20,
    fontSize: 16,
    color: '#333',
  },
  updateButton: {
    backgroundColor: '#481E14', 
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditTaskScreen;
