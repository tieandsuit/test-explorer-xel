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


angular.module('blocks',
    ['baseBlockExplorer', 'restangular', 'datatables', 'datatables.bootstrap', 'ui.bootstrap', 'ui.router']);

angular.module('blocks').constant('blocksConfig', {
  'blocksEndPoint': 'api'
});

angular.module('blocks').config(['RestangularProvider', 'blocksConfig', '$stateProvider', '$urlRouterProvider', 'baseConfig',
    function (RestangularProvider, blocksConfig, $stateProvider, $urlRouterProvider, baseConfig) {

        RestangularProvider.setBaseUrl( baseConfig.apiUrl );

        $stateProvider.state('blockExplorer.blocks', {
            url: '^/blocks',
            templateUrl: './blocks/blocks.html',
            controller: 'BlocksCtrl'

        });

    }]);
