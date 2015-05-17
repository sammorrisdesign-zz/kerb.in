define([
    'libs/bonzo',
    'libs/bean',
    'libs/keymaster',
    'libs/qwery'
], function(
    bonzo,
    bean,
    keypress,
    qwery
) {
    var options = {
        showMenu: [
            '.toggle__date', '.menu__list'
        ]
    }

    return {
        init: function() {
            if(bonzo(qwery("body")).hasClass("market--has-dates")) {
                this.bindEvents();
            }
            var first = bonzo(qwery(".toggle__date")).first()[0].className.split(' ')[1].replace('toggle__date--', '');
            this.showMenu(first);
        },

        bindEvents: function() {
            bean.on(qwery('.js-toggle-prev')[0], 'click', function(e) {
                this.switchMenu('prev');
            }.bind(this));
            key('left', function(e) {
                this.switchMenu('prev');
            }.bind(this));
            bean.on(qwery('.js-toggle-next')[0], 'click', function(e) {
                this.switchMenu('next');
            }.bind(this));
            key('right', function(e) {
                this.switchMenu('next');
            }.bind(this));
        },

        switchMenu: function(direction) {
            if (!this.checkIfDisabled(direction)) {
                var current = parseInt(qwery('.toggle__date.is-visible')[0].className.split(' ')[1].replace('toggle__date--', ''));
                if (direction == 'next') {
                    target = current + 1;
                } else if (direction == 'prev') {
                    target = current - 1;
                }
                this.showMenu(target);
                this.randomTransition();
                this.checkToDisable(target);
                this.updateDate();
                this.resetPosition();
            }
        },

        showMenu: function(target) {
            options.showMenu.forEach(function(namespace) {
                bonzo(qwery(namespace + '.is-visible')).removeClass('is-visible');
                bonzo(qwery(namespace + '--' + target)).addClass('is-visible');
            });
        },

        checkToDisable: function(current) {
            bonzo(qwery('.is-disabled')[0]).removeClass('is-disabled');
            if (qwery('.menu__list--' + (current - 1)).length == 0) {
                bonzo(qwery('.js-toggle-prev')[0]).addClass('is-disabled');
            } else if (qwery('.menu__list--' + (current + 1)).length == 0) {
                bonzo(qwery('.js-toggle-next')[0]).addClass('is-disabled');
            }
        },

        checkIfDisabled: function(direction) {
            return bonzo(qwery('.js-toggle-' + direction)[0]).hasClass('is-disabled');
        },

        updateDate: function() {
            var date = bonzo(qwery('.is-visible')[0]).attr('data-date');
            bonzo(qwery('.js-toggle-date')[0]).html(date);
        },

        randomTransition: function() {
            var numOfTraders = bonzo(qwery('.is-visible .menu__list__trader')).length;
            for (i = 0; i < numOfTraders; i++) {
                duration = Math.floor(Math.random() * (500 - 100) + 100) + 1;
                bonzo(qwery('.is-visible .menu__list__trader--' + i)).attr('style', 
                    '-webkit-animation-delay:' + duration + 'ms; ' +
                    '-moz-animation-delay:' + duration + 'ms; ' +
                    '-o-animation-delay:' + duration + 'ms; ' + 
                    'animation-delay:' + duration + 'ms;');
            }
        },

        resetPosition: function() {
            bonzo(qwery('.menu__wrapper')[0]).scrollLeft(0);
        }
    }
});