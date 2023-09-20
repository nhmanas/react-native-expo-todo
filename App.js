import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TaskComponent from './components/TaskComponent';
import SingleTask from './objects/SingleTask';
import { ActivityIndicator } from 'react-native';

export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const [addingTask, setAddingTask] = useState(false);
  const [deletingLoadingList, setDeletingLoadingList] = useState([]);
  const [completeLoadingList, setCompleteLoadingList] = useState([]);


  const addTaskWithDelay = () => {
    return new Promise((resolve) => {
      setAddingTask(true); // Start loading
      setTimeout(() => {
        if (task.trim() !== '') {
          const newTask = new SingleTask(Date.now().toString(), task, false);
          setTaskItems([...taskItems, newTask]);
          setTask('');
          deletingLoadingList[newTask.id] = false;
          setDeletingLoadingList(deletingLoadingList)
          completeLoadingList[newTask.id] = false;
          setCompleteLoadingList(completeLoadingList)
          resolve();
        }
        setAddingTask(false); // Stop loading
      }, 1000); // 1-second delay
    });
  };

  const completeTaskWithDelay = async (taskId) => {

    completeLoadingList[taskId] = true;
    setCompleteLoadingList({ ...completeLoadingList });
    const result = await new Promise((resolve) => {
      setTimeout(() => {
        const updatedTasks = taskItems.map((item) => {
          if (item.id === taskId) {
            return { ...item, isCompleted: !item.isCompleted };
          } else {
            return item;
          }
        });
        setTaskItems(updatedTasks);
        resolve();
      }, 1000); // 1-second delay
    }).then(result => {
      completeLoadingList[taskId] = false;
      setCompleteLoadingList({ ...completeLoadingList });
      return;
    });

  };
  const deleteTaskWithDelay = async (taskId) => {
    deletingLoadingList[taskId] = true;
    setDeletingLoadingList({ ...deletingLoadingList });

    await new Promise((resolve) => {
      setTimeout(() => {
        const updatedTasks = taskItems.filter((item) => item.id !== taskId);
        setTaskItems(updatedTasks);
        resolve();
      }, 1000);
    });
  };


  const handleAddTask = async () => {
    Keyboard.dismiss();
    await addTaskWithDelay();
  };

  const completeTask = async (taskId) => {
    await completeTaskWithDelay(taskId);
  };

  const deleteTask = async (taskId) => {
    await deleteTaskWithDelay(taskId);
  };

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
              completingTask={completeLoadingList[item.id]} // Pass completingTask as a prop
              deletingTask={deletingLoadingList[item.id]} // Pass deletingTask as a prop
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
          placeholder={'Yeni Görev'}
          onChangeText={text => setTask(text)}
          value={task}
        />
        <TouchableOpacity
          onPress={() => handleAddTask()}
          disabled={addingTask} // Disable button while loading
        >
          <View style={styles.addWrapper}>
            {addingTask ? (
              <ActivityIndicator size="small" color="#55BCF6" />
            ) : (
              <Text style={styles.addText}>+</Text>
            )}
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
