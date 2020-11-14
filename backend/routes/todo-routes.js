const express = require('express');


const todoController = require('../controllers/todo-controllers');


const router = express.Router();
router.get('/',todoController.getAllTasks );
router.post('/addtask',todoController.addTask );
router.post('/updatetask/:todoId',todoController.updateTask);
router.post('/deletetask/:todoId', todoController.deleteTask);
router.post('/clearalltasks', todoController.clearTasks);

module.exports = router;
