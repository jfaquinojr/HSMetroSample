(function () {
	angular.module("app", []).controller("TicketsController", function ($http) {

		//alert("TicketsController!!!");

		var vm = this;
		var svc = $http;

		vm.tickets = [];

		function loadTickets() {
			let url = "http://localhost:8001/api/Tickets/Open";
			svc.get(url).then(function (result) {
				vm.tickets = vm.tickets.concat(result.data);
			});
		}

		function loadNewTicketswithinPastMinutes(minutes) {
			let url = "http://localhost:8001/api/Tickets/Open/Past/Minutes/" + minutes;
			svc.get(url).then(function (result) {
				vm.tickets = vm.tickets.concat(result.data);
			});
		}

		loadTickets();

	})
})();