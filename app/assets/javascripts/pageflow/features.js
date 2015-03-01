/**
 *  Let plugins register functions which extend the editor or
 *  slideshow with certain functionality when a named feature is
 *  active.
 */
pageflow.features = {
  /** @api private */
  registry: {},

  /**
   * Use `pageflow.features` has been renamed to `pageflow.browser`.
   * @deprecated
   */
  has: function(/* arguments */) {
    return pageflow.browser.has.apply(pageflow.browser, arguments);
  },

  /**
   * Register a function to configure a feature when it is active.
   *
   * @param scope String  Name of the scope the passed function
   *   shall be called in.
   * @param name String   Name of the feature
   * @param fn Function   Function to call when the given feature
   *   is activate.
   */
  register: function(scope, name, fn) {
    this.registry[scope] = this.registry[scope] || {};
    this.registry[scope][name] = this.registry[scope][name] || [];
    this.registry[scope][name].push(fn);
  },

  /** @api private */
  enable: function(scope, names) {
    var fns = this.registry[scope] || {};

    _(names).each(function(name) {
      _(fns[name] || []).each(function(fn) {
        fn();
      });
    });
  }
};