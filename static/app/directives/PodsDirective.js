App.directive('mcPodCover', [function() {
        // Return the directive configuration.
        return {

            templateUrl: "views/pods/pods.card.directive.html",
         
        }
    }]);

App.directive('mcPodSearch', [function() {
        // Return the directive configuration.
        return {
            restrict: 'A',
            scope: {
                pod: '@',
                onSubscribers: '&?',
                onView: '&?',
                onMoreInfo: '&?'
            },
            templateUrl: "views/pods/pods.searchpods.directive.html",
            link: function(scope, elem, attrs) {

            }
        }
    }]);

App.directive('mcPodSubscribe', [function() {
        // Return the directive configuration.
        return {
            restrict: 'A',
           
            templateUrl: "views/pods/pods.subscribe.directive.html",
        }
    }]);

    App.directive('mcPodCoverSymbol', [function() {
        // Return the directive configuration.
        return {
            restrict: 'A',
            templateUrl: "views/pods/pods.symbol.directive.html",
        }
    }]);

    App.directive('mcPodCoverCast', [function() {
        // Return the directive configuration.
        return {
            restrict: 'A',
            scope: {
                pod: '@',
                onSubscribers: '&?',
                onView: '&?',
                onMoreInfo: '&?'
            },
            templateUrl: "views/pods/pods.cast.directive.html",
            link: function(scope, elem, attrs) {

            }
        }
    }]);