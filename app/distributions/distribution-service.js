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


angular.module('distributions').service('DistributionService',
    ['Restangular', 'distributionsConfig', function (Restangular, distributionsConfig) {

        this.getDistributions =
            function (firstIndex, lastIndex, includeDistributions, distributionStart, distributionEnd,
                      interval) {

                var params = {
                    'requestType': 'getAccountBalances',
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'includeDistribution': includeDistributions,
                    'distributionStart': distributionStart,
                    'distributionEnd': distributionEnd,
                    'interval': interval
                };

                Restangular.setBaseUrl( distributionsConfig.distributionsUrl);
                return Restangular.all(distributionsConfig.distributionsEndPoint).customGET('', params);

            };

    }]);
