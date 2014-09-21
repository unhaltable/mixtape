var mixtape;

if (Meteor.isServer) {
  function getHostRdio() {
    var user = Meteor.user();
    if (!user) return "No user";

    var rdio = Rdio.forUser(user);
    if (!rdio) return "No Rdio creadentials";
    return rdio;
  }

  Meteor.methods({
    getPlaybackToken: function () {
      return getHostRdio().call('getPlaybackToken', {domain: 'localhost'});
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
  var playbackToken;

  var duration = 1; // track the duration of the currently playing track
  $(document).ready(function() {
    $('#api').bind('ready.rdio', function() {
      $(this).rdio().play('a171827');
    });
    $('#api').bind('playingTrackChanged.rdio', function(e, playingTrack, sourcePosition) {
      if (playingTrack) {
        duration = playingTrack.duration;
        $('#art').attr('src', playingTrack.icon);
        $('#track').text(playingTrack.name);
        $('#album').text(playingTrack.album);
        $('#artist').text(playingTrack.artist);
      }
    });
    $('#api').bind('positionChanged.rdio', function(e, position) {
      $('#position').css('width', Math.floor(100*position/duration)+'%');
    });
    $('#api').bind('playStateChanged.rdio', function(e, playState) {
      if (playState == 0) { // paused
        $('#play').show();
        $('#pause').hide();
      } else {
        $('#play').hide();
        $('#pause').show();
      }
    });
    // this is a valid playback token for localhost.
    // but you should go get your own for your own domain.
    $('#api').rdio('GAlUHeu5AD6RSnVxM3Z6ZmpxOGhuZzNjYzdycjdneDkyeWxvY2FsaG9zdH02VwM26Tq25vHhyoOD6fg=');

    $('#previous').click(function() { $('#api').rdio().previous(); });
    $('#play').click(function() { $('#api').rdio().play(); });
    $('#pause').click(function() { $('#api').rdio().pause(); });
    $('#next').click(function() { $('#api').rdio().next(); });
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
    mixtape = Router.current().data().mixtape;

    Meteor.call('getPlaybackToken', function (error, result) {
      playbackToken = result;
      var $nowPlaying = $('#now-playing');
      $nowPlaying.bind('ready.rdio', function() {
        $(this).rdio().play('a171827');
      });
      $nowPlaying.rdio(playbackToken);
    });
  };

}
