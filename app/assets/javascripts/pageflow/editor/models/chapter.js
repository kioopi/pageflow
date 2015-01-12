pageflow.Chapter = Backbone.Model.extend({
  modelName: 'chapter',
  paramRoot: 'chapter',
  i18nKey: 'pageflow/chapter',

  mixins: [pageflow.failureTracking, pageflow.delayedDestroying],

  initialize: function(attributes, options) {
    this.pages = new pageflow.ChapterPagesCollection({
      pages: options.pages || pageflow.pages,
      chapter: this
    });

    this.listenTo(this, 'change:title', function() {
      this.save();
    });

    return attributes;
  },

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : '/chapters';
  },

  addPage: function(options) {
    options = options || {};

    return this.pages.create({
      chapter_id: this.get('id'),
      position: this.pages.length
    });
  },

  destroy: function() {
    this.destroyWithDelay();
  }
});