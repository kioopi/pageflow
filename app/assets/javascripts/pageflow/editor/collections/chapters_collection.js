pageflow.ChaptersCollection = Backbone.Collection.extend({
  model: pageflow.Chapter,

  mixins: [pageflow.orderedCollection],

  url: function() {
    return '/entries/' + pageflow.entry.get('id') + '/chapters';
  },

  comparator: function(chapter) {
    return chapter.get('position');
  },

  updateConfigurations: function(configurationData) {
    var parentModel = this.parentModel;
    var collection = this;

    // keep old configurations to be able to reset after server error
    var oldConfigurations = _.map(configurationData, function(update) {
      return {
        chapter: update.chapter,
        configuration: _.object(_.map(_.keys(update.configuration), function(key) {
          return [key, update.chapter.configuration.get(key)];
        }))
      };
    });

    // prepare data to send to server
    var serverData = _.map(configurationData, function(update) {

      // excute the change without auto-saving to server
      update.chapter.configuration.set(update.configuration, { silent: true });

      return {
        chapterId: update.chapter.id,
        configuration: update.configuration
      };
    });

    collection.trigger('change:configuration');

    // send data to server
    return Backbone.sync('update', parentModel, {
      url: collection.url() + '/update_configurations',
      data: JSON.stringify(serverData),

      success: function(response) {
        // Change was executed before, nothing to do here?
      },

      error: function(jqXHR,  textStatus, errorThrown) {
        // undo changes if server fails
        _.each(oldConfigurations, function(update) {
          update.chapter.configuration.set(update.configuration, { silent: true });
        }, this);
        collection.trigger('change:configuration');

        // TODO: trigger error?
        var error = new pageflow.UpdateConfigurationsFailure(parentModel);
        pageflow.editor.failures.add(error);
      }
    });
  }
});
