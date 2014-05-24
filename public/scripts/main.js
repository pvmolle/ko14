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

			[].forEach.call(document.querySelectorAll('.keuze a'), function(link) {
				link.addEventListener('click', function (evt) {
					evt.preventDefault();

					if (!self.result.fighterOne) {
						return;
					}

					if (Array.prototype.indexOf.call(link.classList, 'active') > -1) {
						return; 
					}

					if (self.counting) {
						return;
					}

					self.setCategoryActive(link.id);
					self.setCounters();
					self.startCounters();
				});
			});
		},

		reset: function() {
			this.activeRound = 0;
			this.numFighters = 0;
			this.counters = [];
			this.categories = ['twitterFollowers', 'twitterFollowers', 'twitterFollowers', 'twitterFollowers', 'twitterFollowers'];
			this.result = {};

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

		setCategoryActive: function(topic) {
			this.activeCategory = this.categories[topic];
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
				}
			};
			request.send();
		},

		setCounters: function() {
			if (!this.result.fighterOne) {
				return;
			}

			debugger;

			switch (this.activeCategory) {
				case 'twitterFollowers':
					this.counters[0] = this.result.fighterOne.twitter.followers;
					this.counters[1] = this.result.fighterTwo.twitter.followers;
					break;
			}
		},

		startCounters: function() {			
			var self = this;

			this.counting = false;

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

				self.declareRoundWinner();
			})();
		},

		declareRoundWinner: function() {
			this.counting = false;

			if (this.counters[0] > this.counters[1]) {
				alert(this.result.fighterOne.name + 'wins!');
			} else if (this.counters[0] < this.counters[1]) {
				alert(this.result.fighterTwo.name + 'wins!');
			} else {
				alert('Its a tie!');
			}
		}
	};

	gameManager.init();
});