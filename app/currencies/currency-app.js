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


angular.module('currency',
    ['restangular', 'datatables', 'datatables.bootstrap', 'ui.bootstrap', 'ui.router', 'search']);

angular.module('currency').constant('currencyConfig', {
  'currencyEndPoint': 'api'
});

angular.module('currency').config(['RestangularProvider', 'currencyConfig', '$stateProvider', '$urlRouterProvider', 'baseConfig',
    function (RestangularProvider, currencyConfig, $stateProvider, $urlRouterProvider, baseConfig) {
        RestangularProvider.setBaseUrl(baseConfig.apiUrl);

        $stateProvider.state('blockExplorer.currencies', {
            url: '^/currencies',
            templateUrl: './currencies/currencies.html',
            controller: 'CurrenciesCtrl'

        });


    }]);
