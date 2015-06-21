define([
    'libs/bonzo',
    'libs/qwery'
], function(
    bonzo,
    qwery
) {
    return {
        init: function() {
            bonzo(qwery(".wheel")).each(function() {
                var info = this.getBBox();
                var top = info.height / 2 + info.x;
                var left = info.width / 2 + info.y;
                bonzo(qwery(this)).attr("style", "transform-origin: " + top + "px " + left + "px;");
            })
        }
    }
});