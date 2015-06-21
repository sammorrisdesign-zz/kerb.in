require([
    'modules/fonts'
], function (
    fonts
) {

    fonts.init();

    var bootstrap = document.body.getAttribute('data-bootstrap');
    bootstrap = "home";

    if (bootstrap === "menu") {
        require(['menu'], function(Menu) {
            Menu.init();
        });
    }
});