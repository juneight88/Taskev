import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { getTasks, deleteTask } from '../services/api';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState(null); 
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching tasks: ' + err.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = (id) => {
    deleteTask(id)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
        setExpandedTaskId(null);
        setConfirmDelete(null); 
      })
      .catch((err) => setError('Error deleting task: ' + err.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Task Manager</Text>
      <Text style={styles.subHeader}>----------</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#525B44" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : !tasks.length ? (
        <Text style={styles.noTasksText}>No tasks available.</Text>
      ) : (
        <FlatList
          data={tasks.slice().reverse()}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.taskContainer}>
              <TouchableOpacity
                style={styles.taskCard}
                onPress={() => setExpandedTaskId(expandedTaskId === item._id ? null : item._id)}
              >
                <Text style={styles.taskTitle}>{item.title}</Text>
              </TouchableOpacity>

              {expandedTaskId === item._id && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('Edit', { task: item })}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => navigation.navigate('View', { taskId: item._id })}
                  >
                    <Text style={styles.buttonText}>View</Text>
                  </TouchableOpacity>

                  
                  {confirmDelete === item._id ? (
                    <View style={styles.confirmationButtons}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setConfirmDelete(null)} 
                      >
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() => handleDelete(item._id)} 
                      >
                        <Text style={styles.buttonText}>Confirm Delete</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => setConfirmDelete(item._id)} 
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Create')}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#525B44',
    marginVertical: 10,
  },
  subHeader: {
    fontSize: 14,
    textAlign: 'center',
    color: '#777',
    marginBottom: 20,
  },
  taskContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%', 
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: 280, 
    elevation: 4, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: '#000', 
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'column',
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#9B3922',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    width: '80%',
  },
  detailsButton: {
    backgroundColor: '#F2613F',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    width: '80%',
  },
  deleteButton: {
    backgroundColor: '#0C0C0C',
    padding: 10,
    borderRadius: 8,
    width: '80%',
  },
  confirmationButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: '#F2613F',
    padding: 10,
    borderRadius: 8,
    width: '45%',
  },
  confirmButton: {
    backgroundColor: '#9B3922',
    padding: 10,
    borderRadius: 8,
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#481E14',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    width: '20%',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  noTasksText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginTop: 20,
  },
  error: {
    fontSize: 14,
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
});

export default HomeScreen;
