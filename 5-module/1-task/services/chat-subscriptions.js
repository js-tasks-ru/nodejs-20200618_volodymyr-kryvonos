const subscriptions = {};
let subscriptionId = 0;

exports.add = (subscription) => {
  subscriptions[subscriptionId] = subscription;

  subscription.ctx.req.on('close', () => {
    exports.remove(subscriptionId);
  });

  return subscriptionId++;
};

exports.remove = (subscriptionId) => {
  delete subscriptions[subscriptionId];
};

exports.each = (callback) => {
  for (let subscriptionId in subscriptions) {
    const subscription = subscriptions[subscriptionId];
    callback(subscription);
  }
};
