/**
 * Copyright (c) 2011 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

var lastUtterance = '';

if (localStorage['lastVersionUsed'] != '1') {
    localStorage['lastVersionUsed'] = '1';
    chrome.tabs.create({
        url: chrome.extension.getURL('options.html')
    });
}

var windowId;
chrome.browserAction.onClicked.addListener(function (tab) {
    toggle();
});

chrome.windows.onCreated.addListener(function(window) {
    chrome.browserAction.setIcon({path: 'img/ChromeTimer19-active.png'});
    windowId = window.id;
});

chrome.windows.onRemoved.addListener(function(window) {
    chrome.browserAction.setIcon({path: 'img/ChromeTimer19.png'});
    windowId = undefined;
});

function toggle() {
    if (windowId) {
        hide();
    } else {
        show();
    }
}

function show() {
    var windowType = localStorage.windowType || "pannel";
    var size = localStorage.size || 2;
    var width = 360;
    var height = 200;
    width *= (size / 3);
    height *= (size / 3);
    width += 10;
    height += 30;
    width += (windowType == "popup") ? 20 : 0;
    height += 8 * (3 / size);
    chrome.windows.create({ url: "popup.html", type: windowType, width:Math.round(width), height:Math.round(height)}, function(window) {
        console.log(window);
    });
}

function hide() {
    chrome.windows.remove(parseInt(windowId), function(window) {
    })
}
