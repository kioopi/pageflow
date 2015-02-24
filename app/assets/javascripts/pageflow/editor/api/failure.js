/**
 * pageflow.Failure and subclasses are used in the failures api.
 *
 * Subclasses that represent failures that are can not be retried should
 * override `catRetry` with false.
 * Retryable failures should implement `retryAction`.
 */
pageflow.Failure = pageflow.Object.extend({
  canRetry: true,
  type: 'Failure',

  initialize: function(model) {
    this.model = model;
  },

  retry: function() {
    if (this.canRetry) {
      return this.retryAction();
    }
  },

  retryAction: function() {
    return this.model.save();
  },

  key: function() {
    return this.model.cid + '-' + this.type;
  }
});

/**
 * SavingFailure represents a unsuccessful attempt to save
 * a model on the server.
 */
pageflow.SavingFailure = pageflow.Failure.extend({
  type: 'SavingFailure'
});

/**
 *  OrderingFailure represent a unsuccessful attempt to save
 *  the ordering of a pageflow.orderedCollection.
 */
pageflow.OrderingFailure = pageflow.Failure.extend({
  type: 'OrderingFailure',

  initialize: function(model, collection) {
    pageflow.Failure.prototype.initialize.call(this, model);
    this.collection = collection;
  },

  retryAction: function() {
    return this.collection.saveOrder();
  }
});

pageflow.UpdateConfigurationsFailure = pageflow.Failure.extend({
  type: 'UpdateConfigurationsFailure',
  canRetry: false
});
