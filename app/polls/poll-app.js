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

angular.module('poll',
    ['baseBlockExplorer', 'restangular', 'datatables', 'datatables.bootstrap', 'ui.bootstrap', 'ui.router', 'nvd3']);

angular.module('poll').constant('pollConfig', {
    'pollEndPoint': 'api'
});

angular.module('poll').config(['RestangularProvider', 'pollConfig', '$stateProvider', '$urlRouterProvider', 'baseConfig',
    function (RestangularProvider, pollConfig, $stateProvider, $urlRouterProvider, baseConfig) {
        RestangularProvider.setBaseUrl(baseConfig.apiUrl);
        RestangularProvider.setRestangularFields({
            options: '_options'
        });

        $stateProvider.state('blockExplorer.polls', {
            url: '^/polls',
            templateUrl: './polls/polls.html',
            controller: 'PollsCtrl'

        });
    }]);
