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


angular.module('blockExplorer').controller('FooterController',
    ['$scope', 'BlocksService', 'baseConfig', function ($scope, BlocksService, baseConfig) {

        $scope.init = function () {
            $scope.connectedURL = baseConfig.apiUrl;
            BlocksService.getBlockChainStatus().then(function (success) {
                $scope.currentHeight = success.numberOfBlocks;
            });
            $scope.AssignedDate = Date;
        };

    }]);
