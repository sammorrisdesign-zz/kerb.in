define([
    'libs/bonzo',
    'libs/bean',
    'libs/qwery'
], function(
    bonzo,
    bean,
    qwery
) {
    var position = 0,
        lastScroll = 0;

    return {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            bean.on(qwery('.menu__wrapper')[0], 'scroll', function(e) {
                this.parallaxBackground();
            }.bind(this));
        },

        positionCalc: function() {
            var currentScroll = bonzo(qwery('.menu__wrapper')[0]).scrollLeft();
            position = 0 - (currentScroll / 2);
            return position;
        },

        parallaxBackground: function() {
            bonzo(qwery('.skyline')[0]).css({
                'background-position-x' : this.positionCalc() + "px"
            });
        }
    }
});