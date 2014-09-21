

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

  Meteor.startup(function () {
    console.log(Session.get("clientID"));
    if (true) {
      var tempID = makeid();
      Session.set("clientID", tempID);
    }
  });

  Meteor.call('getPlaybackToken', function (error, result) {
    playbackToken = result;
    deferred.resolve();
  });

  //EDIT TO QUERY MIXTAPE
  Template.songs.songs = function () {
    return Songs.find({}, { sort: { upvotes: -1}});
  };
  Template.veto.veto = function () {
    return Songs.find({}, { sort: { upvotes: -1}, limit: 1});
    //var firstID = Songs.findOne({}, { sort: { upvotes: -1}}).fetch()._id;
    //return firstID == id;
  };

  Template.add_song.events({
    'click input': function () {
      var song_title = document.getElementById('new_song_title');
      var song_artist = document.getElementById('new_song_artist');
      var clientID = Session.get('clientID');

      //REPLACE WITH RDIO SONG METADATA
      if (new_song_title.value != '' && new_song_artist.value != '') {
        Songs.insert({
          name: song_title.value,
          artist: song_artist.value,
          upvotes: 1,
          users: [clientID]
        });

        document.getElementById('new_song_title').value = '';
        document.getElementById('new_song_artist').value = '';
        song_title.value = '';
        song_artist.value = '';
      }
    }
  });

  Template.songs.events({
    'click input': function () {
      var clientID = Session.get('clientID');
      //check if the song has been clicked by the user before
      var userCursor = Songs.find({_id: this._id}, {field:'users'});
      var userCollection = userCursor.fetch()[0];
      var userArray = userCollection.users;
      console.log(userCollection);
      console.log(userArray);

      //find out if user is in this new array
      if(!contains(userArray, clientID)){
        Songs.update(this._id, {$inc: {upvotes: 1}});
        Songs.update(this._id, {$push: {users: clientID}});
      } else {
        Songs.update(this._id, {$inc: {upvotes: -1}});
        Songs.update(this._id, {$pull: {users: clientID}});
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

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
      console.log(a[i]);
      console.log(obj);
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 16; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}