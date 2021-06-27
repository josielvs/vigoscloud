const { Router } = require('express');
const { conndb } = require('../config');
const { loginModel } = require('../models');
const { loginController } = require('../controllers');

const loginRoutes = Router();

const users = loginModel.factory(conndb);

const readUsersMiddleware = loginController.signIn(users);
loginRoutes.post('/', readUsersMiddleware);

const createMiddleware = loginController.signUp(users);
loginRoutes.post('/register', createMiddleware);

// loginRoutes.put('/register', loginController.updateUser);

module.exports = loginRoutes;
