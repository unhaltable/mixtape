if (Meteor.isClient) {
  Template.join.events({
    'click #join-mixtape': function () {
      var mixtapeTag = $('input[name="mixtape-tag"]').val();

      // Insert new mixtape into database
      if (Mixtapes.findOne({ tag: mixtapeTag })) {
        alert('Mixtape with tag "' + mixtapeTag + '" exists');
        Mixtapes.insert({
        client: Meteor.user()
        }, function (error, _id) {
          if (error) {
            alert(error);
          } else {
            debugger;
            window.location.href = '/' + mixtapeTag;
          }
        });
      }

      
    }
  });
}
