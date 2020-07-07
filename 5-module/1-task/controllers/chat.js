const chatSubscriptions = require('../services/chat-subscriptions');

module.exports = {
  subscribe(ctx, next) {
    return new Promise((resolve, reject) => {
      const subscriptionId = chatSubscriptions.add({
        ctx,
        promiseCallback: { resolve, reject }
      });
    });
  },

  publishMessage(ctx, next) {
    ctx.response.status = 200;
    ctx.response.body = '';

    const reqBody = ctx.request.body;
    if (!reqBody.message) {
      return;
    }

    publishMessageToAllSubscribers(ctx.request.body.message);
  }
};

function publishMessageToAllSubscribers(message) {
  chatSubscriptions.each(subscription => {
    subscription.ctx.response.body = message;
    subscription.promiseCallback.resolve();
  });
}

