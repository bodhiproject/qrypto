// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './containers/App';
ReactDOM.render(<App />, document.getElementById('app')) 

$(document).ready(function(){
  $("form#send").submit(function(){
    console.log("form submitted")

    function sendTx() {
      chrome.runtime.sendMessage({greeting: "sendTx"},
        function (response) {
          console.log("popup sendTx callback", response)   
          $("body").append(response);       
        }
      );
    }
    sendTx();

    return false;
  });
});// end of document ready