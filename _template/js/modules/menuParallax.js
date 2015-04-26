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
            $wrapper = qwery('.menu__wrapper')[0];
            this.bindEvents();
        },

        bindEvents: function() {
            bean.on(qwery('.menu__wrapper')[0], 'scroll', function(e) {
                this.positionCalc();
                this.parallaxBackground();
            }.bind(this));
        },

        positionCalc: function() {
            var currentScroll = bonzo(qwery('.menu__wrapper')[0]).scrollLeft();
            if (currentScroll > lastScroll) {
                position = position - 1;
            } else {
                position = position + 1;
            }
            lastScroll = currentScroll;
        },

        parallaxBackground: function() {
            bonzo(qwery('.menu__skyline')[0]).css({
                'background-position-x' : position + "px"
            });
        }
    }
});