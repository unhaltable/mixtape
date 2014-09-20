Router.map(function() {
  this.route('home', {path: '/'});
  this.route('mixtape');
});

if (Meteor.isServer) {
//  var rdio = Meteor.npmRequire('rdio')({
//    rdio_api_key: 'uq3vzfjq8hng3cc7rr7gx92y',
//    rdio_api_shared: process.env.RDIO_SECRET,
//    callback_url: 'http://localhost:3000'
//  });

  Meteor.methods({
    getPlaybackToken: function () {
      if (false /*you want to throw an error*/)
        throw new Meteor.Error(404, "Can't find my pants");
      return rdio.api();
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

  Rdio.requestCredential({}, function(credentialTokenOrErr) {
    debugger;
  });

  Meteor.call('foo', function () {
    console.info(arguments);
  });

  var playbackToken = Meteor.call('getPlaybackToken');
  $('#now-playing').rdio(playbackToken);

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

}
