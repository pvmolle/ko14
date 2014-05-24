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

			document.querySelector('.button').addEventListener('click', function(evt) {
				evt.preventDefault();

				if (2 === self.numFighters) {
					self.fetchResults();
				}
			});
		},

		reset: function() {
			this.activeRound = 0;
			this.numFighters = 0;
			this.counters = [];

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

			if (/active/.test(fighter.className)) {
				numFighters--;
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

			request.open('GET', '/app/Bart Staes/Bart Staes', true);
			request.onload = function() {
				if (200 === this.status) {
					self.result = JSON.parse(this.responseText);
					self.setCounters();
					self.startCounters();
				}
			};
			request.send();
		},

		setCounters: function() {
			this.counters[0] = this.result.fighterOne.facebook.likes;
			this.counters[1] = this.result.fighterTwo.facebook.likes;
		},

		startCounters: function() {
			var self = this;

			var items = document.querySelectorAll('.fight1, .fight2');
			[].forEach.call(items, function(item) {
				item.innerHTML = 0;
			});

			(function loop() {
				var cont = true;

				[].forEach.call(items, function(item, idx) {

					var value = +item.innerHTML;
					var max = self.counters[idx];

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

				if (cont) return requestAnimFrame(loop);
			})();
		}
	};

	gameManager.init();
});