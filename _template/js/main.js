require([
    'modules/fonts'
], function (
    fonts
) {
    fonts.init();

    var bootstrap = document.body.getAttribute('data-bootstrap');

    if (bootstrap == "menu") {
        require(['menu'], function(Menu) {
            Menu.init();
        });
    }
});