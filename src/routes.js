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
const FeedController = require('./app/controllers/FeedController');
const ReplyController = require('./app/controllers/ReplyController');

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.create);
routes.post('/session', SessionController.create);

routes.use(authMiddleware);
routes.post('/profile', ProfileController.create);
routes.get('/profile', ProfileController.listAll);
routes.post('/avatar', upload.single('file'), FileController.store);
routes.get('/avatar', FileController.list);
routes.post('/interest', InterestController.create);
routes.get('/interest', InterestController.list);
routes.post('/connect', ConnectionController.create);
routes.get('/connect', ConnectionController.list);
routes.post('/comment', FeedController.create);
routes.get('/comment', FeedController.list);
routes.post('/reply', ReplyController.create);
routes.get('/reply/:id', ReplyController.list);

module.exports = routes;
