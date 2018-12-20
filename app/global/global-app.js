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


angular.module('blockExplorer',
    ['blocks', 'assets', 'currency', 'poll', 'unconfirmedTransactions', 'transactions', 'search', 'accounts', 'stats',
        'ui.router','distributions']);

angular.module('blockExplorer')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('blockExplorer', {
            abstract: true,
            url: '/',
            template: '<div ui-view></div>',
        });

        $urlRouterProvider.otherwise('/blocks');
    }]);

angular.module('blockExplorer').run(['$rootScope', 'BASE_OPTIONS', function ($rootScope, BASE_OPTIONS) {
    $rootScope.options = BASE_OPTIONS;
}]);
