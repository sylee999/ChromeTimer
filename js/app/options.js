timerApp.factory('_', function() {
    return window._;
});
timerApp.service('OptionService', function(_) {
    var config = {};
    var _default_config = {
        windowType: "panel",
        interval: "00:10:00",
        font: "Courier New",
        sound: "Cuckoo",
        size: 2,
        showClock: 'Y',
        bgColor: "#2F4F4F",
        textColor: "#ADFF2F"
    };
    this.load = function() {
        config = _.defaults(config, localStorage, _default_config);
    };
    this.load();

    this.save = function(_config) {
        _.extend(localStorage, _config);
    };

    var installFontList = [];
    chrome.fontSettings.getFontList(function(fontList) {
        fontList.forEach(function(font) {
            installFontList.push(font);
        });
    });

    this.getFontList = function() {
        return installFontList;
    };

    this.getConfig = function() {
        return config;
    };

    this.playAudio = function() {
        var sound = config.sound;
        if (sound == 'TTS') {
            chrome.tts.speak(config.soundText, {'lang': 'ko-KR'});
        } else {
            new Audio("sounds/" + sound + ".wav").play();
        }
    }
});

timerApp.controller("OptionController", function($scope, OptionService) {
    $scope.config = OptionService.getConfig();
    $scope.$watch("config", function (config) {
        OptionService.save(config);
    }, true);

    $scope.fontList = OptionService.getFontList();

    $scope.audioOptions = {
        status: "stop"
    };
    $scope.playAudio = function() {
        OptionService.playAudio();
//            $scope.audioOptions.audio = new Audio("sounds/" + sound + ".wav");
//            $scope.audioOptions.audio.play();
//            $scope.audioOptions.type = "wav";
//        $scope.audioOptions.status = "start";
//        $scope.audioOptions.audio.addEventListener("pause", function() {
//            $scope.audioOptions.status = "stop";
//            $scope.$apply();
//        });
    };
    $scope.stopAudio = function() {
        if ($scope.audioOptions.audio && !$scope.audioOptions.audio.paused) {
            $scope.audioOptions.audio.pause();
            $scope.audioOptions.audio.currentTime = 0;
            $scope.audioOptions.status = "stop";
        }
    };
});