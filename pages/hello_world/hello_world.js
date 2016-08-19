define(["jquery", "knockout", "pageLayout", "metrojs", "text!./hello_world.html"], function ($, ko, pageLayout, metro, hello_worldTemplate) {

    function Hello_worldViewModel(route) {
        pageLayout.layoutPage();
    }

    return {
        viewModel: Hello_worldViewModel,
        template: hello_worldTemplate
    };

});