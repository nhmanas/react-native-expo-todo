
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const TaskComponent = (props) => {
    const { text, isCompleted, onComplete, onDelete, completingTask, deletingTask } = props;

    return (
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                {isCompleted ? (
                    <View style={[styles.square, styles.completedSquare]}>
                        {completingTask ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            // <Text testID="complete-button">Sil</Text>
                            <MaterialIcons name="check" size={24} color="#fff" onPress={onComplete} />
                        )}
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.square}
                        onPress={onComplete}
                        disabled={completingTask}
                    >
                        {completingTask ? (
                            <ActivityIndicator size="small" color="#55BCF6" />
                        ) : null}
                    </TouchableOpacity>
                )}
                <Text style={[styles.itemText, { textDecorationLine: isCompleted ? 'line-through' : 'none' }]}>
                    {text}
                </Text>
            </View>
            <TouchableOpacity
                onPress={onDelete}
                disabled={deletingTask}
            >
                {deletingTask ? (
                    <ActivityIndicator size="small" color="#FF4B4B" />
                ) : (
                    // <Text testID="delete-button">Sil</Text>
                    <MaterialIcons name="delete" size={24} color="#FF4B4B" />
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    square: {
        width: 24,
        height: 24,
        backgroundColor: 'transparent',
        borderColor: '#55BCF6',
        borderWidth: 2,
        borderRadius: 5,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        maxWidth: '80%',
    },
    circular: {
        width: 12,
        height: 12,
        borderColor: '#55BCF6',
        borderWidth: 2,
        borderRadius: 5,
    },
    completedSquare: {
        backgroundColor: '#55BCF6',
    },

});

export default TaskComponent;
