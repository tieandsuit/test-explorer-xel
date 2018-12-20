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

angular.module('poll').service('PollService', ['Restangular', 'pollConfig', function (Restangular, pollConfig) {

    this.getPolls = function (firstIndex, lastIndex) {
        var params = {
            'requestType': 'getAllPolls',
            'firstIndex': firstIndex,
            'lastIndex': lastIndex,
            'includeFinished': true
        };
        return Restangular.all(pollConfig.pollEndPoint).customGET('', params);

    };

    this.getPoll = function (poll) {
        var params = {
            'requestType': 'getPoll',
            'poll': poll
        };
        return Restangular.all(pollConfig.pollEndPoint).customGET('', params);
    };

    this.getPollData = function (pollId) {
        var params = {
            'requestType': 'getPollResult',
            'poll': pollId
        };
        return Restangular.all(pollConfig.pollEndPoint).customGET('', params);
    };
}]);
