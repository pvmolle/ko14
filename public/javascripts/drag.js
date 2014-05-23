'use strict';

(function () {
    var side1;
    var side2;
    var el;
    var images = [];

    function preload() {
        for (var i = 0; i < arguments.length; i++) {
            images[i] = new Image();
            images[i].src = arguments[i]
        }
    }

    function handleDragStart(e) {
        el = this;
        this.classList.add('drag');
        preload(
            "/img/politicians/" + el.getAttribute('data-img')
        );
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'move';

        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        var side = e.target;

        if (side.getAttribute('data-side') == 1) {
            side1 = true;
        } else {
            side2 = true;
        }


        side.style.background = "url('/img/politicians/" + el.getAttribute('data-img') + "') no-repeat center";

        if (side1 && side2) {
            activateStartButton();
        }

        return false;
    }

    function activateStartButton() {
        var btn = document.getElementById('start');
        var el = btn.getElementsByClassName('text')[0];

        el.innerHTML = 'Battle';
        btn.classList.add('start');

        var slideIn = document.getElementsByClassName('slide')[0];
        slideIn.classList.add('slide-out');

        var results = document.getElementsByClassName('results')[0];
        results.classList.add('slide-in');
    }

    function handleDragEnd(e) {
        [].forEach.call(cols, function (col) {
            col.classList.remove('drag');
        });

        [].forEach.call(sides, function (col) {
            col.classList.remove('over');
        });
    }

    var cols = document.querySelectorAll('.politician');
    [].forEach.call(cols, function (col) {
        col.addEventListener('dragstart', handleDragStart, false);
        col.addEventListener('dragend', handleDragEnd, false);
    });

    var sides = document.querySelectorAll('.side');
    [].forEach.call(sides, function (col) {
        col.addEventListener('dragenter', handleDragEnter, false);
        col.addEventListener('dragover', handleDragOver, false);
        col.addEventListener('dragleave', handleDragLeave, false);
        col.addEventListener('drop', handleDrop, false);
    });
})();