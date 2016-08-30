define(["jquery", "knockout", "pageLayout", "metrojs", "text!./room102.html"], function ($, ko, pageLayout, metro, room102Template) {

    function Room102ViewModel(route) {
        pageLayout.layoutPage();
    }

    return {
        viewModel: Room102ViewModel,
        template: room102Template
    };

});