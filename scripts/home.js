if (Meteor.isClient) {
  Template.home.events({
    /**
     * Create a new mixtape
     */
    'click #new-button': function () {
      var mixtapeTag = $('input[name="mixtape-tag"]').val();
      window.location.href = '/new/' + mixtapeTag;
    },
    'click #join-button': function () {
      var mixtapeTag = $('input[name="mixtape-tag"]').val();
      window.location.href = '/' + mixtapeTag;
    }
  });
}
