if (Meteor.isClient) {
  Template.home.events({
    /**
     * Create a new mixtape
     */
    'click #new-button': function () {
      var mixtapeTag = $('input[name="mixtape-tag"]').val();
      alert(mixtapeTag);
    }
  });
}
