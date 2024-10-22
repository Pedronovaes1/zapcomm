import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles({
  root: {
    marginTop: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '2rem',
    position: 'relative',
  },
  title: {
    position: 'relative',
    bottom: '1.2rem',
    right: '43rem',
    fontSize: '30px',
    fontWeight: 'bold',
  },
  inputContainer: {
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'center',
    width: '55%',
    borderWidth: '5%',
    padding: '5%',
    margin: '0 auto 1rem',
  },
  input: {
    flexGrow: 1,
    marginRight: '1rem',
  },
  createButton: {
    fontSize: '14px',
    textTransform: 'capitalize',
    fontWeight: 'bold',
    width: '184.851px',
    height: '41px',
    marginTop: '5px',
    marginLeft: '12px',
    borderRadius: '10px',
    backgroundColor: '#00c88c',
    color: 'black',
    '&:hover': {
      backgroundColor: '#00b07b',
    },
  },
  listContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.1)',
    padding: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 1rem',
    fontWeight: 'bold',
    backgroundColor: 'white',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '10px',
    border: '1px solid #D3D3D3',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: 'white',
  },
  taskText: {
    flex: 1,
    textAlign: 'center'
  },
  taskDate: {
    flex: 1,
    textAlign: 'center',
  },
  taskActions: {
    flex: 1,
    textAlign: 'center'
  },
  iconButton: {
    color: '#333',
  },
});

const ToDoList = () => {
  const classes = useStyles();

  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskChange = (event) => {
    setTask(event.target.value);
  };

  const handleAddTask = () => {
    if (!task.trim()) {
      return;
    }

    const now = new Date();
    if (editIndex >= 0) {
      const newTasks = [...tasks];
      newTasks[editIndex] = { text: task, updatedAt: now, createdAt: newTasks[editIndex].createdAt };
      setTasks(newTasks);
      setTask('');
      setEditIndex(-1);
    } else {
      setTasks([...tasks, { text: task, createdAt: now, updatedAt: now }]);
      setTask('');
    }
  };

  const handleEditTask = (index) => {
    setTask(tasks[index].text);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  return (
    <div className={classes.root}>
      <h1 className={classes.title}>Tarefas</h1>
      <div className={classes.listContainer}>
        <div className={classes.inputContainer}>
          <TextField
            className={classes.input}
            label="Nova tarefa"
            value={task}
            onChange={handleTaskChange}
            variant="outlined"
          />
          <Button
            className={classes.createButton}
            variant="contained"
            onClick={handleAddTask}
          >
            {editIndex >= 0 ? 'Salvar' : 'Criar Tarefa'}
          </Button>
        </div>
        <div className={classes.header}>
          <span className={classes.taskDate}>Data</span>
          <span className={classes.taskText}>Nome da Tarefa</span>
          <span className={classes.taskActions}>Ações</span>
        </div>
        <List>
          {tasks.map((task, index) => (
            <ListItem key={index} className={classes.listItem}>
              <div className={classes.taskDate}>
                {task.updatedAt.toLocaleDateString()}
              </div>
              <div className={classes.taskText}>
                {task.text}
              </div>
              <div className={classes.taskActions}>
                <IconButton
                  className={classes.iconButton}
                  onClick={() => handleEditTask(index)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  className={classes.iconButton}
                  onClick={() => handleDeleteTask(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default ToDoList;
