import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Task } from '../App';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, toggleTaskCompletion, deleteTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
        <p className="text-gray-600 dark:text-gray-400">No tasks yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Tasks</h2>
      
      <Droppable droppableId="tasks">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3"
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskItem
                      task={task}
                      toggleTaskCompletion={toggleTaskCompletion}
                      deleteTask={deleteTask}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskList; 