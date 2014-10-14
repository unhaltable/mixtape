if (Meteor.isServer) {
  function getHostRdio(mixtapeId) {
    var user = Meteor.users.findOne(Mixtapes.findOne(mixtapeId).host._id);
    var rdio = Rdio.forUser(user);
    if (!rdio) return "No Rdio credentials";
    return rdio;
  }

  Meteor.methods({
    getPlaybackToken: function (mixtapeId) {
      return getHostRdio(mixtapeId).call('getPlaybackToken', {domain: 'localhost'});
    },

    rdioCall: function (mixtapeId, method, params) {
      return getHostRdio(mixtapeId).call(method, params);
    }
  });

}

if (Meteor.isClient) {

  Session.setDefault('mixtapeId', null);

  Session.setDefault('songKey', null);

  Meteor.startup(function () {
    var tempID = makeId();
    Session.set('clientID', tempID);
  });

  var mixtapesHandle = Meteor.subscribe('mixtapes');

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

    var cursor = Songs.find({ mixtapeId: mixtapeId }, {sort: {votes: 'desc'}});
    if (cursor.fetch().length && cursor.fetch()[0].rdioKey !== Session.get('songKey'))
      Session.set('songKey', cursor.fetch()[0].rdioKey);

    return cursor;
  };

  Template.veto.veto = function () {
    var mixtapeId = Session.get('mixtapeId');
    if (!mixtapeId)
      return [];
    return Songs.find({ mixtapeId: mixtapeId }, {sort: {votes: 'desc'}, limit: 1});
  };

  /*
   * Adding songs
   */
  Template.add_song.events({
    'click #add-song': function () {
      var $songQuery = $('#song-query');
      var rdioSong;

      if ($songQuery.val().trim() === '')
        return;

      Meteor.call('rdioCall', Session.get('mixtapeId'), 'search', {
        query: $songQuery.val(),
        types: ['Track'],
        count: 1
      }, function (error, result) {
        if (error) {
          alert(error);
        } else if (!result.results.length) {
          alert('No songs found for query: "' + $songQuery.val() + '"');
        } else if (Songs.find({mixtapeId: Session.get('mixtapeId')}, {}).count() >= 15) {
          alert('This mixtape is full right now');
        } else {
          rdioSong = result.results[0];

          Songs.insert({
            rdioKey: rdioSong.key,
            mixtapeId: Session.get('mixtapeId'),
            name: rdioSong.name,
            artist: rdioSong.artist,
            votes: 1,
            users: [Session.get('clientID')],
            veto: 0
          });
        }
      });

      // Clear the search field
      $songQuery.val('');
    }
  });

  /*
   * Increment vote count
   */
  Template.songs.events({
    'click input': function () {
      var clientID = Session.get('clientID');
      //check if the song has been clicked by the user before
      var userArray = Songs.findOne({_id: this._id}, {field:'users'}).users;

      //find out if user is in this new array
      if (userArray.indexOf(clientID) === -1) {
        Songs.update(this._id, {$inc: {votes: 1}});
        Songs.update(this._id, {$push: {users: clientID}});
      } else {
        Songs.update(this._id, {$inc: {votes: -1}});
        Songs.update(this._id, {$pull: {users: clientID}});
      }
    }
  });

  Template.mixtape.rendered = function () {
    var template = this;

    Meteor.subscribe('mixtapes', function () {
      var mixtapeTag = Router.current().data().tag;
      Session.set('mixtapeId', Mixtapes.findOne({ tag: mixtapeTag })._id);

      Meteor.call('getPlaybackToken', Session.get('mixtapeId'), function (error, result) {
        var playbackToken = result;
        var $nowPlaying = $('#now-playing');

        $nowPlaying.bind('ready.rdio', function () {
          // Rdio widget is ready
          template.autorun(function () {
            var songKey = Session.get('songKey');
            if (songKey)
              $('#now-playing').rdio().play(songKey);
          });
        });

        $nowPlaying.bind('playingTrackChanged.rdio', function (e, playingTrack, sourcePosition) {
          var duration;
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
  };

  function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 16; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

}
