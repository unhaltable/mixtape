/*
 * Mixtape has three views:
 *
 * - Home page: buttons for joining a mixtape and creating a mixtape
 *   - Create page: sign into Rdio and name your mixtape
 * - Mixtape page: view the mixtape playlist and vote/veto songs
 */
Router.map(function() {
  this.route('home', { path: '/' });
  this.route('new', {
    path: '/new/:tag',
    data: function () {
      return {
        tag: this.params.tag
      }
    }
  });
  this.route('mixtape', {
    path: '/:tag',
    data: function () {
      return Mixtapes.findOne({ tag: this.params.tag })
    }});
});
