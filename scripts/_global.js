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
    path: '/new/:tag?',
    data: function () {
      return {
        tag: this.params.tag
      }
    }
  });
  this.route('mixtape', {
    path: '/:tag',
    data: function () {
      return {
        mixtape: Mixtapes.findOne({ tag: this.params.tag })
      };
    }});
});

if (Meteor.isServer) {
  /*
   * Configure Rdio API keys
   */
  ServiceConfiguration.configurations.upsert({
    service: 'rdio'
  }, {
    service: 'rdio',
    consumerKey: 'uq3vzfjq8hng3cc7rr7gx92y',
    secret: process.env['RDIO_SECRET']
  });
}

/*
 * Database models
 */

// Individual song data; ephemeral and unique to Mixtapes
Songs = new Mongo.Collection('songs');

// Mixtapes
Mixtapes = new Mongo.Collection('mixtapes');
