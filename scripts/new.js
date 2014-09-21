if (Meteor.isClient) {
  Template.new.events({
    'click #create-mixtape': function () {
      var mixtapeTag = $('input[name="mixtape-tag"]').val();

      if (!Meteor.user()) {
        alert('You must sign into Rdio to create a Mixtape');
        return;
      }

      // Insert new mixtape into database
      if (Mixtapes.findOne({ tag: mixtapeTag })) {
        alert('Mixtape with tag "' + mixtapeTag + '" already exists');
        return;
      }

      Mixtapes.insert({
        tag: mixtapeTag,
        host: Meteor.user()
      }, function (error, _id) {
        if (error) {
          alert(error);
        } else {
          debugger;
          window.location.href = '/' + mixtapeTag;
        }
      });
    }
  });
}
