timerApp.service('TimerService', function ($interval) {
    var timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

    var jobs = [];
    $interval(function() {
        jobs.forEach(function(job) {
            job();
        });
    }, 1000);

    this.addJob = function(job) {
        if (job) {
            jobs.push(job);
        }
    };

    this.time2sec = function(hms) {
        var split = hms.split(":").join("").split("");
        var h = parseInt(split[0] + split[1]);
        var m = parseInt(split[2] + split[3]);
        var s = parseInt(split[4] + split[5]);

        var sec = h * 60 * 60;
        sec += m * 60;
        sec += s;

        return sec;
    };

    this.sec2time = function(sec) {
        return /..:..:../.exec(new Date(sec * 1000 + timezoneOffset))[0];
    };
});

timerApp.controller("TimerController", function ($scope, $timeout, TimerService, OptionService) {
    $scope.config = OptionService.getConfig();
    $scope.clock = /..:..:../.exec(new Date())[0];

    $scope.timerStatus = {
        status: "stop"
    };

    TimerService.addJob(function() {
        $scope.clock = /..:..:../.exec(new Date())[0];
    });

    TimerService.addJob(function () {
        if ($scope.timerStatus.status == "start") {
            var sec = TimerService.time2sec($scope.timer);
            if (sec > 0) {
                $scope.timer = TimerService.sec2time(sec - 1);
            } else {
                $scope.done();
            }
        }
    });
    TimerService.addJob(function() {
        if ($scope.timerStatus.status == "start") {
            var timer = $scope.timer.split(":").join("").slice(2, 6);
            chrome.browserAction.setBadgeText({text: timer});
            chrome.browserAction.setBadgeBackgroundColor({color: "#ff0000"});
        } else {
            chrome.browserAction.setBadgeText({text: ""});
        }
    });

    $scope.start = function() {
        $scope.timerStatus.status = "start";
    };

    $scope.pause = function() {
        $scope.timerStatus.status = "pause";
    };

    $scope.done = function() {
        OptionService.playAudio();
        $scope.timerStatus.status = "stop";
    };

    $scope.stop = function() {
        $scope.timerStatus.status = "stop";
        $scope.timer = $scope.config.interval;
    };

    $scope.setting = function() {
        var optionsUrl = chrome.extension.getURL('options.html');
        chrome.tabs.query({url: optionsUrl}, function(tabs) {
            if (tabs.length) {
                chrome.tabs.update(tabs[0].id, {active: true});
            } else {
                chrome.tabs.create({url: optionsUrl});
            }
        });
    };
    $scope.stop();
});

timerApp.directive('inputMask', function(){
    return {
        restrict: 'A',
        link: function(scope, el, attrs){
            $(el).inputmask(scope.$eval(attrs.inputMask));
            $(el).on('change', function(){
                scope.$eval(attrs.ngModel + "='" + el.val() + "'");
                // or scope[attrs.ngModel] = el.val() if your expression doesn't contain dot.
            });
        }
    };
});