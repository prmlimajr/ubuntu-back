const Router = require('express').Router;
const multer = require('multer');
const multerConfig = require('./config/multer');
const authMiddleware = require('./app/middlewares/auth');

const UserController = require('./app/controllers/UserController');

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.create);

module.exports = routes;
