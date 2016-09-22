(function () {
    var app = angular.module("app", ["ui.bootstrap", "ui.bootstrap.modal"]);

  

    app.controller("TicketsController", function ($http, $uibModal, $scope) {

		//alert("TicketsController!!!");

		var vm = this;
		var svc = $http;

        vm.SelectedTicket = {};

        vm.ticketsAll = [];
		vm.ticketsVisible = [];

		function loadTickets() {
			var url = "http://localhost:8001/api/Tickets/Open";
			svc.get(url).then(function (result) {
				vm.ticketsAll = vm.ticketsAll.concat(result.data);
				vm.ticketsVisible = vm.ticketsAll;
			});
		}

		function loadNewTicketswithinPastMinutes(minutes) {
			var url = "http://localhost:8001/api/Tickets/Open/Past/Minutes/" + minutes;
			svc.get(url).then(function (result) {
				vm.ticketsAll = vm.ticketsAll.concat(result.data); //TODO: filter first <---!!!!!
				vm.ticketsVisible = vm.ticketsAll;
			});
		}

		function loadActivitiesFor(ticket) {
		    var retval = [];
		    var url = "http://localhost:8001/api/Tickets/" + ticket.Id + "/Activities";
		    console.log(url);
            svc.get(url).then(function (result) {
                retval = result.data;
                vm.SelectedTicket = ticket;
                vm.SelectedTicket.Activities = retval;
                console.log(JSON.stringify(vm.SelectedTicket.Activities));
                
            });
            
		}

		//function filterByPage(pageNo) {
		//	vm.ticketsVisible = _.filter(vm.ticketsAll, function (ticket) {
		//		return 
		//	});
		//}

		//vm.filterByPage = filterByPage;

		loadTickets();

		vm.editTicket = function(ticket) {

		    vm.SelectedTicket = ticket;
		    loadActivitiesFor(ticket);

		    var dialog = $("#dialog").data("dialog");
		    dialog.open();
		    
		};

        vm.open = function(size) {
            var modalInstance = $uibModal.open({
                templateUrl: "tmpl_Activities.html",
                controller: "ModalInstanceCtrl",
                //controllerAs: "vm",
                scope: $scope,
                size: size,
                resolve: {
                    SelectedTicket: function () {
                        //alert('Resolved: ' + JSON.stringify(vm.SelectedTicket));
                        return $scope.SelectedTicket;
                    }
                }
            });
        };

    });


    app.directive("popupShowActivities",
        function () {

            return {
                templateUrl: "templates/popupShowActivities.html",
                restrict: "E",
                scope: {
                    ticket: "="
                },
                controller: function ($scope) {

                    $scope.comment = "";
                    
                    $scope.addActivity = function (comment) {

                        $scope.ticket.Activities.unshift({
                            TicketId: $scope.ticket.Id,
                            Comment: comment,
                            CreatedOn: new Date(),
                            CreatedBy: 1
                        });

                        $scope.comment = "";
                    }
                    
                    $scope.closeTicket = function (comment) {
                        alert(comment);
                    }

                }
            }

        });


})();