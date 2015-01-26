(function() {
    'use strict';

    angular
        .module('app.transfers')
        .controller('Transfers', Transfers);

    Transfers.$inject = ['$routeParams', 'dataservice', 'logger'];

    function Transfers($routeParams, dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;
        vm.transfers = [];
        vm.body = $routeParams.body;
        vm.title = 'Transfers from ' + vm.body;
        vm.destBodies = [];
        vm.filter = {
            insertBurn: false,
            noInsertBurn: false
        }

        vm.transferFilter = transferFilter;
        vm.showDetails = showDetails;
        vm.transferSort = transferSort;
        vm.insertTypeSwitch = insertTypeSwitch;

        //TODO: pull this from config
        vm.imagePath = "/content/images/";

        activate();

        function activate() {
//            Using a resolver on all routes or dataservice.ready in every controller
//            var promises = [getAvengers()];
//            return dataservice.ready(promises).then(function(){
            return getTransfers().then(function() {
                logger.info('Activated Transfers View');
            });
        }

        function getTransfers() {
            return dataservice.getTransfers(vm.body).then(function (data) {
                vm.transfers = data;

                var tmpSet = {};
                //crude set
                angular.forEach(vm.transfers, function(value){
                    tmpSet[value.destination] = 1;

                    value.totalDeltaV = value.ejectBurn.deltaV;
                    if(value.insertBurn) {
                        value.totalDeltaV += value.insertBurn.deltaV;
                    }
                    if(value.planeChange) {
                        value.totalDeltaV += value.planeChange.deltaV;
                    }
                });
                vm.destBodies = Object.keys(tmpSet);

                return vm.transfers;
            });
        }

        function transferFilter(data) {
            if(vm.filter.destination != null && vm.filter.destination != data.destination)
            {
                return false;
            }
            else if(vm.filter.insertBurn && data.insertBurn == null){
                return false;
            }
            else if(vm.filter.noInsertBurn && data.insertBurn != null){
                return false
            }
            return true;
        }

        function showDetails(id) {
            vm.transfers.forEach(function(transfer){
                if(transfer.id == id){
                    transfer.isDetailsVisible = !transfer.isDetailsVisible;
                    return;
                }
            });
        }

        var transferSortLast = null;
        var transferSortAsc = false;
        function transferSort(column){
            if(column == transferSortLast)
            {
                transferSortAsc = !transferSortAsc;
            }
            else {
                transferSortAsc = false;
                transferSortLast = column;
            }

            if(column == 'totalDeltaV'){
                vm.transfers.sort(function(a, b){
                    if(transferSortAsc) {
                        return a.totalDeltaV - b.totalDeltaV;
                    }
                    else{
                        return b.totalDeltaV - a.totalDeltaV;
                    }
                });
            }
            else if(column == 'arrival'){
                vm.transfers.sort(function(a, b){
                    if(transferSortAsc) {
                        return a.arrive - b.arrive;
                    }
                    else{
                        return b.arrive - a.arrive;
                    }
                });
            }
            else if(column == 'departure'){
                vm.transfers.sort(function(a, b){
                    if(transferSortAsc) {
                        return a.arrive - b.arrive;
                    }
                    else{
                        return b.arrive - a.arrive;
                    }
                });
            }
        }

        //this is just to make sure we don't end up with both types checked
        function insertTypeSwitch(type) {
            if(type == "burn" && vm.filter.insertBurn){
                vm.filter.noInsertBurn = false;
            }
            else if(type == "aero" && vm.filter.noInsertBurn){
                vm.filter.insertBurn = false;
            }
        }
    }

    angular
        .module('app.transfers')
        .filter('kDate', kDate);

    function kDate()
    {
        return function(input)
        {
            if(input == null){ return ""; }

            var second = Math.floor(input % 60);
            input /= 60;
            var minute = Math.floor(input % 60);
            input /= 60;
            var hour = Math.floor(input % 6);
            input /= 6;
            var day = Math.floor(input % 426) + 1;
            var year = Math.floor(input / 426) + 1;

            var ret = "Year " + year + " Day " + day + " at " + hour + ":" + minute + ":" + second;

            return ret;
        }
    }

    angular
        .module('app.transfers')
        .filter('kTime', kTime);

    function kTime()
    {
        return function(input)
        {
            if(input == null){ return ""; }

            var second = Math.floor(input % 60);
            input /= 60;
            var minute = Math.floor(input % 60);
            input /= 60;
            var hour = Math.floor(input % 6);
            input /= 6;
            var day = Math.floor(input % 426) + 1;
            var year = Math.floor(input / 426) + 1

            var ret = day + " days " + hour + ":" + minute + ":" + second;

            if(year > 0) {
                ret = year + " Years " + ret;
            }

            return ret;
        }
    }


    angular
        .module('app.transfers')
        .filter('metricPrefix', metricPrefix);

    metricPrefix.$inject = ['$filter'];

    function metricPrefix($filter)
    {
        return function(input)
        {
            if(input == null){ return ""; }

            var positive = input > 0;
            var num;
            var prefix;

            input = Math.abs(input);
            if(input < Math.pow(10,6)){
                num = input;
            }
            else if(input < Math.pow(10,9)){
                num = input / Math.pow(10, 3);
                prefix = "k";
            }
            else if(input < Math.pow(10,12)){
                num = input / Math.pow(10, 6);
                prefix = "M";
            }
            else{
                num = input / Math.pow(10, 9);
                prefix = "G";
            }

            num = $filter('number')(num, 2);

            return (positive ? "" : "-") + num + " " + prefix;
        }
    }


})();
