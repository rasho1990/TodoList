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
  
  // It's hard to understand what is op and setop. Can be optionOne, setOptionOne
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
      <div className="ui center aligned basic segment">
        <div className="ui teal labeled icon button" onClick={addTask}>
          Create New Task
            <i className="add icon" ></i>
        </div>
        <AddTask changeOnClick={op1} refreshTodo={updateTodoList} />
        <CleanListModal changeOnClick={op2} refreshTodo={updateTodoList}></CleanListModal>
        <UpdateTask changeOnClick={op3} refreshTodo={updateTodoList} oldtask={t} />
        <DeleteTask changeOnClick={op4} refreshTodo={updateTodoList} oldtask={t} />
        <div className="negative ui button teal labeled icon button" onClick={clearTasks}>
          Clear Your List
    <i className="trash icon"></i>
        </div>
      </div>
      <table className="ui celled structured table">
        <thead>
          <tr>
            <th rowSpan="4">Task Name</th>
            <th rowSpan="4">Priority</th>
            <th rowSpan="4">Due Date</th>
            <th rowSpan="4">Complete</th>
            <th rowSpan="4">Notes</th>
            <th className="right aligned"> <div className="ui icon input right aligned">
              <input type="text" placeholder="Search..." />
              <i className="search icon"></i>
            </div></th>
          </tr>
        </thead>
        {isLoading && <div className="ui active inverted dimmer">
          <div className="ui text loader">Loading</div>
        </div>}
        <tbody>
          {tasks && <React.Fragment>
            {tasks.map(t => {
              return <tr>
                <td>{t.name}</td>
                <td>{t.priority === '0' ?
                  <i className=" large heart red icon" /> : (t.priority === '1') ? <i className=" large heart yellow icon" /> : <i className=" large heart green icon" />
                }</td>
                <td className="right aligned">{t.date}</td>
                <td className="center aligned">
                  {t.complete === '0' ? <i className="large green checkmark icon"></i> : (t.complete === '1') ? <i className="large red close icon"></i> : <i className="large yellow motorcycle icon"></i>}
                </td>
                <td>{t.notes}</td>
                <td className="center aligned"> <div className="ui button teal labeled icon button" onClick={() => {
                  setT(t);
                  return updateTask();
                }} >
                  Edit
                 <i className="large edit icon"></i>
                </div>
                  <div className="negative ui button teal labeled icon button" onClick={() => {
                  setT(t);
                  return deleteTask();
                }}>
                    Delete
                  <i className="large trash icon"></i>
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
