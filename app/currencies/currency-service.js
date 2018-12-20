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


angular.module('currency')
    .service('CurrencyService', ['Restangular', 'currencyConfig', function (Restangular, currencyConfig) {

        this.getCurrencies = function (firstIndex, lastIndex) {
            var params = {
                'requestType': 'getAllCurrencies',
                'firstIndex': firstIndex,
                'lastIndex': lastIndex,
                'includeCounts': true
            };
            return Restangular.all(currencyConfig.currencyEndPoint).customGET('', params);

        };

        this.getCurrency = function (code, includeCounts) {
            params = {
                'requestType': 'getCurrency',
                'code': code,
                'includeCounts': includeCounts,
                // 'includeCounts': true
            };
            return Restangular.all(currencyConfig.currencyEndPoint).customGET('', params);
        };

        this.getExchanges = function (currency, firstIndex, lastIndex) {
            var params = {
                'requestType': 'getExchanges',
                'currency': currency,
                'firstIndex': firstIndex,
                'lastIndex': lastIndex
            };
            return Restangular.all(currencyConfig.currencyEndPoint).customGET('', params);
        };

        this.getTransfers=function(currency,firstIndex,lastIndex){
            var params = {
                'requestType': 'getCurrencyTransfers',
                'currency': currency,
                'firstIndex': firstIndex,
                'lastIndex': lastIndex
            };
            return Restangular.all(currencyConfig.currencyEndPoint).customGET('', params);
        };

    }])
;
