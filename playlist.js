/*Router.map(function() {
  this.route('home', {path: '/'});
  this.route('mixtape');
});*/

if (Meteor.isClient) {

  Template.songs.songs = function () {
    return Songs.find({}, { sort: { upvotes: -1}});
  }

  Template.songs.events({
    'click input': function () {
      Songs.update(this._id, {$inc: {upvotes: 1}});
    }
  })

  Template.add_song.events({
    'click input': function () {
      var song_title = document.getElementById('new_song_title');
      var song_artist = document.getElementById('new_song_artist');

        if (new_song_title.value != '' && new_song_artist.value != '') {
            Songs.insert({
            name: song_title.value,
            artist: song_artist.value,
            upvotes: 0,
          });
      
        document.getElementById('new_song_title').value = '';
        document.getElementById('new_song_artist').value = '';
        song_title.value = '';
        song_artist.value = '';
      }
    }
  });


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
 
