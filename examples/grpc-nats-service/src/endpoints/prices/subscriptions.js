let subscriptions = [];

module.exports = {
  create: (contextId, referenceId) => {
    subscriptions.push({contextId, referenceId});
  },
  remove: (contextId, referenceId) => {
    subscriptions = subscriptions.filter((s) => {
      return s.contextId !== contextId && s.referenceId !== referenceId
    });
  },
  exists: (contextId, referenceId) => {
    return !!subscriptions.find((s) => {
      return s.contextId === contextId && s.referenceId === referenceId
    })
  }
};