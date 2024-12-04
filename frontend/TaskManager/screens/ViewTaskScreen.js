import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { provTask, updateTaskStatus } from '../services/api'; 
import { FontAwesome5 } from '@expo/vector-icons';

const ViewTaskScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [animation] = useState(new Animated.Value(0)); 

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await provTask(taskId);
        setTask(response.data);
        setStatus(response.data.status); 
        setLoading(false);
      } catch (err) {
        setError('Error fetching task details: ' + err.message);
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const toggleStatus = async () => {
    try {
      const newStatus = status === 'Pending' ? 'Done' : 'Pending';
      await updateTaskStatus(taskId, newStatus); 
      setStatus(newStatus);
    } catch (err) {
      setError('Error updating status: ' + err.message);
    }
  };

  const animateBackground = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  };

  
  useEffect(() => {
    if (!loading) animateBackground();
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (!task) {
    return <Text style={styles.noTaskText}>No task found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.background, { opacity: animation }]}>
        <Text style={styles.overlayText}>Task Details</Text>
      </Animated.View>
      <View style={styles.taskCard}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.description}>{task.description}</Text>
        <Text style={styles.dueDate}>Due Date: {new Date(task.dueDate).toDateString()}</Text>
        <Text style={styles.statusText}>Status: {status}</Text>

        <TouchableOpacity
          style={[styles.statusButton, status === 'Done' ? styles.doneButton : styles.pendingButton]}
          onPress={toggleStatus}
        >
          <Text style={styles.statusButtonText}>
            Mark as {status === 'Pending' ? 'Done' : 'Pending'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="white" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: -1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
  overlayText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    opacity: 0.7,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  dueDate: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 20,
  },
  statusButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  pendingButton: {
    backgroundColor: '#481E14',
  },
  doneButton: {
    backgroundColor: '#FF6347',
  },
  statusButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9B3922',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noTaskText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ViewTaskScreen;
