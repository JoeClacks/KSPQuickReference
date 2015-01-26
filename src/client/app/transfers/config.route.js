(function() {
    'use strict';

    angular
        .module('app.transfers')
        .run(appRun);

     appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/transfers/:body',
                config: {
                    templateUrl: 'app/transfers/transfers.html',
                    controller: 'Transfers',
                    controllerAs: 'vm',
                    title: 'transfers',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-lock"></i> Transfers'
                    }
                }
            }
        ];
    }
})();
