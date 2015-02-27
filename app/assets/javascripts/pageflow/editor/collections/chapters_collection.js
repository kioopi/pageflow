
pageflow.ChaptersCollection = Backbone.Collection.extend({
  model: pageflow.Chapter,

  mixins: [pageflow.orderedCollection],

  url: function() {
    return '/entries/' + pageflow.entry.get('id') + '/chapters';
  },

  comparator: function(chapter) {
    return chapter.get('position');
  },

  batchUpdate: function(configurationData) {
    var parentModel = this.parentModel;
    var collection = this;

    var revert = this._getRevertFunc(configurationData);

    // prepare data to send to server
    var serverData = _.map(configurationData, function(update) {
      // excute the change without auto-saving to server
      update.chapter.configuration.set(update.configuration, { silent: true });

      return _.pick(update, ['chapterId', 'configuration']);
    });

    collection.trigger('change:configuration');

    // send data to server
    return Backbone.sync('update', parentModel, {
      url: collection.url() + '/batch_update',
      data: JSON.stringify(serverData),

      success: function(response) {
        // Change was executed before, nothing to do here?
      },

      error: function(jqXHR,  textStatus, errorThrown) {
        // undo changes if server fails
        revert();
        collection.trigger('change:configuration');

        // TODO: trigger error?
        var error = new pageflow.UpdateConfigurationsFailure(parentModel);
        pageflow.editor.failures.add(error);
      }
    });
  },

  _getRevertFunc: function(configurationData) {
    // keep old configurations to be able to reset after server error
    var oldConfigurations = _.map(configurationData, function(update) {
      return {
        chapter: update.chapter,
        configuration: update.chapter.configuration.pick(_.keys(update.configuration))
      };
    });

    return function() {
      _.each(oldConfigurations, function(update) {
        update.chapter.configuration.set(update.configuration, { silent: true });
      }, this);
    };
  }

});


