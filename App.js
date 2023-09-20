import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TaskComponent from './components/TaskComponent';
import SingleTask from './objects/SingleTask'

export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);

  const handleAddTask = () => {
    Keyboard.dismiss();
    if (task.trim() !== '') {
      const newTask = new SingleTask(Date.now().toString(), task, false);
      setTaskItems([...taskItems, newTask]);
      setTask('');
    }
  }

  const completeTask = (taskId) => {
    const updatedTasks = taskItems.map((item) => {
      if (item.id === taskId) {
        return { ...item, isCompleted: !item.isCompleted };
      } else {
        return item;
      }
    });
    setTaskItems(updatedTasks);
  }

  const deleteTask = (taskId) => {
    const updatedTasks = taskItems.filter((item) => item.id !== taskId);
    setTaskItems(updatedTasks);
  }

  return (
    <View style={styles.container}>
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Görevlerim</Text>
        <View style={styles.items}>
          {taskItems.map((item) => (
            <TaskComponent
              key={item.id}
              text={item.title}
              isCompleted={item.isCompleted}
              onComplete={() => completeTask(item.id)}
              onDelete={() => deleteTask(item.id)}
            />
          ))}
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder={'New task'}
          onChangeText={text => setTask(text)}
          value={task}
        />
        <TouchableOpacity onPress={() => handleAddTask()} >
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 30
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 60,
    borderColor: '#c0c0c0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#c0c0c0',
    borderWidth: 1
  },
  addText: {}
});
