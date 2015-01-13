pageflow.DomOrderScrollNavigator = function(slideshow, configurations) {
  this.back = function(currentPage, configuration) {
    slideshow.goTo(currentPage.prev('.page'), {position: 'bottom'});
  };

  this.next = function(currentPage, configuration) {
    slideshow.goTo(currentPage.next('.page'));
  };
};
