require([
    'modules/menuToggler',
    'modules/menuParallax'
], function (
    menuToggler,
    menuParallax
) {
    menuToggler.init();
    menuParallax.init();
});