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


angular.module('assets').service('AssetsService', ['Restangular', 'assetsConfig', 'baseConfig', function (Restangular, assetsConfig, baseConfig) {

    this.getAssets = function (firstIndex, lastIndex) {
        var params = {
            'requestType': 'getAllAssets',
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeCounts': true,

        };
        return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);

    };

    this.getAsset = function (asset, includeCounts) {
        params = {
            'requestType': 'getAsset',
            'asset': asset,
            'includeCounts': true,
            'includeAssetInfo': true,
        };
        return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
    };

    this.getTrades = function (asset, firstIndex, lastIndex) {
        var params = {
            'requestType': 'getTrades',
            'asset': asset,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeAssetInfo': true,
        };
        return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
    };

    this.getTransfers = function (asset, firstIndex, lastIndex) {
        var params = {
            'requestType': 'getAssetTransfers',
            'asset': asset,
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeAssetInfo': true,
        };
        return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
    };
}]);
