(function () {

    var global = {
        api: {
            url: 'http://localhost:8001/api/'
        }
    };

    var app = angular.module("app", ["ui.bootstrap", "ui.bootstrap.modal", "angular-lodash"]);

  

    app.controller("TicketsController", function ($http, $uibModal, $scope, $interval) {

		var vm = this;
		var svc = $http;

        vm.SelectedTicket = {};

        vm.ticketsAll = [];
        vm.ticketsVisible = [];


		function loadTickets() {
			var url = global.api.url + "Tickets/Open";
			svc.get(url).then(function (result) {
				vm.ticketsAll = result.data;
				vm.ticketsVisible = vm.ticketsAll;
			});
		};

        $scope.loadTickets = loadTickets;

        function loadNewTicketswithinPastMinutes(minutes) {

            if (!minutes) {
                minutes = 1;
            }

		    var url = global.api.url + "Tickets/Open/Past/Minutes/" + minutes;
		    svc.get(url).then(function (result) {
		        vm.ticketsAll = _.uniq(_.union(result.data, vm.ticketsAll), false, function (o){ return o.Id });
				vm.ticketsVisible = vm.ticketsAll;
		    });

            //alert('loadNewTicketswithinPastMinutes');
        }

        $interval(loadNewTicketswithinPastMinutes, 3000);

		function loadActivitiesFor(ticket) {
		    var retval = [];
		    var url = global.api.url + "Tickets/" + ticket.Id + "/Activities";
		    console.log(url);
            svc.get(url).then(function (result) {
                retval = result.data;
                vm.SelectedTicket = ticket;
                vm.SelectedTicket.Activities = retval;
                console.log(JSON.stringify(vm.SelectedTicket.Activities));
            });
		}

		$scope.loadTicketsByRoom = function(roomId) {
		    var url = global.api.url + "Tickets/Open/Room/" + roomId;
		    console.log(url);
		    svc.get(url).then(function (result) {
		        vm.ticketsAll = result.data;
		        vm.ticketsVisible = vm.ticketsAll;
		    });
		}

		//vm.filterByPage = filterByPage;

		loadTickets();

		vm.editTicket = function(ticket) {

		    vm.SelectedTicket = ticket;
		    loadActivitiesFor(ticket);

		    openDialog();

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

    function createActivity(ticket, comment) {
        return {
            TicketId: ticket.Id,
            Comment: comment,
            CreatedBy: 1
        };
    }

    function openDialog() {
        var dialog = $("#dialog").data("dialog");
        dialog.open();
    }

    function closeDialog() {
        var dialog = $("#dialog").data("dialog");
        dialog.close();
    }


    app.directive("popupShowActivities",
        function () {

            return {
                templateUrl: "templates/popupShowActivities.html",
                restrict: "E",
                scope: {
                    ticket: "="
                },
                controller: function ($scope, $http) {

                    $scope.comment = "";
                    
                    $scope.addActivity = function (comment) {

                        var activityData = createActivity($scope.ticket, comment);

                        $http.post(global.api.url + "CreateActivity", JSON.stringify(activityData))
                            .then(
                                function(result) {
                                    $scope.ticket.Activities.unshift({
                                        TicketId: $scope.ticket.Id,
                                        Comment: comment,
                                        CreatedOn: new Date(),
                                        CreatedBy: 1
                                    });

                                    $scope.comment = "";

                                    $.Notify({
                                        caption: 'Success',
                                        content: 'Activity created.',
                                        type: 'success'
                                    });
                                },
                                function(error) {
                                    $.Notify({
                                        caption: 'Create Activity Failed',
                                        content: error,
                                        type: 'alert'
                                    });
                                });
                    }
                    
                    $scope.closeTicket = function (comment) {

                        var activityData = createActivity($scope.ticket, comment);

                        $http.post(global.api.url + "CloseTicket", JSON.stringify(activityData))
                            .then(
                                function (result) {

                                    $scope.ticket.Activities.unshift({
                                        TicketId: $scope.ticket.Id,
                                        Comment: comment,
                                        CreatedOn: new Date(),
                                        CreatedBy: 1
                                    });

                                    $scope.comment = "";

                                    closeDialog();

                                    $.Notify({
                                        caption: 'Success',
                                        content: 'Ticket closed.',
                                        type: 'success'
                                    });
                                },
                                function (error) {
                                    $.Notify({
                                        caption: 'Unable to close Ticket',
                                        content: error,
                                        type: 'alert'
                                    });
                                });
                    } // closeTicket

                }
            }

        });

    app.directive("ticketTile",
        function() {
            return {
                templateUrl: "templates/ticketTile.html",
                restrict: "E",
                scope: true,
                controller: function($scope) {
                    
                }
            }
        });

})();