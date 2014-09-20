Router.map(function() {
  this.route('home', {path: '/'});
  this.route('mixtape');
});

if (Meteor.isClient) {

  Template.songs.songs = function () {
    return Songs.find({}, { sort: { upvotes: 1}});
  }

  Template.song_queue.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  /*
  Template.messages.messages = function () {
    return Messages.find({}, { sort: { time: -1 }});
>>>>>>> song queue shit
  };

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
