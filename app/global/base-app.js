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


angular.module('baseBlockExplorer', ['ngSanitize', 'angularMoment', 'cc.autorefresh']);

angular.module('baseBlockExplorer').constant('baseConfig', {

    'apiUrl': 'http://xel.org:17876',
    'genesisAccount' : 'XEL-H22F-GBXY-4BXS-6S4VQ', // Main

    // 'apiUrl': 'http://xel.org:17876',   // Test
    // 'genesisAccount' : 'XEL-H22F-GBXY-4BXS-6S4VQ',

    'baseEndPoint': 'api',
    'TOKEN_QUANTS': 100000000,
    'EPOCH': 1484046000,
    'BASE_TARGET' : 17080318,
    'initialSupply' : 100000000
});

angular.module('baseBlockExplorer').constant('BASE_OPTIONS', {
    'AUTO_PAGE_REFRESH_INTERVAL': 60000,
    'VERSION': '3.1.3'
});

angular.module('baseBlockExplorer').filter('timestamp', ['$sce', 'moment', 'baseConfig', function ($sce, moment, baseConfig) {
    return function (val) {
        try {
            var actual = val + baseConfig.EPOCH;
            var momentObj = moment.unix(actual);
            return momentObj.format('YYYY-MM-DDTHH:mm:ss');
        } catch (e) {
            return val;
        }
    };
}]);

angular.module('baseBlockExplorer').filter('amountTQT', ['$sce', 'baseConfig',  function ($sce, baseConfig) {
    return function (val) {
        var amount = val / baseConfig.TOKEN_QUANTS;
        return amount.toLocaleString('en-US', {minimumFractionDigits: 2});
    };
}]);

angular.module('baseBlockExplorer').filter('amountTKN', ['$sce', function ($sce) {
    return function (val) {
        val = parseInt(val);
        return val.toLocaleString('en-US', {minimumFractionDigits: 2});
    };
}]);

angular.module('baseBlockExplorer').filter('supply', ['$sce', function ($sce) {
    return function (val, numOfDecimals) {
        var actualPow = numOfDecimals;
        var divider = Math.pow(10, actualPow);
        val = val / divider;
        return val.toLocaleString('en-US', {minimumFractionDigits: 2});
    };
}]);

angular.module('baseBlockExplorer').filter('decimals', ['$sce', function ($sce) {
    return function (val, numOfDecimals) {
        var divider = Math.pow(10, numOfDecimals);
        val = val / divider;
        return val.toLocaleString('en-US', {minimumFractionDigits: 2});
    };
}]);

angular.module('baseBlockExplorer').filter('numericalString', ['$sce', 'baseConfig', function ($sce, baseConfig) {
    return function (val) {
        if (!val) {
            val = 0;
        }
        return val.toLocaleString('en-US', {minimumFractionDigits: 2});
    };
}]);

angular.module('baseBlockExplorer').filter('numericalFormat', ['$sce', 'baseConfig', function ($sce, baseConfig) {
    return function (val) {
        if (!val) {
            val = 0;
        }
        return val.toLocaleString('en-US', {minimumFractionDigits: 0});
    };
}]);

angular.module('baseBlockExplorer').filter('trustedhtml',
    function ($sce) {
        return $sce.trustAsHtml;
    }
);

angular.module('baseBlockExplorer').filter('votingModel', ['$sce', function ($sce) {
    return function (val) {

        val = parseInt(val);

        switch (val) {
            case 0:
                return 'Account';
            case 1:
                return 'Balance';
            case 2:
                return 'Asset';
            case 3:
                return 'Currency';
            default:
                return val;
        }
    };
}]);

angular.module('baseBlockExplorer').filter('transactionTextType', ['$sce', function ($sce) {
    return function (val) {
        switch (val) {
            case 0:
                return 'Payment';
            case 1:
                return 'Messaging';
            case 2:
                return 'Colored Coins';
            case 3:
                return 'Digital Goods';
            case 4:
                return 'Account Control';
            case 5:
                return 'Monetary System';
            case 6:
                return 'Data';
            case 7:
                return 'Shuffling';
            case 21:
                return 'Advanced Transactions';
            case 22:
                return 'AT';

            default:
                return val;
        }
    };
}]);

angular.module('baseBlockExplorer').filter('transactionTextSubType', ['$sce', function ($sce) {
    return function (type, subType) {
        switch (type) {
            case 0:
                switch (subType) {
                    case 0:
                        return 'Ordinary Payment';
                    default:
                        return subType;
                }
                break;
            case 1:
                switch (subType) {
                    case 0:
                        return 'Arbitary Message';
                    case 1:
                        return 'Alias Assignment';
                    case 2:
                        return 'Poll Creation';
                    case 3:
                        return 'Vote Casting';
                    case 4:
                        return 'Hub Announcement';
                    case 5:
                        return 'Account Info';
                    case 6:
                        return 'Alias Sell';
                    case 7:
                        return 'Alias Buy';
                    case 8:
                        return 'Alias Delete';
                    case 9:
                        return 'Phasing Vote Casting';
                    case 10:
                        return 'Account Property';
                    case 11:
                        return 'Account Property delete';
                    default:
                        return subType;
                }
                break;
            case 2:
                switch (subType) {
                    case 0:
                        return 'Asset Issuance';
                    case 1:
                        return 'Asset Transfer';
                    case 2:
                        return 'Ask Order Placement';
                    case 3:
                        return 'Bid Order Placement';
                    case 4:
                        return 'Ask Order Cancellation';
                    case 5:
                        return 'Bid Order Cancellation';
                    case 6:
                        return 'Dividend Payment';
                    case 7:
                        return 'Asset Delete';
                    default:
                        return subType;
                }
                break;
            case 3:
                switch (subType) {
                    case 0:
                        return 'Listing';
                    case 1:
                        return 'Delisting';
                    case 2:
                        return 'Price Change';
                    case 3:
                        return 'Quantity Change';
                    case 4:
                        return 'Purchase';
                    case 5:
                        return 'Delivery';
                    case 6:
                        return 'Feedback';
                    case 7:
                        return 'Refund';
                    default:
                        return subType;
                }
                break;
            case 4:
                switch (subType) {
                    case 0:
                        return 'Effective Balance Lease';
                    case 1:
                        return 'Phasing Only';
                    default:
                        return subType;
                }
                break;

            case 5:
                  switch (subType) {
                      case 0:
                          return 'Currency Issuance';
                      case 1:
                          return 'Reserve Increase';
                      case 2:
                          return 'Resverve Claim';
                      case 3:
                          return 'Currency Transfer';
                      case 4:
                          return 'Publish Exchange Offer';
                      case 5:
                          return 'Exchange Buy';
                      case 6:
                          return 'Exchange Sell';
                      case 7:
                          return 'Currency Minting';
                      case 8:
                          return 'Currency Deletion';
                      default:
                          return subType;
                  }
                  break;

            case 7:
                switch (subType) {
                    case 0:
                        return 'Shuffling Creation';
                    case 1:
                        return 'Shuffling Registration';
                    case 2:
                        return 'Shuffling Processing';
                    case 3:
                        return 'Shuffling Recipients';
                    case 4:
                        return 'Shuffling Verification';
                    case 5:
                        return 'Shuffling Cancel';
                    default:
                        return subType;
                }
                break;

            case 21:
                  switch (subType) {
                      case 0:
                          return 'Escrow Creation';
                      case 1:
                          return 'Escrow Sign';
                      case 2:
                          return 'Escrow Results';
                      case 3:
                          return 'Subscription Creation';
                      case 4:
                          return 'Subscription Cancel';
                      case 5:
                          return 'Subscription Payment';
                      default:
                          return subType;
                  }
                  break;

            case 22:
                  switch (subType) {
                      case 0:
                          return 'AT Creation';
                      case 1:
                          return 'AT Payment';
                      default:
                          return subType;
                  }
                  break;
            default:
                return subType;
        }
    };
}]);

angular.module('baseBlockExplorer').filter('currencyModel', ['$sce', function ($sce) {
    return function (val) {
        switch (val) {
            case 1:
                return 'Exchangeable';
            case 8:
                return 'Claimable';
            case 16:
                return 'Mintable';
            case 2:
                return 'Controllable';
            case 4:
                return 'Reservable';
            case 32:
                return 'Non Shuffleable';
            default:
                return val;
        }
    };
}]);

angular.module('baseBlockExplorer').directive('dynamic', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.dynamic, function (html) {
                ele.html(html);
                $compile(ele.contents())(scope);
            });
        }
    };
}]);

angular.module('baseBlockExplorer').directive('compile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
            function (scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            },
            function (value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
}]);

angular.module('baseBlockExplorer').filter('isEmpty', ['$sce', function ($sce) {
    return function (val) {
        if (val === undefined || val === '') {

            return 'No Data Available';

        } else {
            return val;
        }
    };
}]);

angular.module('baseBlockExplorer').filter('isEnabled', ['$sce', function ($sce) {
    return function (val) {
        switch (val) {
            case true:
                return '<small> <span class="glyphicon glyphicon-ok" style="color:black"></span> </small>';
            case false:
                return '<small> <span class="glyphicon glyphicon-remove" style="color:black"></span> </small>';
            default:
                return '<small> <span class="glyphicon glyphicon-remove" style="color:black"></span> </small>';
        }
    };
}]);

angular.module('baseBlockExplorer').filter('numericalString', ['$sce','baseConfig', function ($sce, baseConfig) {
    return function (val) {
        if (!val) {
            val = 0;
        }
        return val.toLocaleString('en-US', {minimumFractionDigits: 2});
    };
}]);

angular.module('baseBlockExplorer').filter('amountToQuant', ['$sce', 'baseConfig', function ($sce, baseConfig) {
    return function (val) {
        if (!val) {
            val = 0;
        }
        var amount = parseFloat(val) * baseConfig.TOKEN_QUANTS;
        return amount;
    };
}]);

angular.module('baseBlockExplorer').filter('quantToAmount', ['$sce', 'baseConfig', function ($sce, baseConfig) {
    return function (val) {
        if (!val) {
            val = 0;
        }
        var amount = parseFloat(val) / baseConfig.TOKEN_QUANTS;
        return amount;
    };
}]);

angular.module('baseBlockExplorer').filter('quantityToShare', ['$sce', function ($sce) {
    return function (val, numOfDecimals) {
        var actualPow = numOfDecimals;
        var divider = Math.pow(10, actualPow);
        val = parseFloat(val) / divider;
        return val;
    };
}]);

angular.module('baseBlockExplorer').filter('shareToQuantiy', ['$sce', function ($sce) {
    return function (val, numOfDecimals) {
        var actualPow = numOfDecimals;
        var multiplier = Math.pow(10, actualPow);
        val = parseFloat(val) * multiplier;
        return val;
    };
}]);

angular.module('baseBlockExplorer').filter('searchTerm', ['$sce', function ($sce) {
    return function (val) {

        // Filter automated transactions with numeric account id 0
        if (val && val !== 'XEL-2222-2222-2222-22222') {
            return '<a href="" ng-controller="SearchCtrl" ng-click="searchValue(\'' + val +
                '\')">' + val + '</a>';
        } else {
            return '';
        }

    };
}]);

angular.module('baseBlockExplorer').filter('transactionIconSubType', ['$sce', function ($sce) {
    return function (type, subType) {

        switch (type) {
            case 0:
                switch (subType) {
                    case 0:
                        return '<i class="fa fa-usd" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Ordinary Payment"></i>';
                    default:
                        return subType;
                }
                break;
            case 1:
                switch (subType) {
                    case 0:
                        return '<i class="fa fa-envelope-o" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Encrypted Message"></i>';
                    case 1:
                        return '<i class="fa fa-share-alt" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Alias Assigment"></i>';
                    case 2:
                        return '<i class="fa fa-signal" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Poll Creation"></i>';
                    case 3:
                        return '<i class="fa fa-signal" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Vote Casting"></i>';
                    case 4:
                        return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Hub Announcement"></i>';
                    case 5:
                        return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Account Info"></i>';
                    case 6:
                        return '<i class="fa fa-share-alt" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Alias Sell"></i>';
                    case 7:
                        return '<i class="fa fa-share-alt" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Alias Buy"></i>';
                    case 8:
                        return '<i class="fa fa-share-alt" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Alias Delete"></i>';
                    case 9:
                        return '<i class="fa fa-signal" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Phasing Vote Casting"></i>';
                    case 10:
                        return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Account Property"></i>';
                    case 11:
                        return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Account Property delete"></i>';
                    default:
                        return subType;
                }
                break;
            case 2:
                switch (subType) {
                    case 0:
                        return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Asset Issuance"></i>';
                    case 1:
                        return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Asset Transfer"></i>';
                    case 2:
                        return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Ask Order Placement"></i>';
                    case 3:
                        return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Bid Order Placement"></i>';
                    case 4:
                        return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Ask Order Cancellation"></i>';
                    case 5:
                        return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Bid Order Cancellation"></i>';
                    case 6:
                        return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Dividend Payment"></i>';
                    case 7:
                        return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Asset Delete"></i>';
                    default:
                        return subType;
                }
                break;

            case 4:
                switch (subType) {
                    case 0:
                        return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Effective Balance Lease"></i>';
                    case 1:
                        return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Account Control"></i>';
                    default:
                        return subType;
                }
                break;
            case 5:
                switch (subType) {
                    case 0:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Currency Issuance"></i>';
                    case 1:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Reserve Increase"></i>';
                    case 2:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Resverve Claim"></i>';
                    case 3:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Currency Transfer"></i>';
                    case 4:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Publish Exchange Offer"></i>';
                    case 5:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Exchange Buy"></i>';
                    case 6:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Exchange Sell"></i>';
                    case 7:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Currency Minting"></i>';
                    case 8:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Currency Deletion"></i>';
                    default:
                        return subType;
                }
                break;


            case 7:
                switch (subType) {
                    case 0:
                        return '<i class="fa fa-user-secret" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Shuffling Creation"></i>';
                    case 1:
                        return '<i class="fa fa-user-secret" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Shuffling Registration"></i>';
                    case 2:
                        return '<i class="fa fa-user-secret" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Shuffling Processing"></i>';
                    case 3:
                        return '<i class="fa fa-user-secret" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Shuffling Recipients"></i>';
                    case 4:
                        return '<i class="fa fa-user-secret" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Shuffling Verification"></i>';
                    case 5:
                        return '<i class="fa fa-user-secret" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Shuffling Cancel"></i>';

                    default:
                        return subType;
                }
                break;

            case 21:
                switch (subType) {
                    case 0:
                        return '<i class="fa fa-handshake-o" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Escrow Creation"></i>';
                    case 1:
                        return '<i class="fa fa-handshake-o" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Escrow Sign"></i>';
                    case 2:
                        return '<i class="fa fa-handshake-o" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Escrow Results"></i>';
                    case 3:
                        return '<i class="fa fa-hourglass" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Subscription Creation"></i>';
                    case 4:
                        return '<i class="fa fa-hourglass-o" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Subscription Cancel"></i>';
                    case 5:
                        return '<i class="fa fa-hourglass-half" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Subscription Payment"></i>';
                    default:
                        return subType;
                }
                break;

            case 22:
                switch (subType) {
                    case 0:
                        return '<i class="fa fa-cogs" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="AT Creation"></i>';
                    case 1:
                        return '<i class="fa fa-cogs" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="AT Payment"></i>';
                    default:
                        return subType;
                }
                break;

            default:
                return subType;
        }
    };
}]);

angular.module('baseBlockExplorer').filter('JSONStringify', ['$sce', function ($sce) {
    return function (data) {

        return JSON.stringify(data);

    };
}]);

angular.module('baseBlockExplorer').filter('transactionConf', ['$sce', function ($sce) {
    return function (value) {
        if (!value) {
            value = 0;
        }
        if (value === 0) {

            return '<span class="label label-default">' + value + '</span>';

        } else if (value > 0 && value < 10) {

            return '<span class="label label-danger">' + value + '</span>';

        } else if (value >= 10 && value < 100) {

            return '<span class="label label-warning">' + value + '</span>';

        } else if (value >= 100 && value < 720) {

            return '<span class="label label-success">' + value + '</span>';

        } else if (value >= 720) {

            return '<span class="label label-success">+720</span>';

        } else {

            return '<span class="label label-primary">' + value + '</span>';

        }
    };
}]);

angular.module('baseBlockExplorer').filter('isMessage', ['$sce', function ($sce) {
    return function (type, subType) {

        if (type === 1 && subType === 0) {
            return '</small> <i class="fa fa-check" aria-hidden="true"></i> </small>';
        } else {
            return '</small> <i class="fa fa-times" aria-hidden="true"></i> </small>';
        }

    };
}]);

angular.module('baseBlockExplorer').filter('hasMessage', ['$sce', function ($sce) {
    return function (row, account) {
        if (row.attachment.encryptedMessage) {
            if (account === row.senderRS) {
                return ' <i class="fa fa-upload" aria-hidden="true" style="color: black;"></i> ';
            } else if (account === row.recipientRS) {
                return '<i class="fa fa-download" aria-hidden="true" style="color:black;"></i>';
            } else {
                return '</small> <i class="fa fa-check" aria-hidden="true"></i> </small>';
            }
        } else {
            return '</small> <i class="fa fa-times" aria-hidden="true"></i> </small>';
        }

    };
}]);

angular.module('baseBlockExplorer').filter('buysell', ['$sce', function ($sce) {
    return function (val) {
        switch (val) {
            case 'buy':
                return '<span class="label label-success">B</span>';
            case 'sell':
                return '<span class="label label-danger">S</span>';
            default:
                return '<span class="label label-default">U</span>';
        }
    };
}]);

angular.module('baseBlockExplorer').filter('transactionTextSubType2', ['$sce', function ($sce) {
    return function (type, subType) {

        switch (type) {
            case 0:
                switch (subType) {
                    case 0:
                        return 'Ordinary Payment';
                    default:
                        return subType;
                }
                break;
            case 1:
                switch (subType) {
                    case 0:
                        return 'Arbitary Message';
                    case 1:
                        return 'Alias Assignment';
                    case 2:
                        return 'Poll Creation';
                    case 3:
                        return 'Vote Casting';
                    case 4:
                        return 'Hub Announcement';
                    case 5:
                        return 'Account Info';
                    case 6:
                        return 'Alias Sell';
                    case 7:
                        return 'Alias Buy';
                    case 8:
                        return 'Alias Delete';
                    case 9:
                        return 'Phasing Vote Casting';
                    case 10:
                        return 'Account Property';
                    case 11:
                        return 'Account Property delete';
                    default:
                        return subType;
                }
                break;
            case 2:
                switch (subType) {
                    case 0:
                        return 'Asset Issuance';
                    case 1:
                        return 'Asset Transfer';
                    case 2:
                        return 'Ask Order Placement';
                    case 3:
                        return 'Bid Order Placement';
                    case 4:
                        return 'Ask Order Cancellation';
                    case 5:
                        return 'Bid Order Cancellation';
                    case 6:
                        return 'Dividend Payment';
                    case 7:
                        return 'Asset Delete';
                    default:
                        return subType;
                }
                break;

            case 4:
                switch (subType) {
                    case 0:
                        return 'Effective Balance Lease';
                    case 1:
                        return 'Phasing Only';
                    default:
                        return subType;
                }
                break;
            case 5:
                switch (subType) {
                    case 0:
                        return 'Currency Issuance';
                    case 1:
                        return 'Reserve Increase';
                    case 2:
                        return 'Resverve Claim';
                    case 3:
                        return 'Currency Transfer';
                    case 4:
                        return 'Publish Exchange Offer';
                    case 5:
                        return 'Exchange Buy';
                    case 6:
                        return 'Exchange Sell';
                    case 7:
                        return 'Currency Minting';
                    case 8:
                        return 'Currency Deletion';
                    default:
                        return subType;
                }
                break;

                case 7:
                    switch (subType) {
                        case 0:
                            return 'Shuffling Creation';
                        case 1:
                            return 'Shuffling Registration';
                        case 2:
                            return 'Shuffling Processing';
                        case 3:
                            return 'Shuffling Recipients';
                        case 4:
                            return 'Shuffling Verification';
                        case 5:
                            return 'Shuffling Cancel';
                        default:
                            return subType;
                    }
                    break;

                case 21:
                    switch (subType) {
                        case 0:
                            return 'Escrow Creation';
                        case 1:
                            return 'Escrow Sign';
                        case 2:
                            return 'Escrow Results';
                        case 3:
                            return 'Subscription Creation';
                        case 4:
                            return 'Subscription Cancel';
                        case 5:
                            return 'Subscription Payment';
                        default:
                            return subType;
                    }
                    break;

                case 22:
                    switch (subType) {
                        case 0:
                            return 'AT Creation';
                        case 1:
                            return 'AT Payment';
                        default:
                            return subType;
                    }
                    break;

            default:
                return subType;
        }
    };
}]);

angular.module('baseBlockExplorer').filter('numberString', ['$sce', function ($sce) {
    return function (val, numOfDecimals) {
        return val.toLocaleString('en-US', {maximumFractionDigits: numOfDecimals});
    };
}]);

angular.module('baseBlockExplorer').filter('votingModelLabel', ['$sce', function ($sce) {
    return function (val) {

        val = parseInt(val);

        switch (val) {
            case 0:
                return '<i class="fa fa-user-o" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Account"></i>'; // Account
            case 1:
                return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Balance"></i>'; // 'Balance';
            case 2:
                return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Asset"></i>'; // 'Asset';
            case 3:
                return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Currency"></i>'; //'Currency';
            default:
                return val;
        }
    };
}]);
