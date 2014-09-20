if (Meteor.isClient) {

  Template.rdio_account.events({
    'click .sign-in': function () {
      alert('yup');
    }
  });

  Template.messages.messages = function () {
    return Messages.find({}, { sort: { time: -1 }});
  };

  Template.input.events = {
  'keydown input#message' : function (event) {
      if (event.which == 13) { // 13 is the enter key event
        if(Meteor.user()){
          var name = Meteor.user().profile.name;
        }
        else{
          var name = 'Anonymous';  
        }
        var message = document.getElementById('message');
   
        if (message.value != '') {
          Messages.insert({
            name: name,
            message: message.value,
            time: Date.now()
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
