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

angular.module('stats').service('StatsService', ['Restangular', 'statsConfig', function (Restangular, statsConfig) {

    this.getStats = function () {
        var params = {
            'requestType': 'getStatistics',
        };
        return Restangular.all(statsConfig.statsEndPoint).customGET('', params);

    };

    this.getBalance = function (account) {
        var params = {
            'requestType': 'getBalance',
            'account': account
        };
        return Restangular.all(statsConfig.statsEndPoint).customGET('', params);
    };

}]);
