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

angular.module('transactions').service('TransactionsService', ['Restangular', 'transactionsConfig', 'baseConfig',
    function (Restangular, transactionsConfig, baseConfig) {

        this.getTransactions = function (firstIndex, lastIndex) {
            var params = {
                'requestType': 'getTransactions',
                'firstIndex': firstIndex,
                'lastIndex': lastIndex,
                'includePhasingResult': true

            };
            return Restangular.all(baseConfig.baseEndPoint).customGET('', params);
        };


        this.getTransactionsOfAccount = function (account, firstIndex, lastIndex) {
            var params = {
              'requestType': 'getBlockchainTransactions',
              'account': account,
              'firstIndex': firstIndex,
              'lastIndex': lastIndex
            };

            return Restangular.all(transactionsConfig.transactionsEndPoint).customGET('', params);
        };


    }]);
