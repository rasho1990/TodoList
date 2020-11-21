import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import AddTask from '../pages/AddTask';
import UpdateTask from '../pages/UpdateTask';
import DeleteTask from '../pages/DeleteTask';
import { useDebounce } from '../../shared/hooks/debounce-hook';
import CleanListModal from '../../shared/components/UIElements/CleanListModal'
const TodoList = () => {
  const auth = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [t, setT] = useState();
  const [tasks, setTasks] = useState();
  const [results, setResults] = useState([]);
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
      setTasks(responseData.todolist.filter(todo => todo.creator === auth.userId))
    } catch (err) { }
  };
  // Fetch users before page loads, with empty [] only runs once
  useEffect(() => {
    fetchTasks();
  }, [sendRequest, op1, op2, todorender]);

  const SearchTodos = () => {
    // State and setter for search term
    
    // State and setter for search results
    // const [results, setResults] = useState([]);
    // State for search status (whether there is a pending API request)
    const [isSearching, setIsSearching] = useState(false);

    // Now we call our hook, passing in the current searchTerm value.
    // The hook will only return the latest value (what we passed in) ...
    // ... if it's been more than 500ms since it was last called.
    // Otherwise, it will return the previous value of searchTerm.
    // The goal is to only have the API call fire when user stops typing ...
    // ... so that we aren't hitting our API rapidly.
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Here's where the API call happens
    // We use useEffect since this is an asynchronous action
    useEffect(
      () => {
        // Make sure we have a value (user has entered something in input)
        if (debouncedSearchTerm) {
          // Set isSearching state
          setIsSearching(true);
          // Fire off our API call
          searchCharacters(debouncedSearchTerm)
          // Set back to false since request finished
          setIsSearching(false);
          // Set results state
          setResults(searchCharacters(debouncedSearchTerm));
        } else {
          setResults([]);
        }
      },
      // This is the useEffect input array
      // Our useEffect function will only execute if this value changes ...
      // ... and thanks to our hook it will only change if the original ...
      // value (searchTerm) hasn't changed for more than 500ms.
      [debouncedSearchTerm]
    );

    // Pretty standard UI with search input and results
    return (<div className="ui icon input right aligned">
      <input type="text" placeholder="Search by name or notes" onChange={e => setSearchTerm(e.target.value)} />
      <i className="search icon"></i>
    </div>);
  }
  const searchCharacters = (search) => {
    let searchedTasks = tasks.filter(task => task.notes.toLowerCase().includes(search.toLowerCase()) || task.name.toLowerCase().includes(search.toLowerCase()))
    return searchedTasks
  }
  const renderTodoListOrSearched=()=>{

    if (results.length===0)
    return tasks
    else
    return results
  }
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
            <th className="right aligned">
              {SearchTodos()}
            </th>
          </tr>
        </thead>
        {isLoading && <div className="ui active inverted dimmer">
          <div className="ui text loader">Loading</div>
        </div>}
        <tbody>
          {tasks && <React.Fragment>
            {renderTodoListOrSearched().map(task => {
              return <tr>
                <td>{task.name}</td>
                <td>{task.priority === '0' ?
                  <i className=" large heart red icon" /> : (task.priority === '1') ? <i className=" large heart yellow icon" /> : <i className=" large heart green icon" />
                }</td>
                <td className="right aligned">{task.date}</td>
                <td className="center aligned">
                  {task.complete === '0' ? <i className="large green checkmark icon"></i> : (task.complete === '1') ? <i className="large red close icon"></i> : <i className="large yellow motorcycle icon"></i>}
                </td>
                <td>{task.notes}</td>
                <td className="center aligned"> <div className="ui button teal labeled icon button" onClick={() => {
                  setT(task);
                  return updateTask();
                }} >
                  Edit
                 <i className="large edit icon"></i>
                </div>
                  <div className="negative ui button teal labeled icon button" onClick={() => {
                    setT(task);
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
