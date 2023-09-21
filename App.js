import React, { useState, useEffect } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TaskComponent from './components/TaskComponent';
import SingleTask from './objects/SingleTask';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const [addingTask, setAddingTask] = useState(false);
  const [deletingLoadingList, setDeletingLoadingList] = useState([]);
  const [completeLoadingList, setCompleteLoadingList] = useState([]);
  const [starLoadingList, setStarLoadingList] = useState([]);
  
  useEffect(() => {
    // Load task data from AsyncStorage when the component mounts
    loadTaskData().then((loadedTasks) => {
      if (loadedTasks.length > 0) {
        setTaskItems(loadedTasks);
      }
    });
  }, []); // Empty dependency array to run only once



  const saveTaskData = async (tasks) => {
    try {
      await AsyncStorage.setItem('taskData', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving task data: ', error);
    }
  };
  
  const loadTaskData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('taskData');
      if (storedData !== null) {
        console.log(JSON.parse(storedData));
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error loading task data: ', error);
    }
    return []; // Return an empty array if there's no stored data
  };
  

  const addTaskWithDelay = async () => {
    return new Promise(async (resolve) => {
      setAddingTask(true); // Start loading
      setTimeout(async () => {
        if (task.trim() !== '') {
          const newTask = new SingleTask(Date.now().toString(), task, false);
          const updatedTasks = [...taskItems, newTask];
          setTaskItems(updatedTasks);
          setTask('');
          deletingLoadingList[newTask.id] = false;
          setDeletingLoadingList(deletingLoadingList);
          completeLoadingList[newTask.id] = false;
          setCompleteLoadingList(completeLoadingList);
  
          // Save the updated tasks to AsyncStorage
          await saveTaskData(updatedTasks);
  
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
        saveTaskData(updatedTasks);
        resolve();
      }, 1000); // 1-second delay
    }).then(result => {
      completeLoadingList[taskId] = false;
      setCompleteLoadingList({ ...completeLoadingList });
      return;
    });

  };

  const starTaskWithDelay = async (taskId) => {

    starLoadingList[taskId] = true;
    setStarLoadingList({ ...starLoadingList });
    const result = await new Promise((resolve) => {
      setTimeout(() => {
        const updatedTasks = taskItems.map((item) => {
          if (item.id === taskId) {
            return { ...item, isStarred: !item.isStarred };
          } else {
            return item;
          }
        });
        setTaskItems(updatedTasks);
        saveTaskData(updatedTasks);
        resolve();
      }, 1000); // 1-second delay
    }).then(result => {
      starLoadingList[taskId] = false;
      setStarLoadingList({ ...starLoadingList });
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
        saveTaskData(updatedTasks);

        resolve();
      }, 1000);
    });
  };

  const sortTasks = (tasks) => {
    // Sort tasks so that starred tasks come first
    const starredTasks = tasks.filter((item) => item.isStarred);
    const unstarredTasks = tasks.filter((item) => !item.isStarred);
    return [...starredTasks, ...unstarredTasks];
  };
  


  const handleAddTask = async () => {
    Keyboard.dismiss();
    await addTaskWithDelay();
  };

  const completeTask = async (taskId) => {
    await completeTaskWithDelay(taskId);
  };

  const starTask = async (taskId) => {
    await starTaskWithDelay(taskId);
  };

  const deleteTask = async (taskId) => {
    await deleteTaskWithDelay(taskId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Görevlerim</Text>
        <View testID="task-component" style={styles.items}>
  {sortTasks(taskItems).map((item) => (
    <TaskComponent
      key={item.id}
      text={item.title}
      isCompleted={item.isCompleted}
      isStarred={item.isStarred}
      onComplete={() => completeTask(item.id)}
      onDelete={() => deleteTask(item.id)}
      onStar={() => starTask(item.id)}
      completingTask={completeLoadingList[item.id]}
      deletingTask={deletingLoadingList[item.id]}
      starringTask={starLoadingList[item.id]}
    />
  ))}
</View>

      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        {/* 0. add some text here for unit testing */}
        <TextInput
          style={styles.input}
          placeholder={'Yeni Görev'}
          onChangeText={text => setTask(text)}
          value={task}
        />
        {/* 1. press on this button to add data to taskItems */}
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
