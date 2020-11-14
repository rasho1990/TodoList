import React, { useEffect, useState } from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import AddTask from '../pages/AddTask';
import UpdateTask from '../pages/UpdateTask';
import DeleteTask from '../pages/DeleteTask';
import CleanListModal from '../../shared/components/UIElements/CleanListModal'
const TodoList = () => {
  const [t, setT] = useState();
  const [tasks, setTasks] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [todorender, setTodoRender] = useState();
  const updateTodoList = () => {
    setTodoRender(Math.random());
  }
  const [op1, setop1] = useState();
  const [op2, setop2] = useState();
  const [op3, setop3] = useState();
  const [op4, setop4] = useState();
  const addTask = () => {
    setop1(Math.random());
  }
  const clearTasks = () => {
    setop2(Math.random());
  }
  const updateTask = () => {
    setop3(Math.random());
  }
  const deleteTask = () => {
    setop4(Math.random());
  }
  const fetchTasks = async () => {
    const url = "http://localhost:5000/api/todolist";
    try {
      const responseData = await sendRequest(url);
      setTasks(responseData.todolist);
    } catch (err) {
      console.log("Error in fetching tasks!", err);
    }
  };
  // Fetch users before page loads, with empty [] only runs once
  useEffect(() => {
    fetchTasks();
  }, [sendRequest, op1, op2, todorender]);
  return (
    <React.Fragment>
      {error && <ErrorModal error={error} onClear={clearError} />}
      <div class="ui center aligned basic segment">
        <div class="ui teal labeled icon button" onClick={addTask}>
          Create New Task
            <i class="add icon" ></i>
        </div>
        <AddTask changeOnClick={op1} refreshTodo={updateTodoList} />
        <CleanListModal changeOnClick={op2} refreshTodo={updateTodoList}></CleanListModal>
        <UpdateTask changeOnClick={op3} refreshTodo={updateTodoList} oldtask={t} />
        <DeleteTask changeOnClick={op4} refreshTodo={updateTodoList} oldtask={t} />
        <div class="negative ui button teal labeled icon button" onClick={clearTasks}>
          Clear Your List
    <i class="trash icon"></i>
        </div>
      </div>
      <table class="ui celled structured table">
        <thead>
          <tr>
            <th rowspan="4">Task Name</th>
            <th rowspan="4">Priority</th>
            <th rowspan="4">Due Date</th>
            <th rowspan="4">Compelete</th>
            <th rowspan="4">Notes</th>
            <th class="right aligned"> <div class="ui icon input right aligned">
              <input type="text" placeholder="Search..." />
              <i class="search icon"></i>
            </div></th>
          </tr>
        </thead>
        {isLoading && <div class="ui active inverted dimmer">
          <div class="ui text loader">Loading</div>
        </div>}
        <tbody>
          {tasks && <React.Fragment>
            {tasks.map(t => {
              return <tr>
                <td>{t.name}</td>
                <td>{t.priority === '0' ?
                  <i class=" large heart red icon" /> : (t.priority === '1') ? <i class=" large heart yellow icon" /> : <i class=" large heart green icon" />
                }</td>
                <td class="right aligned">{t.date}</td>
                <td class="center aligned">
                  {t.compelete === '0' ? <i class="large green checkmark icon"></i> : (t.compelete === '1') ? <i class="large red close icon"></i> : <i class="large yellow motorcycle icon"></i>}
                </td>
                <td>{t.notes}</td>
                <td class="center aligned"> <div class="ui button teal labeled icon button" onClick={() => {
                  setT(t);
                  return updateTask();
                }} >
                  Edit
                 <i class="large edit icon"></i>
                </div>
                  <div class="negative ui button teal labeled icon button" onClick={() => {
                  setT(t);
                  return deleteTask();
                }}>
                    Delete
    <i class="large trash icon"></i>
                  </div>
                </td>
              </tr>
            })
            }
          </React.Fragment>}
        </tbody>
      </table>
    </React.Fragment>
  );
};
export default TodoList;
