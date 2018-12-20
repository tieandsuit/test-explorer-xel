/******************************************************************************
 * Copyright © 2017 XEL Community                                             *
 *                                                                            *
 * See the DEVELOPER-AGREEMENT.txt and LICENSE.txt files at  the top-level    *
 * directory of this distribution for the individual copyright  holder        *
 * information and the developer policies on copyright and licensing.         *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * XEL software, including this file, may be copied, modified, propagated,    *
 * or distributed except according to the terms contained in the LICENSE.txt  *
 * file.                                                                      *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

angular.module('poll').controller('PollsCtrl',
    ['$scope', 'PollService', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile',
        'votingModelFilter', 'amountTQTFilter', 'isEnabledFilter', 'baseConfig', 'searchTermFilter',
        'quantityToShareFilter',  'numericalStringFilter', 'quantToAmountFilter',
        'shareToQuantiyFilter', 'votingModelLabelFilter',
        function ($scope, PollService, DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile,
                  votingModelFilter, amountTQTFilter, isEnabledFilter, baseConfig, searchTermFilter,
                  quantityToShareFilter, numericalStringFilter, quantToAmountFilter, shareToQuantiyFilter,
                  votingModelLabelFilter) {

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('numbers')
              .withDOM('frtip')
              .withOption('paging', true)
              .withOption('ordering', false)
              .withOption('info', false)
              .withOption('responsive', true)
              .withOption('serverSide', true)
              .withDataProp('polls')
              .withOption('processing', true)
              .withOption('bFilter', false)
              .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    PollService.getPolls(data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'polls': response.polls
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

              DTColumnBuilder.newColumn('offer').withTitle('Details').notSortable()
                .renderWith(function (data, type, row, meta) {

                  var tt_info = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                      ' "Poll Details"';

                  return '<button type="button" class="btn btn-infinity btn-xs" style="" ng-click="openModal(\'' + row.poll + '\')">' +
                  '<i class="fa fa-list-ul" aria-hidden="true"></i>' + '</button>';

                }),

                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                    .renderWith(function (data, type, row, meta) {
                      return data;
                    }),

                DTColumnBuilder.newColumn('votingModel').withTitle('Model').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return votingModelLabelFilter(data);
                    }),

                DTColumnBuilder.newColumn('options').withTitle('Options').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data.length;
                    }),
                DTColumnBuilder.newColumn('finished').withTitle('Finished').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return isEnabledFilter(data);
                    }),

                DTColumnBuilder.newColumn('finishHeight').withTitle('Height').notSortable(),

                DTColumnBuilder.newColumn('poll').withTitle('View').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        return '<button type="button" class="btn btn-default btn-xs" ng-click="openPollData(\'' + data +
                            '\',\'' + row.name + '\',\'' + row.description + '\')">  <i class="fa fa-bar-chart" aria-hidden="true" style="width:15px;"></i> </a>';
                    }),
            ];

            $scope.openModal = function (poll) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'polls/poll.html',
                    size: 'lg',
                    controller: 'PollCtrl',
                    windowClass: 'poll-modal-window',
                    resolve: {
                        params: function () {
                            return {
                                'pollId': poll,
                                'includeCounts': true
                            };
                        }
                    }

                });
            };

            $scope.openPollData = function (pollId, pollName, pollDescription) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'polls/poll-result.html',
                    size: 'sm',
                    controller: 'PollCtrl',
                    windowClass: 'poll-result-modal-window',
                    resolve: {
                        params: function () {
                            return {
                                'pollId': pollId,
                                'pollName': pollName,
                                'pollDescription': pollDescription
                            };
                        }
                    }

                });
            };

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };

            $scope.reloadPolls = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };

        }]);

angular.module('poll')
    .controller('PollCtrl',
        ['$scope', 'PollService', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', '$uibModalInstance', 'params',
            'numericalStringFilter','baseConfig', 'numberStringFilter',
            function ($scope, PollService, DTOptionsBuilder, DTColumnBuilder, $compile, $uibModalInstance, params,
                      numericalStringFilter,baseConfig, numberStringFilter) {

                                    $scope.pollId = params.pollId;
                                    $scope.pollName = params.pollName;
                                    $scope.pollDescription = params.pollDescription;


                                    $scope.loadDetails = function () {
                                        PollService.getPoll($scope.pollId).then(function (response) {

                                            $scope.poll = response;
                                        });
                                    };

                                    $scope.loadPollResults = function () {
                                        PollService.getPollData($scope.pollId).then(function (response) {
                                            $scope.pollResults = response;
                                            $scope.pollLabels = response.options;
                                            $scope.pollData = getPollData(response.options, response.results);
                                            var divisor = 1;
                                            if (response.votingModel !== 0) {
                                                divisor = baseConfig.TOKEN_QUANTS;
                                            }
                                            $scope.total=sumResults(response.results,divisor);
                                            $scope.pollResultTableDate =
                                                buildPollDataArray(response.options, response.results, response.votingModel);
                                        });
                                    };

                                    function sumResults(results, divisor) {
                                        var sum = 0;
                                        for (var i = 0; i < results.length; i++) {
                                            sum = sum + (results[i].result / divisor );
                                        }
                                        return sum;
                                    }

                                    function buildPollDataArray(labels, results, votingModel) {
                                        var divisor = 1;
                                        if (votingModel !== 0) {
                                            divisor = baseConfig.TOKEN_QUANTS;
                                        }
                                        var finalResults = [];
                                        var total = sumResults(results, divisor);
                                        for (var i = 0; i < labels.length; i++) {
                                            var result = {};
                                            var pollResult = results[i];
                                            result.optionName = labels[i];
                                            result.result = pollResult.result / divisor || 0;
                                            result.weight = pollResult.weight / divisor;
                                            if (total !== 0) {
                                                result.percentage = (result.result * 100) / total;
                                            } else {
                                                result.percentage = 0;
                                            }
                                            finalResults.push(result);
                                        }
                                        return finalResults;
                                    }


                                    function getPollData(labels, results) {
                                        var optionSize = results.length;
                                        var resultArray = [];
                                        for (var i = 0; i < optionSize; i++) {
                                            var resultObject = {};
                                            resultObject.key = labels[i];
                                            resultObject.value = results[i].result / 100000000;
                                            if (!resultObject.value) {
                                                resultObject.value = 0;
                                            }
                                            resultArray[i] = resultObject;
                                        }
                                        return resultArray;
                                    }

                                    $scope.options =
                                    {
                                        'chart': {
                                            'type': 'pieChart',
                                            'height': 350,
                                            'showLegend': true,
                                            'noData' : 'No Votes avaiable',
                                            'margin': {
                                                'top': 30,
                                                'right': 75,
                                                'bottom': 50,
                                                'left': 75
                                            },
                                            'bars': {
                                                'forceY': [
                                                    0
                                                ]
                                            },
                                            'bars2': {
                                                'forceY': [
                                                    0
                                                ]
                                            },
                                            'xAxis': {
                                                'axisLabel': 'X Axis'
                                            },
                                            'x2Axis': {
                                                'showMaxMin': false
                                            },
                                            'y1Axis': {
                                                'axisLabel': 'Y1 Axis',
                                                'axisLabelDistance': 12
                                            },
                                            'y2Axis': {
                                                'axisLabel': 'Y2 Axis'
                                            },
                                            x: function (d) {
                                                return d.key;
                                            },
                                            y: function (d) {
                                                return d.value;
                                            },
                                            tooltip:{
                                                valueFormatter:function (d) {
                                                    return numberStringFilter((d * 100/$scope.total)) + ' %';
                                                }
                                            }

                                        }
                                    };

                                    $scope.cancel = function () {
                                        $uibModalInstance.dismiss('cancel');
                                    };


            }]
    );
