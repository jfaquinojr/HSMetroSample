define(["knockout", "crossroads", "hasher", "angularjs"], function (ko, crossroads, hasher, ng) {

    // This module configures crossroads.js, a routing library. If you prefer, you
    // can use any other routing library (or none at all) as Knockout is designed to
    // compose cleanly with external libraries.
    //
    // You *don't* have to follow the pattern established here (each route entry
    // specifies a 'page', which is a Knockout component) - there's nothing built into
    // Knockout that requires or even knows about this technique. It's just one of
    // many possible ways of setting up client-side routes.

    return new Router({
        routes: [
            { url: '',              params: { page: 'home-page' } },
            { url: '1',             params: { page: 'hello_world' } },
            { url: '2',             params: { page: 'room102' } }
        ]
    });

    function Router(config) {
        var currentRoute = this.currentRoute = ko.observable({});

        ko.utils.arrayForEach(config.routes, function (route) {
        	crossroads.addRoute(route.url, function (requestParams) {
                currentRoute(ko.utils.extend(requestParams, route.params));
            });
        });

        activateCrossroads();

    	// execute action every time crossroads matches a route
    	// https://github.com/millermedeiros/crossroads.js/wiki/Examples#execute-an-action-every-time-crossroads-matches-any-route
        crossroads.routed.add(function (pageNo) {

            var scope = angular.element($("#TicketsController2")).scope();
        	var n = parseInt(pageNo);
        	if (n > 0) {
	            scope.loadTicketsByRoom(n);
	        } else {
	            scope.loadTickets();
	        }
        });
    }

    function activateCrossroads() {
        function parseHash(newHash, oldHash) {
            crossroads.parse(newHash);
        }
        crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
        hasher.initialized.add(parseHash);
        hasher.changed.add(parseHash);
        hasher.init();
    }
});