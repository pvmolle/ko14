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

					if (self.activeRound > 2 || self.gameOver) {
						return;
					}

					self.setCategoryActive(link.id);
					link.classList.add('active');
					self.nextRound();
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
			this.gameOver = false;
			this.fighters = {};

			[].forEach.call(document.querySelectorAll('.fighter'), function(fighter) {
				var className = fighter.className.replace(/active-./, '');
				fighter.className = className;
			});

			[].forEach.call(document.querySelectorAll('.keuze a'), function(link) {
				var className = link.className.replace(/active/, '');
				link.className = className;
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

			if (1 === numFighters) {
				document.querySelector('.player1 img').src = fighter.src;
				this.fighters.fighterOne = fighter.getAttribute('data-fighter');

			}

			if (2 === numFighters) {
				document.querySelector('.player2 img').src = fighter.src;
				this.fighters.fighterTwo = fighter.getAttribute('data-fighter');
			}

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

			request.open('GET', '/app/' + this.fighters.fighterOne + '/' + this.fighters.fighterTwo, true);
			request.onload = function() {
				if (200 === this.status) {
					self.result = JSON.parse(this.responseText);
					self.result.fighterOne.lives = 100;
					self.result.fighterTwo.lives = 100;
				}
			};
			request.send();
		},

		setCounters: function() {
			if (!this.result.fighterOne) {
				return;
			}

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

					if (value + 100 < max) {
						value += 100;
					} else if (value + 10 < max) {
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
			var self = this;

			this.counting = false;

			if (this.counters[0] < this.counters[1]) {
				this.result.fighterOne.lives -= 50;
			} else if (this.counters[0] > this.counters[1]) {
				this.result.fighterTwo.lives -= 50;
			} else {
				this.result.fighterOne.lives -= 50;
				this.result.fighterTwo.lives -= 50;
			}

			document.querySelector('.player1 .level span').style.width = this.result.fighterOne.lives + '%';	
			document.querySelector('.player2 .level span').style.width = this.result.fighterTwo.lives + '%';

			setTimeout(function() {
				self.checkWinner();
			}, 0);
		},

		checkWinner: function() {
			if (0 === this.result.fighterOne.lives) {
				return alert('Fighter 2 wins!');
				this.gameOver = true;
			}

			if (0 === this.result.fighterTwo.lives) {
				return alert('Fighter 1 wins!');
				this.gameOver = true;
			}
		}
	};

	gameManager.init();
});