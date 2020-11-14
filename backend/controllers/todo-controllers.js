const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Todo = require('../models/todoList')
const User = require('../models/user')
const getAllTasks = async (req, res, next) => {

    let tasks;
    try {
        tasks = await Todo.find({});
    } catch (err) {
        const error = new HttpError(
            'Fetching user failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({ todolist: tasks.map(task => task.toObject({ getters: true })) });


}
const addTask = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        next(new HttpError('The input is incorrect!'));
    }

    const { name, priority, date, notes, compelete, userId } = req.body;
    const createdTodo = new Todo({
        name: name,
        priority: priority,
        date: date,
        notes: notes,
        compelete: compelete,
        creator: userId,
    });

    let user;
    // Store todo in User
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError('Something went wrong, can not find task', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find task with provided id.', 404);
        return next(error);
    }

    try {
        
        const session = await mongoose.startSession();
        session.startTransaction(); 
        await createdTodo.save({ session });
        user.todos.push(createdTodo); 
        await user.save({ session });
        await session.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Failed to create new task, make sure to fill in all the fields correctly!',
            500
        );
        return next(error);
    }

    const modifiedTodo = createdTodo.toObject({ getters: true });
    res.status(201).json(modifiedTodo);


}
const updateTask = async (req, res, next) => {
    console.log('got an update request')
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        const error = new HttpError('The input is incorrect!');
        return next(error);
    }
    const { name, priority, date, notes, compelete, userId } = req.body;
    const { todoId } = req.params;

    let todo;
    try {
        todo = await Todo.findById(todoId);

    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update the task.',
            500
        );
        return next(error);
    }
    
    if (todo.creator.toString() !== userId) {
        const error = new HttpError('You are not allowed to edit this task!', 401);
        return next(error);
    }

    todo.name = name;
    todo.priority = priority;
    todo.date = date;
    todo.notes = notes;
    todo.compelete = compelete;

    try {
        await todo.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update task.',
            500
        );
        return next(error);
    }

    const modifiedPlace = todo.toObject({ getters: true });

    res.status(200).json(modifiedPlace);


}
const deleteTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        const error = new HttpError('The input is incorrect!');
        return next(error);
    }
    const { userId } = req.body
    const { todoId } = req.params;
    let todo;
    try {
        todo = await Todo.findById(todoId).populate('creator'); 
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete task.',
            500
        );
        return next(error);
    }
    if (!todo) {
        const error = new HttpError('task does not exist!');
        return next(error);
    }
    if (todo.creator.id !== userId) {
        const error = new HttpError(
            'You are not allowed to delete this task!',
            401
        );
        next(error);
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await todo.remove({ session });
        todo.creator.todos.pull(todo); // Mongoose method that removes objectId
        await todo.creator.save({ session });
        await session.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete task.',
            500
        );
        return next(error);
    }

    res.status(200).json({ msg: 'task successfully deleted!' });

}
const clearTasks = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        const error = new HttpError('The input is incorrect!');
        return next(error);
    }
    const { userId } = req.body


    let todo;
    try {
        todo = await Todo.find(); // Add User document
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete task.',
            500
        );
        return next(error);
    }

    if (!todo) {
        const error = new HttpError('task does not exist!');
        return next(error);
    }


    let user;
    try {
        user = await User.findById(userId); // Add User document
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete task.',
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError('User does not exist!');
        return next(error);
    }
    if (todo.length===0) {
        const error = new HttpError('Todo is empty !',404);
        return next(error);
    }
    let i=0;
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        while(i<todo.length){
            await todo[i].remove({ session });
            i++;
        };
        user.todos = user.todos.filter(() => 1 != 1); // Mongoose method that removes objectId (all tasks from toDolist of user)
        await user.save({ session });
        await session.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete task.',
            500
        );
        return next(error);
    }
    
    res.status(200).json({ msg: 'Tasks successfully deleted!' });


}
exports.getAllTasks = getAllTasks;
exports.addTask = addTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
exports.clearTasks = clearTasks;