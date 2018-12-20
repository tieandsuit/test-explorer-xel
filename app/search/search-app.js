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

var searchApp = angular.module('search',
    ['baseBlockExplorer', 'restangular', 'datatables', 'blocks', 'accounts', 'transactions', 'datatables.bootstrap',
        'ui.bootstrap', 'poll', 'ui.router', 'ja.qr','nvd3']);

angular.module('search').constant('searchConfig', {
    'searchEndPoint': 'api',
    'searchAccountString': 'XEL'

});

angular.module('search').config(['RestangularProvider', 'searchConfig', '$stateProvider', '$urlRouterProvider', 'baseConfig',
    function (RestangularProvider, searchConfig, $stateProvider, $urlRouterProvider, baseConfig) {
        RestangularProvider.setBaseUrl(baseConfig.apiUrl);
        RestangularProvider.setRestangularFields({
            options: '_options'
        });

        $stateProvider.state('blockExplorer.search', {
            url: '^/search',
            templateUrl: './search/search.html',
            controller: 'SearchCtrl'

        });
    }]);
