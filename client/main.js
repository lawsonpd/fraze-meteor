// TODO
// When "next word" is clicked, we need to replace the current word with Session.get("nextWord")
// and then request a new random word.
//

import { HTTP } from 'meteor/http';

const wordnik_key = process.env.WORDNIK_KEY;

function requestWord () {
  HTTP.get("http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&includePartOfSpeech=idiom&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=" + wordnik_key,
    function (error, response) {
      if (error) {
        console.log(error);
      }
      Session.set("currentWord", response.data.word);
    });
}

function endGame () {
  // give one team a point
  var team = Session.get("currentTeam");
  if (team === 0) {
    Session.set("team2Score", Session.get("team2Score") + 1);
  } else {
    Session.set("team1Score", Session.get("team1Score") + 1);
  }

  alert("GAME OVER!");
  Session.set("gameOn", false);
}

// called startRound in case we need startGame to start a fresh game (score 0-0)
function startRound () {
  Session.set("gameOn", true);
  Session.set("startGame", false);
  requestWord();
  Meteor.setTimeout(endGame, 60000);
}

Meteor.startup(function () {
  Session.set("currentTeam", 0);
  Session.set("team1Score", 0);
  Session.set("team2Score", 0);
  Session.set("startGame", true);

});

Template.body.helpers({
  gameOn: function () {
    return Session.get("gameOn");
  },

  startGame: function () {
    return Session.get("startGame");
  }
});

Template.start.events({
  "click #start": function (event) {
    startRound();
  }
});

Template.game.helpers({
  currentWord: function () {
    return Session.get("currentWord");
  },

  currentTeam: function () {
    if (Session.get("currentTeam") === 0) {
      return "Team 1"
    } else {
      return "Team 2"
    }
  },

  time: function () {
    // return t;
  }

});

Template.game.events({
  "click #next-word": function (event) {
    requestWord();
    // if this doesn't work, use a variable to store the value temp.
    Session.set("currentTeam", ~(Session.get("currentTeam")));
  },

  "click #skip-word": function (event) {
    requestWord();
    // take some time off the timer (restart timer with less time?)
  }
});

Template.gameOver.helpers({
  winner: function () {
    if (Session.get("currentTeam") === 0) {
      return "Team 2"
    } else {
      return "Team 1"
    }
  },

  team1Score: function () {
    return Session.get("team1Score");
  },

  team2Score: function () {
    return Session.get("team2Score");
  }
});

Template.gameOver.events({
  "click #play-again": function (event) {
    // keep the score but start a new round
    startRound();
  }
});

// "Meteor methods are remote functions that Meteor clients can invoke."
// They probably cannot access anything having to do with the client,
// but can access the database. Also, it may not even be possible to
// call them and get a return value from them. Instead, I'm just going
// to try to do the wordnik request from inside a template helper.
Meteor.methods({

});
