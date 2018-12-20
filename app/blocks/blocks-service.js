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


angular.module('blocks').service('BlocksService', ['Restangular', 'blocksConfig', function (Restangular, blocksConfig) {

    this.getBlocks = function (firstIndex, lastIndex) {
        var params = {
            'requestType': 'getBlocks',
            'firstIndex': firstIndex,
            'lastIndex': lastIndex
        };
        return Restangular.all(blocksConfig.blocksEndPoint).customGET('', params);

    };

    this.getBlockDetails = function (height, includeTransactions) {
        var params = {
            'requestType': 'getBlock',
            'height': height,
            'includeTransactions': includeTransactions
        };
        return Restangular.all(blocksConfig.blocksEndPoint).customGET('', params);
    };

    this.getBlockChainStatus = function () {
        var params = {
            'requestType': 'getBlockchainStatus',
        };
        return Restangular.all(blocksConfig.blocksEndPoint).customGET('', params);
    };

}]);
