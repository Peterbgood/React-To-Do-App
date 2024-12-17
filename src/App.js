import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiEdit, BiTrash, BiReset } from 'react-icons/bi';

function App() {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [editing, setEditing] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  const [dragging, setDragging] = useState(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (editInputRef.current && editing !== null) {
      editInputRef.current.focus();
    }
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  const handleEdit = (index) => {
    setEditing(index);
    setEditedTask(tasks[index]);
  };

  const handleSave = (index) => {
    setTasks(tasks.map((task, i) => i === index ? editedTask : task));
    setEditing(null);
  };

  const handleKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      handleSave(index);
    }
  };

  const handleDelete = (index) => {
    setTasks(tasks.filter((task, i) => i !== index));
  };

  const handleReset = () => {
    setTasks([]);
  };

  const handleDragStart = (e, index) => {
    setDragging(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    const newTasks = [...tasks];
    const task = newTasks.splice(dragging, 1)[0];
    newTasks.splice(index, 0, task);
    setTasks(newTasks);
    setDragging(null);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">To-Do</h1>
      <h1 className="text-center mb-4">To-Do List</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task"
          />
          <button type="submit" className="btn btn-primary">Add</button>
        </div>
      </form>
      <ul className="list-group">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            {editing === index ? (
              <input
                ref={editing === index ? editInputRef : null}
                type="text"
                className="form-control"
                value={editedTask}
                onChange={(e) => setEditedTask(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ) : (
              <span>{task}</span>
            )}
            <div>
              {editing === index ? (
                <button type="button" className="btn btn-secondary me-2" onClick={() => setEditing(null)}><BiReset className="icon svg-icon" /></button>
              ) : (
                <button type="button" className="btn btn-primary me-2" onClick={() => handleEdit(index)}><BiEdit className="icon svg-icon" /></button>
              )}
              <button type="button" className="btn btn-danger" onClick={() => handleDelete(index)}><BiTrash className="icon" /></button>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn-danger w-100 mt-3" onClick={handleReset}><BiReset className="icon" /> Reset</button>
    </div>
  );
}

export default App;
