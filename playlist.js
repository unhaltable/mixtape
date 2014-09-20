if (Meteor.isClient) {

  // Set up Spotify API
  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken('79a509f23c3f4486b94489e71111d418');
  spotifyApi.setPromiseImplementation(Q);

  Template.spotify_account.events({
    'click .sign-in': function () {

      alert('yup');
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
