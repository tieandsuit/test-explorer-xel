/******************************************************************************
 * Copyright © 2018 XEL Community                                             *
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


angular.module('accounts',
    ['restangular', 'datatables', 'datatables.bootstrap', 'ui.bootstrap', 'ui.router']);

angular.module('accounts').constant('accountsConfig', {
     'accountsEndPoint': 'api'
});

angular.module('accounts').config(['RestangularProvider', 'accountsConfig', '$stateProvider', '$urlRouterProvider', 'baseConfig',
    function (RestangularProvider, accountsConfig, $stateProvider, $urlRouterProvider, baseConfig) {
        RestangularProvider.setBaseUrl(baseConfig.apiUrl);

        $stateProvider.state('blockExplorer.accounts', {
            url: '^/accounts',
            templateUrl: './accounts/accounts.html',
            controller: 'AccountsCtrl'

        });
    }]);
