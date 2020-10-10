const Router = require('express').Router;
const multer = require('multer');
const multerConfig = require('./config/multer');
const authMiddleware = require('./app/middlewares/auth');

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const ProfileController = require('./app/controllers/ProfileController');
const FileController = require('./app/controllers/FileController');
const InterestController = require('./app/controllers/InterestController');
const ConnectionController = require('./app/controllers/ConnectionController');

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.create);
routes.post('/session', SessionController.create);

routes.use(authMiddleware);
routes.post('/profile', ProfileController.create);
routes.get('/profile', ProfileController.listAll);
routes.post('/avatar', upload.single('file'), FileController.store);
routes.post('/interest', InterestController.create);
routes.post('/connect', ConnectionController.create);
routes.get('/connect', ConnectionController.list);

module.exports = routes;
