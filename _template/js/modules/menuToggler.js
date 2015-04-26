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
    return {
        init: function() {
            this.bindEvents();
            this.showMenu(qwery('.menu__list')[0]);
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
                var current = parseInt(qwery('.is-visible')[0].className.split(' ')[1].replace('menu__list--', ''));
                if (direction == 'next') {
                    target = current + 1;
                } else if (direction == 'prev') {
                    target = current - 1;
                }
                this.showMenu(qwery('.menu__list--' + target));
                this.checkToDisable(target);
                this.updateDate();
            }
        },

        showMenu: function(target) {
            bonzo(qwery('.is-visible')).removeClass('is-visible');
            bonzo(target).addClass('is-visible');
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
        }
    }
});