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


angular.module('accounts')
    .service('AccountService', ['Restangular', 'accountsConfig', function (Restangular, accountsConfig) {

        this.getAccounts = function (firstIndex, lastIndex) {
            var params = {
                'requestType': 'getAccounts',
                'firstIndex': firstIndex,
                'lastIndex': lastIndex
            };
            return Restangular.all(accountsConfig.accountsEndPoint).customGET('', params);

        };

        this.searchAccount = function (account) {
            var params = {
                'requestType': 'getAccount',
                'account': account,
                'includeAssets': true,
                'includeCurrencies': true,
                'includeEffectiveBalance': true
            };
            return Restangular.all(accountsConfig.searchEndPoint).customGET('', params);
        };

        this.getBalance = function (account) {
            var params = {
                'requestType': 'getBalance',
                'account': account
            };
            return Restangular.all(accountsConfig.searchEndPoint).customGET('', params);
        };

        this.getAccountAssets = function (account) {
            var params = {
                'requestType': 'getAccountAssets',
                'account': account,
                'includeAssetInfo': true,
            };
            return Restangular.all(accountsConfig.accountsEndPoint).customGET('', params);
        };

        this.getAccountCurrencies = function (account) {
            var params = {
                'requestType': 'getAccountCurrencies',
                'account': account,
                'includeCurrencyInfo': true,
            };
            return Restangular.all(accountsConfig.accountsEndPoint).customGET('', params);
        };

        this.getAccountPolls = function (account) {
            var params = {
                'requestType': 'getPolls',
                'account': account,
                'includeFinished':true
            };
            return Restangular.all(accountsConfig.accountsEndPoint).customGET('', params);
        };

        this.getAccountAliases = function (account) {
            var params = {
                'requestType': 'getAliases',
                'account': account,
            };
            return Restangular.all(accountsConfig.accountsEndPoint).customGET('', params);
        };
    }]);
