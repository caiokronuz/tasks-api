import bodyParser from 'body-parser';
import express from 'express';

import UserController from './controllers/userController.js';
import TasksController from './controllers/TasksController.js';
import { verifyAuth } from './middlewares/auth.js';

const routes = express.Router();
routes.use(bodyParser.json())

const userController = new UserController();
const tasksController = new TasksController();

//Authentication
routes.post('/register', userController.create)
routes.post('/login', userController.login)
routes.put('/update_password', verifyAuth, userController.update);

//CRUD Tasks
routes.post('/tasks', verifyAuth, tasksController.create);
routes.get('/tasks', verifyAuth, tasksController.index);
routes.get('/tasks/:id', verifyAuth, tasksController.indexTask);
routes.put('/tasks/:id', verifyAuth, tasksController.update);
routes.delete('/tasks/:id', verifyAuth, tasksController.delete);

export default routes;