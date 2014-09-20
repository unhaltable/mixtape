if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to playlist.";
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Template.messages.messages = function () {
    return Messages.find({}, { sort: { time: -1 }});
  }

  Template.input.events = {
  'keydown input#message' : function (event) {
      if (event.which == 13) { // 13 is the enter key event
        var name = 'Anonymous';
        var message = document.getElementById('message');
   
        if (message.value != '') {
          Messages.insert({
            name: name,
            message: message.value,
            time: Date.now(),
          });
   
          document.getElementById('message').value = '';
          message.value = '';
        }
      }
    }
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
