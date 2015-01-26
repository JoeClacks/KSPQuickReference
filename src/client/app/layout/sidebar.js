(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('Sidebar', Sidebar);

    Sidebar.$inject = ['$route', 'routehelper', 'dataservice', 'logger'];

    function Sidebar($route, routehelper, dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;
        var routes = routehelper.getRoutes();
        vm.isCurrent = isCurrent;
        //vm.sidebarReady = function(){console.log('done animating menu')}; // example

        //TODO: pull this from config
        vm.imagePath = "/content/images/";

        activate();

        function activate() {
            getNavRoutes();

            getBodies().then(function() {
                logger.info('Got bodies data');
            });
        }

        function getNavRoutes() {
            vm.navRoutes = routes.filter(function(r) {
                return r.settings && r.settings.nav;
            }).sort(function(r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        function getBodies(){
            return dataservice.getBodies().then(function(data) {
                //flatten the data
                var ret = [];
                angular.forEach(data, function(value, key){
                    this.push({"name": key, "type": "planet"});
                    angular.forEach(value, function(value){
                        this.push({"name": value, "type": "moon"});
                    }, ret);
                }, ret);

                vm.bodyNames = ret;
            });
        }

        function isCurrent(route) {
            if (!route.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }
    }
})();
