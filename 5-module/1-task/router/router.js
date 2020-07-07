const Router = require('koa-router');
const router = new Router();
const chatController = require('../controllers/chat');

router.get('/subscribe', chatController.subscribe);
router.post('/publish', chatController.publishMessage);

module.exports = router;

