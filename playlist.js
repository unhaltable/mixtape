Router.map(function() {
  this.route('home', {path: '/'});
  this.route('mixtape');
});

if (Meteor.isServer) {
  function getUserRdio() {
    var user = Meteor.user();
    if (!user) return "No user";

    var rdio = Rdio.forUser(user);
    if (!rdio) return "No Rdio creadentials";
    return rdio;
  }

  Meteor.methods({
    getPlaybackToken: function () {
      return getUserRdio().call('getPlaybackToken', {domain: 'localhost'});
    },

    rdioCall: function (method, params) {
      var user = Meteor.user();
      if (!user) return "No user";

      var rdio = Rdio.forUser(user);
      if (!rdio) return "No Rdio creadentials";
      return rdio.call(method, params);
    },

    foo: function () {
      return 'foo';
    }
  });

  Meteor.startup(function () {
    // code to run on server at startup
  });
}

if (Meteor.isClient) {
  var deferred = Q.defer();
  var playbackToken;

  Meteor.call('getPlaybackToken', function (error, result) {
    playbackToken = result;
    deferred.resolve();
  });

  Template.songs.songs = function () {
    return Songs.find({}, { sort: { upvotes: -1}});
  };

  Template.songs.events({
    'click input': function () {
      Songs.update(this._id, {$inc: {upvotes: 1}});
    }
  });

  Template.add_song.events({
    'click input': function () {
      var song_title = document.getElementById('new_song_title');
      var song_artist = document.getElementById('new_song_artist');

        if (new_song_title.value != '' && new_song_artist.value != '') {
            Songs.insert({
            name: song_title.value,
            artist: song_artist.value,
            upvotes: 0
          });
      
        document.getElementById('new_song_title').value = '';
        document.getElementById('new_song_artist').value = '';
        song_title.value = '';
        song_artist.value = '';
      }
    }
  });

  Template.mixtape.rendered = function () {
    deferred.promise.then(function () {
      var $nowPlaying = $('#now-playing');
      $nowPlaying.bind('ready.rdio', function() {
        $(this).rdio().play('a171827');
      });
      $nowPlaying.rdio(playbackToken);
    });
  };

}
