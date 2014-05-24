$(function() {
	"use strict";

	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	var gameManager = {

		init: function() {
			this.reset();
			var self = this;

			[].forEach.call(document.querySelectorAll('.fighter'), function(fighter) {
				fighter.addEventListener('click', function() {
					self.setFighterActive(this);
				});
			});
		},

		reset: function() {
			this.activeRound = 0;
			this.numFighters = 0;
			this.counters = {};

			[].forEach.call(document.querySelectorAll('.fighter'), function(fighter) {
				var className = fighter.className.replace(/active-./, '');
				fighter.className = className;
			});
		},

		setFighterActive: function(fighter) {
			var numFighters = this.numFighters;
			numFighters++;

			if (numFighters > 2) {
				return;
			}

			fighter.classList.add('active-' + numFighters);
			this.numFighters = numFighters;
		},

		selectTopic: function(topic) {
			this.activeTopic = topic;
		},

		nextRound: function() {
			this.activeRound++;
		},

		fetchResults: function(fighterOne, fighterTwo) {
			var request = new XMLHttpRequest();
			var self = this;

			request.open('GET', '/app/Wouter Beke/Guy Verhofstadt', true);
			request.onload = function() {
				if (200 === this.status) {
					self.result = JSON.parse(this.responseText);
					self.setCounters();
				}
			};
			request.send();
		},

		setCounters: function() {
			this.counters.fighterOne = this.result.fighterOne.facebook.likes;
			this.counters.fighterTwo = this.result.fighterTwo.facebook.likes;
			debugger;
		}
	};

	gameManager.init();
	gameManager.fetchResults();

	return;

	var response = [1234, 1987];

	(function loop() {
		var items = document.querySelectorAll('.counter');
		var cont = true;

		[].forEach.call(items, function(item, idx) {

			var value = +item.innerHTML;
			var max = response[idx];

			cont = false;

			if (value + 10 < max) {
				value += 10;
			} else {
				value++;
			}

			if (value <= max) {
				item.innerHTML = value;
				cont = cont || true;
			}
		});

		if (cont) requestAnimFrame(loop);
	})();
});