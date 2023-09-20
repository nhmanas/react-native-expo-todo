
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskComponent from './components/TaskComponent';
import App from './App';

describe('TaskComponent', () => {

    it('renders without crashing', () => {
        const { getByText } = render(<App />);
        const sectionTitle = getByText('Görevlerim');
        expect(sectionTitle).toBeTruthy();
      });
      
      it('should update the text input value and trigger handleAddTask when clicking the add button', () => {
        const { getByPlaceholderText, getByText } = render(<App />);
    
        const textInput = getByPlaceholderText('Yeni Görev');
        const addButton = getByText('+');
    
        fireEvent.changeText(textInput, 'New Task');
    
        expect(textInput.props.value).toBe('New Task');
    
        fireEvent.press(addButton);
      });

  it('renders the component', () => {
    const { getByTestId } = render(
      <TaskComponent
        text="Sample Task"
        isCompleted={false}
        onComplete={() => {}}
        onDelete={() => {}}
        completingTask={false}
        deletingTask={false}
      />
    );
    const deleteButton = getByTestId('delete-button');
    
    expect(deleteButton).toBeTruthy();
  });

  it('calls the delete callback when the delete button is pressed', () => {
    const deleteCallback = jest.fn();
    const { getByTestId } = render(
      <TaskComponent
        text="Sample Task"
        isCompleted={false}
        onComplete={() => {}}
        onDelete={deleteCallback}
        completingTask={false}
        deletingTask={false}
      />
    );
    const deleteButton = getByTestId('delete-button');
    
    fireEvent.press(deleteButton);

    expect(deleteCallback).toHaveBeenCalledTimes(1);
  });
});
