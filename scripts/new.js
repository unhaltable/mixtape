if (Meteor.isClient) {
  Template.new.events({
    'click #create-mixtape': function () {
      var mixtapeTag = $('input[name="mixtape-tag"]').val();

      alert();

      // TODO: create db record

      window.location.href = '/' + mixtapeTag;
    }
  });
}
