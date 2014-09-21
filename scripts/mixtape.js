if (Meteor.isServer) {
  function getHostRdio() {
    var user = Meteor.user();
    if (!user) return "No user";
    var rdio = Rdio.forUser(user);
    if (!rdio) return "No Rdio credentials";
    return rdio;
  }

  Meteor.methods({
    getPlaybackToken: function () {
      return getHostRdio().call('getPlaybackToken', {domain: 'localhost'});
    },

    rdioCall: function (method, params) {
      return getHostRdio().call(method, params);
    }
  });

}

if (Meteor.isClient) {

  Session.setDefault('mixtapeId', null);

  var mixtapesHandle = Meteor.subscribe('mixtapes', function () {
    Meteor.call('getPlaybackToken', function (error, result) {
      var playbackToken = result;
      var $nowPlaying = $('#now-playing');

      $nowPlaying.bind('ready.rdio', function () {
        // Rdio widget is ready
        $(this).rdio().play('t22410658');
      });

      $nowPlaying.bind('playingTrackChanged.rdio', function (e, playingTrack, sourcePosition) {
        if (playingTrack) {
          duration = playingTrack.duration;
          $('#art').attr('src', playingTrack.icon);
          $('#track').text(playingTrack.name);
          $('#album').text(playingTrack.album);
          $('#artist').text(playingTrack.artist);
        }
      });
      $nowPlaying.bind('positionChanged.rdio', function (e, position) {
        $('#position').css('width', Math.floor(100 * position / duration) + '%');
      });
      $nowPlaying.bind('playStateChanged.rdio', function (e, playState) {
        if (playState == 0) { // paused
          $('#play').show();
          $('#pause').hide();
        } else {
          $('#play').hide();
          $('#pause').show();
        }
      });

      $nowPlaying.rdio(playbackToken);

      $('#previous').click(function () {
        $('#api').rdio().previous();
      });
      $('#play').click(function () {
        $('#api').rdio().play();
      });
      $('#pause').click(function () {
        $('#api').rdio().pause();
      });
      $('#next').click(function () {
        $('#api').rdio().next();
      });
    });
  });

  var songsHandle;
  // Always be subscribed to the songs for the selected mixtape.
  Deps.autorun(function () {
    var mixtapeId = Session.get('mixtapeId');
    if (mixtapeId)
      songsHandle = Meteor.subscribe('songs', mixtapeId);
    else
      songsHandle = null;
  });

  Template.songs.songs = function () {
    // Determine which songs to display in main pane,
    // selected based on mixtapeId
    var mixtapeId = Session.get('mixtapeId');
    if (!mixtapeId)
      return [];

    debugger;
    return Songs.find({ mixtapeId: mixtapeId }, {sort: {votes: 'desc'}});
  };

  /*
   * Increment vote count
   */
  Template.songs.events({
    'click input': function () {
      Songs.update(this._id, {$inc: {votes: 1}});
    }
  });

  /*
   * Adding songs
   */
  Template.add_song.events({
    'click #add-song': function () {
      var $songQuery = $('#song-query');
      var rdioSong;

      if ($songQuery.val().trim() === '')
        return;

      Meteor.call('rdioCall', 'search', {
        query: $songQuery.val(),
        types: ['Track'],
        count: 1
      }, function (error, result) {
        if (error) {
          alert(error);
        } else if (!result.results.length) {
          alert('No songs found for query: "' + $songQuery.val() + '"');
        } else {
          rdioSong = result.results[0];

          Songs.insert({
            rdioKey: rdioSong.key,
            mixtapeId: Session.get('mixtapeId'),
            name: rdioSong.name,
            artist: rdioSong.artist,
            votes: 0
          });
        }
      });

      // Clear the search field
      $songQuery.val('');
    }
  });

  Template.mixtape.rendered = function () {
    debugger;
    var mixtapeTag = Router.current().data().tag;
    Session.set('mixtapeId', Mixtapes.findOne({ tag: mixtapeTag })._id);
  }

}
