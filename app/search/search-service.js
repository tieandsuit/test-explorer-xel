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


angular.module('search').service('SearchService',
    ['Restangular', 'BlocksService', 'searchConfig', function (Restangular, BlocksService, searchConfig) {

        this.searchBlocks = function (searchTerm) {
            return BlocksService.getBlockDetails(searchTerm, true);
        };

        this.searchTransactionById = function (searchTerm) {
            var params = {
                'requestType': 'getTransaction',
                'transaction': searchTerm
            };
            return Restangular.all(searchConfig.searchEndPoint).customGET('', params);
        };

        this.searchBlockById = function (searchTerm) {
            var params = {
                'requestType': 'getBlock',
                'block': searchTerm
            };
            return Restangular.all(searchConfig.searchEndPoint).customGET('', params);
        };

        this.searchAccounts = function (searchTerm) {
            var params = {
                'requestType': 'getAccount',
                'account': searchTerm,
                'includeAssets': true,
                'includeCurrencies': true,
                'includeEffectiveBalance': true,
                'includeLessors': true
            };
            return Restangular.all(searchConfig.searchEndPoint).customGET('', params);
        };

        this.searchTransactions = function (searchTerm) {
            var params = {
                'requestType': 'getTransaction',
                'fullHash': searchTerm,
                'includePhasingResult': true,
            };
            return Restangular.all(searchConfig.searchEndPoint).customGET('', params);
        };
    }]);
