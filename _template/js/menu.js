require([
    'modules/menuToggler',
    'modules/menuParallax'
], function (
    menuToggler,
    menuParallax
) {
    var bootstrap = document.body.getAttribute('data-bootstrap');
    if (bootstrap === "menu") {
        menuToggler.init();
        menuParallax.init();
    }
});
