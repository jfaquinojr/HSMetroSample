(function () {
	angular.module("app", []).controller("TicketsController", function ($http) {

		//alert("TicketsController!!!");

		var vm = this;
		var svc = $http;

		vm.ticketsAll = [];
		vm.ticketsVisible = [];

		function loadTickets() {
			let url = "http://localhost:8001/api/Tickets/Open";
			svc.get(url).then(function (result) {
				vm.ticketsAll = vm.ticketsAll.concat(result.data);
				vm.ticketsVisible = vm.ticketsAll;
			});
		}

		function loadNewTicketswithinPastMinutes(minutes) {
			let url = "http://localhost:8001/api/Tickets/Open/Past/Minutes/" + minutes;
			svc.get(url).then(function (result) {
				vm.ticketsAll = vm.ticketsAll.concat(result.data); //TODO: filter first <---!!!!!
				vm.ticketsVisible = vm.ticketsAll;
			});
		}

		function filterByPage(pageNo) {
			vm.ticketsVisible = _.filter(vm.ticketsAll, function (ticket) {
				return 
			});
		}

		vm.filterByPage = filterByPage;

		loadTickets();

	})
})();