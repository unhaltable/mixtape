Router.map(function() {
  this.route('home', {path: '/'});
  this.route('mixtape');
});

if (Meteor.isClient) {


  Template.Songs.songs = function () {
    return Songs.find({}, { sort: { upvotes: 1}});
  }

  Template.messages.messages = function () {
    return Messages.find({}, { sort: { time: -1 }});
  };

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
