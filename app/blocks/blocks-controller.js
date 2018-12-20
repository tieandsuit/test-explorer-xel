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


angular.module('blocks').controller('BlocksCtrl',
    ['$scope', 'BlocksService', 'baseConfig', 'timestampFilter', 'amountTQTFilter', 'DTOptionsBuilder',
        'DTColumnBuilder', '$interval', '$uibModal', '$compile','searchTermFilter', 'quantityToShareFilter',
        'numericalStringFilter', 'quantToAmountFilter', 'shareToQuantiyFilter',
        function ($scope, BlocksService, baseConfig, timestampFilter, amountTQTFilter, DTOptionsBuilder,
                  DTColumnBuilder, $interval, $uibModal, $compile,searchTermFilter, quantityToShareFilter,
                  numericalStringFilter, quantToAmountFilter, shareToQuantiyFilter) {

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('numbers')
              .withDOM('frtip')
              .withOption('responsive', true)
              .withOption('ordering', false)
              .withOption('info', false)
              .withOption('serverSide', true)
              .withDataProp('blocks')
              .withOption('paging', true)
              .withOption('processing', true)
              .withOption('bFilter', false)
              .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    BlocksService.getBlocks(data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'blocks': response.blocks
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('height').withTitle('Height').withOption('bSortable', false).notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-infinity btn-xs" ng-click="openModal(' + data +
                            ')">' + data + '</button>';
                    }),

                DTColumnBuilder.newColumn('block').withTitle('Id').notSortable(),

                DTColumnBuilder.newColumn('numberOfTransactions').withTitle('Txs').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return getBlocksTxs(data);
                        }
                    ),
                DTColumnBuilder.newColumn('totalAmountTQT').withTitle('Amount').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantToAmountFilter(data));
                    }),
                DTColumnBuilder.newColumn('totalFeeTQT').withTitle('Fee').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantToAmountFilter(data));
                    }),
                DTColumnBuilder.newColumn('generatorRS').withTitle('Generator').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),
                DTColumnBuilder.newColumn('timestamp').withTitle('Timestamp').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return timestampFilter(data);
                        }
                    ),

                DTColumnBuilder.newColumn('baseTarget').withTitle('Target').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return baseTarget(data);
                        }
                    ),

            ];

            $scope.openModal = function (height) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'blocks/block.html',
                    size: 'lg',
                    controller: 'BlockCtrl',
                    windowClass: 'block-modal-window',
                    resolve: {
                        params: function () {
                            return {
                                'height': height,
                                'includeTransactions': true
                            };
                        }
                    }

                });

            };

            function baseTarget(value) {

                var target = (value / baseConfig.BASE_TARGET ) * 100;

                if (target < 1000) {

                    return '<span class="label label-success">' + target.toFixed(2) + ' %' + '</span>';

                } else if (target >= 1000 && target < 2500) {

                    return '<span class="label label-warning">' + target.toFixed(2) + ' %' + '</span>';

                } else if (target >= 2500) {

                    return '<span class="label label-danger">' + target.toFixed(2) + ' %' + '</span>';

                } else {

                    return '<span class="label label-default">' + target.toFixed(2) + ' %' + '</span>';
                }

            }

            function getBlocksTxs(value) {

                if (value === 0) {

                    return '<span class="label label-default">' + value + '</span>';

                } else if (value > 0 && value < 100) {

                    return '<span class="label label-success">' + value + '</span>';

                } else if (value >= 100 && value < 200) {

                    return '<span class="label label-warning">' + value + '</span>';

                } else if (value >= 200) {

                    return '<span class="label label-danger">' + value + '</span>';

                }

            }

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };

            $scope.reloadBlocks = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };
        }]);
