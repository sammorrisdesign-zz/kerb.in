define([
    'modules/menuToggler',
    'modules/menuParallax'
], function (
    menuToggler,
    menuParallax
) {
    return {
        init: function() {
            menuToggler.init();
            menuParallax.init();
        }
    }
});
