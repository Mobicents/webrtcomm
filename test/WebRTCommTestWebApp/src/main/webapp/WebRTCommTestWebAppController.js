/**
 * Class WebRTCommTestWebAppController
 * @public 
 */

navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;


/**
 * Constructor 
 */
function WebRTCommTestWebAppController(view) {
    console.debug("WebRTCommTestWebAppController:WebRTCommTestWebAppController()");
    //  WebRTComm client 
    this.view = view;
    this.webRTCommClient = new WebRTCommClient(this);
    this.webRTCommClientConfiguration = undefined;
    this.localAudioVideoMediaStream = undefined;
    this.webRTCommCall = undefined;
    this.sipContact = WebRTCommTestWebAppController.prototype.DEFAULT_SIP_CONTACT;
}

WebRTCommTestWebAppController.prototype.constructor = WebRTCommTestWebAppController;

// Default SIP profile to use
WebRTCommTestWebAppController.prototype.DEFAULT_SIP_OUTBOUND_PROXY = "ws://10.194.124.24:80";
WebRTCommTestWebAppController.prototype.DEFAULT_SIP_USER_AGENT = "WebRTCommTestWebApp/0.0.1"
WebRTCommTestWebAppController.prototype.DEFAULT_SIP_USER_AGENT_CAPABILITIES = undefined // +g.oma.sip-im
WebRTCommTestWebAppController.prototype.DEFAULT_SIP_DOMAIN = "webrtc.orange.com";
WebRTCommTestWebAppController.prototype.DEFAULT_SIP_DISPLAY_NAME = "alice";
WebRTCommTestWebAppController.prototype.DEFAULT_SIP_USER_NAME = "alice";
WebRTCommTestWebAppController.prototype.DEFAULT_SIP_LOGIN = undefined;
WebRTCommTestWebAppController.prototype.DEFAULT_SIP_PASSWORD = undefined;
WebRTCommTestWebAppController.prototype.DEFAULT_SIP_CONTACT = "bob";
WebRTCommTestWebAppController.prototype.DEFAULT_SIP_REGISTER_MODE = true;
WebRTCommTestWebAppController.prototype.DEFAULT_ICE_SERVERS=undefined;
WebRTCommTestWebAppController.prototype.DEFAULT_STUN_SERVER = "10.194.124.24:3478";
WebRTCommTestWebAppController.prototype.DEFAULT_TURN_SERVER = undefined;
WebRTCommTestWebAppController.prototype.DEFAULT_TURN_LOGIN = undefined;
WebRTCommTestWebAppController.prototype.DEFAULT_TURN_PASSWORD = undefined;
WebRTCommTestWebAppController.prototype.DEFAULT_AUDIO_CODECS_FILTER = undefined; // RTCPeerConnection default codec filter
WebRTCommTestWebAppController.prototype.DEFAULT_AUDIO_CODECS_OPUS_PARAMETERS = "maxaveragebitrate=128000";
WebRTCommTestWebAppController.prototype.DEFAULT_VIDEO_CODECS_FILTER = undefined; // RTCPeerConnection default codec filter
WebRTCommTestWebAppController.prototype.DEFAULT_LOCAL_AUDIO_FORMAT = "{\"mandatory\" : {\"googEchoCancellation\": true,\"googNoiseSuppression\" :true,\"googAutoGainControl\" : true,\"googAutoGainControl2\" : true,\"googHighpassFilter\" :true},\"optional\" : []}";
WebRTCommTestWebAppController.prototype.DEFAULT_LOCAL_VIDEO_FORMAT = "{\"mandatory\": {\"maxWidth\": 500},\"optional\" : []}"
WebRTCommTestWebAppController.prototype.DEFAULT_SIP_URI_CONTACT_PARAMETERS = undefined;
WebRTCommTestWebAppController.prototype.DEFAULT_DTLS_SRTP_KEY_AGREEMENT_MODE = false;
WebRTCommTestWebAppController.prototype.DEFAULT_FORCE_TURN_MEDIA_RELAY_MODE = false;

/**
 * on load event handler
 */
WebRTCommTestWebAppController.prototype.onLoadViewEventHandler = function()
{
    console.debug("WebRTCommTestWebAppController:onLoadViewEventHandler()");

    // Setup SIP default Profile
    this.webRTCommClientConfiguration = {
        communicationMode: WebRTCommClient.prototype.SIP,
        sip: {
            sipUserAgent: this.DEFAULT_SIP_USER_AGENT,
            sipOutboundProxy: this.DEFAULT_SIP_OUTBOUND_PROXY,
            sipDomain: this.DEFAULT_SIP_DOMAIN,
            sipDisplayName: this.DEFAULT_SIP_DISPLAY_NAME,
            sipUserName: this.DEFAULT_SIP_USER_NAME,
            sipLogin: this.DEFAULT_SIP_LOGIN,
            sipPassword: this.DEFAULT_SIP_PASSWORD,
            sipUriContactParameters: this.DEFAULT_SIP_URI_CONTACT_PARAMETERS,
            sipUserAgentCapabilities: this.DEFAULT_SIP_USER_AGENT_CAPABILITIES,
            sipRegisterMode: this.DEFAULT_SIP_REGISTER_MODE
        },
        RTCPeerConnection:
                {
		    iceServers:this.DEFAULT_ICE_SERVERS,	
                    stunServer: this.DEFAULT_STUN_SERVER,
                    turnServer: this.DEFAULT_TURN_SERVER,
                    turnLogin: this.DEFAULT_TURN_LOGIN,
                    turnPassword: this.DEFAULT_TURN_PASSWORD,
                    dtlsSrtpKeyAgreement: this.DEFAULT_DTLS_SRTP_KEY_AGREEMENT_MODE,
                    forceTurnMediaRelay: this.DEFAULT_FORCE_TURN_MEDIA_RELAY_MODE
                }
    };

    // Setup SIP overloaded profile configuration in request URL       
    if (this.view.location.search.length > 0)
    {
        var argumentsString = this.view.location.search.substring(1);
        var arguments = argumentsString.split('&');
        if (arguments.length == 0)
            arguments = [argumentsString];
        for (var i = 0; i < arguments.length; i++)
        {
            var argument = arguments[i].split("=");
            if ("sipUserName" == argument[0])
            {
                this.webRTCommClientConfiguration.sip.sipUserName = argument[1];
                if (this.webRTCommClientConfiguration.sip.sipUserName == "")
                    this.webRTCommClientConfiguration.sip.sipUserName = undefined;
            }
            else if ("sipDomain" == argument[0])
            {
                this.webRTCommClientConfiguration.sip.sipDomain = argument[1];
                if (this.webRTCommClientConfiguration.sip.sipDomain == "")
                    this.webRTCommClientConfiguration.sip.sipDomain = undefined;
            }
            else if ("sipDisplayName" == argument[0])
            {
                this.webRTCommClientConfiguration.sip.sipDisplayName = argument[1];
                if (this.webRTCommClientConfiguration.sip.sipDisplayName == "")
                    this.webRTCommClientConfiguration.sip.sipDisplayName = undefined;
            }
            else if ("sipPassword" == argument[0])
            {
                this.webRTCommClientConfiguration.sip.sipPassword = argument[1];
                if (this.webRTCommClientConfiguration.sip.sipPassword == "")
                    this.webRTCommClientConfiguration.sip.sipPassword = undefined;
            }
            else if ("sipLogin" == argument[0])
            {
                this.webRTCommClientConfiguration.sip.sipLogin = argument[1];
                if (this.webRTCommClientConfiguration.sip.sipLogin == "")
                    this.webRTCommClientConfiguration.sip.sipLogin = undefined;
            }
            else if ("sipContact" == argument[0])
            {
                this.sipContact = argument[1];
                if (this.webRTCommClientConfiguration.sip.sipContact == "")
                    this.webRTCommClientConfiguration.sip.sipContact = undefined;
            }
        }
    }
    this.initView();
};


/**
 * on unload event handler
 */
WebRTCommTestWebAppController.prototype.onUnloadViewEventHandler = function()
{
    console.debug("WebRTCommTestWebAppController:onUnloadViewEventHandler()");
    if (this.webRTCommClient != undefined)
    {
        try
        {
            this.webRTCommClient.close();
        }
        catch (exception)
        {
            console.error("WebRTCommTestWebAppController:onUnloadViewEventHandler(): catched exception:" + exception);
        }
    }
};


WebRTCommTestWebAppController.prototype.initView = function() {
    console.debug("WebRTCommTestWebAppController:initView()");
    this.view.disableRejectCallButton();
    this.view.disableAcceptCallButton();
    this.view.disableCallButton();
    this.view.disableEndCallButton();
    this.view.disableCancelCallButton();
    this.view.disableDisconnectButton();
    this.view.disableConnectButton();
    this.view.disableSendMessageButton();
    this.view.checkSipRegisterMode();
    this.view.checkAudioMediaCheckBox();
    this.view.checkVideoMediaCheckBox();
    this.view.checkMessageMediaCheckBox();
    this.view.checkUseStunServerCkeckBox();
    this.view.uncheckUseTurnServerCkeckBox();
    this.view.uncheckDtlsSrtpKeyAgreementCheckBox();
    this.view.uncheckForceTurnMediaRelayCkeckBox();
    this.view.stopLocalVideo();
    this.view.hideLocalVideo();
    this.view.stopRemoteVideo();
    this.view.stopRemoteAudio();
    this.view.hideRemoteVideo();
    this.view.setStunServerTextInputValue(this.webRTCommClientConfiguration.RTCPeerConnection.stunServer);
    this.view.setTurnServerTextInputValue(this.webRTCommClientConfiguration.RTCPeerConnection.turnServer);
    this.view.setTurnLoginTextInputValue(this.webRTCommClientConfiguration.RTCPeerConnection.turnLogin);
    this.view.setTurnPasswordTextInputValue(this.webRTCommClientConfiguration.RTCPeerConnection.turnPassword);
    this.view.setSipOutboundProxyTextInputValue(this.webRTCommClientConfiguration.sip.sipOutboundProxy);
    this.view.setSipUserAgentTextInputValue(this.webRTCommClientConfiguration.sip.sipUserAgent);
    this.view.setSipUriContactParametersTextInputValue(this.webRTCommClientConfiguration.sip.sipUriContactParameters);
    this.view.setSipUserAgentCapabilitiesTextInputValue(this.webRTCommClientConfiguration.sip.sipUserAgentCapabilities);
    this.view.setSipDomainTextInputValue(this.webRTCommClientConfiguration.sip.sipDomain);
    this.view.setSipDisplayNameTextInputValue(this.webRTCommClientConfiguration.sip.sipDisplayName);
    this.view.setSipUserNameTextInputValue(this.webRTCommClientConfiguration.sip.sipUserName);
    this.view.setSipLoginTextInputValue(this.webRTCommClientConfiguration.sip.sipLogin);
    this.view.setSipPasswordTextInputValue(this.webRTCommClientConfiguration.sip.sipPassword);
    this.view.setSipContactTextInputValue(this.sipContact);
    this.view.setAudioCodecsFilterTextInputValue(WebRTCommTestWebAppController.prototype.DEFAULT_AUDIO_CODECS_FILTER);
    this.view.setVideoCodecsFilterTextInputValue(WebRTCommTestWebAppController.prototype.DEFAULT_VIDEO_CODECS_FILTER);
    this.view.setLocalAudioFormatTextInputValue(WebRTCommTestWebAppController.prototype.DEFAULT_LOCAL_AUDIO_FORMAT);
    this.view.setLocalVideoFormatTextInputValue(WebRTCommTestWebAppController.prototype.DEFAULT_LOCAL_VIDEO_FORMAT);
    this.view.setOpusFmtpCodecsParametersTextInputValue(WebRTCommTestWebAppController.prototype.DEFAULT_AUDIO_CODECS_OPUS_PARAMETERS);


    // Get local user media
    try
    {
        this.getLocalUserMedia(
                WebRTCommTestWebAppController.prototype.DEFAULT_LOCAL_AUDIO_FORMAT,
                WebRTCommTestWebAppController.prototype.DEFAULT_LOCAL_VIDEO_FORMAT);
    }
    catch (exception)
    {
        console.error("WebRTCommTestWebAppController:onLoadEventHandler(): catched exception: " + exception);
        alert("WebRTCommTestWebAppController:onLoadEventHandler(): catched exception: " + exception);
    }
};

WebRTCommTestWebAppController.prototype.getLocalUserMedia = function(audioConstraints, videoConstraints) {
    console.debug("WebRTCommTestWebAppController:getLocalUserMedia():audioConstraints=" + JSON.stringify(audioConstraints));
    console.debug("WebRTCommTestWebAppController:getLocalUserMedia():videoConstraints=" + JSON.stringify(videoConstraints));
    var that = this;
    this.view.stopLocalVideo();
    if (this.localAudioVideoMediaStream)
        this.localAudioVideoMediaStream.stop();
    if (navigator.getUserMedia)
    {
        // Google Chrome user agent
        navigator.getUserMedia({
            audio: JSON.parse(audioConstraints),
            video: JSON.parse(videoConstraints)
        }, function(localMediaStream) {
            that.onGetUserMediaSuccessEventHandler(localMediaStream);
        }, function(error) {
            that.onGetUserMediaErrorEventHandler(error);
        });
    }
    else
    {
        console.error("WebRTCommTestWebAppController:onLoadEventHandler(): navigator doesn't implemement getUserMedia API");
        alert("WebRTCommTestWebAppController:onLoadEventHandler(): navigator doesn't implemement getUserMedia API");
    }
};

/**
 * get user media success event handler (Google Chrome User agent)
 * @param localAudioVideoMediaStream object
 */
WebRTCommTestWebAppController.prototype.onGetUserMediaSuccessEventHandler = function(localAudioVideoMediaStream)
{
    try
    {
        console.debug("WebRTCommTestWebAppController:onWebkitGetUserMediaSuccessEventHandler(): localAudioVideoMediaStream=" + JSON.stringify(localAudioVideoMediaStream));
        this.localAudioVideoMediaStream = localAudioVideoMediaStream;
        this.localAudioVideoMediaStream.onended = function() {
            alert("this.localAudioVideoMediaStream.onended");
        }
        var audioTracks = undefined;
        if (this.localAudioVideoMediaStream.audioTracks)
            audioTracks = this.localAudioVideoMediaStream.audioTracks;
        else if (this.localAudioVideoMediaStream.getAudioTracks)
            audioTracks = this.localAudioVideoMediaStream.getAudioTracks();
        if (audioTracks)
        {
            console.debug("WebRTCommTestWebAppController:onWebkitGetUserMediaSuccessEventHandler(): audioTracks=" + JSON.stringify(audioTracks));
            for (var i = 0; i < audioTracks.length; i++)
            {
                audioTracks[i].onmute = function() {
                    alert("videoTracks[i].onmute");
                };
                audioTracks[i].onunmute = function() {
                    alert("audioTracks[i].onunmute");
                };
                audioTracks[i].onended = function() {
                    alert("audioTracks[i].onended");
                };
            }
            audioTracks.onmute = function() {
                alert("audioTracks.onmute");
            };
            audioTracks.onunmute = function() {
                alert("audioTracks.onunmute");
            };
            audioTracks.onended = function() {
                alert("audioTracks.onended");
            };
        }
        else
        {
            alert("MediaStream Track  API not supported");
        }

        var videoTracks = undefined;
        if (this.localAudioVideoMediaStream.videoTracks)
            videoTracks = this.localAudioVideoMediaStream.videoTracks;
        else if (this.localAudioVideoMediaStream.getVideoTracks)
            videoTracks = this.localAudioVideoMediaStream.getVideoTracks();
        if (videoTracks)
        {
            console.debug("WebRTCommTestWebAppController:onWebkitGetUserMediaSuccessEventHandler(): videoTracks=" + JSON.stringify(videoTracks));
            for (var i = 0; i < videoTracks.length; i++)
            {
                videoTracks[i].onmute = function() {
                    alert("videoTracks[i].onmute");
                };
                videoTracks[i].onunmute = function() {
                    alert("videoTracks[i].onunmute");
                };
                videoTracks[i].onended = function() {
                    alert("videoTracks[i].onended");
                };
            }
            videoTracks.onmute = function() {
                alert("videoTracks.onmute");
            };
            videoTracks.onunmute = function() {
                alert("videoTracks.onunmute");
            };
            videoTracks.onended = function() {
                alert("videoTracks.onended");
            };
        }

        this.view.playLocalVideo(this.localAudioVideoMediaStream);
        this.view.showLocalVideo();
        this.view.enableConnectButton();
    }
    catch (exception)
    {
        console.debug("WebRTCommTestWebAppController:onWebkitGetUserMediaSuccessEventHandler(): catched exception: " + exception);
    }
};

WebRTCommTestWebAppController.prototype.onGetUserMediaErrorEventHandler = function(error)
{
    console.debug("WebRTCommTestWebAppController:onGetUserMediaErrorEventHandler(): error=" + error);
    alert("Failed to get local user media: error=" + error);
};

/**
 * on connect event handler
 */
WebRTCommTestWebAppController.prototype.onChangeLocalVideoFormatViewEventHandler = function()
{
    console.debug("WebRTCommTestWebAppController:onChangeLocalVideoFormatViewEventHandler()");
    // Get local user media
    try
    {
        this.getLocalUserMedia(this.view.getLocalAudioFormatTextInputValue(), this.view.getLocalVideoFormatTextInputValue());
    }
    catch (exception)
    {
        console.error("WebRTCommTestWebAppController:onChangeLocalVideoFormatViewEventHandler(): catched exception: " + exception);
        alert("WebRTCommTestWebAppController:onChangeLocalVideoFormatViewEventHandler(): catched exception: " + exception);
    }
};

/**
 * on connect event handler
 */
WebRTCommTestWebAppController.prototype.onClickConnectButtonViewEventHandler = function()
{
    console.debug("WebRTCommTestWebAppController:onClickConnectButtonViewEventHandler()");
    if (this.webRTCommClient != undefined)
    {
        try
        {
            if (this.view.getUseStunServerValue())
            {
                this.webRTCommClientConfiguration.RTCPeerConnection.stunServer = this.view.getStunServerTextInputValue();
            }
            else
            {
                this.webRTCommClientConfiguration.RTCPeerConnection.stunServer = undefined;
            }
            if (this.view.getUseTurnServerValue())
            {
                this.webRTCommClientConfiguration.RTCPeerConnection.turnServer = this.view.getTurnServerTextInputValue();
                this.webRTCommClientConfiguration.RTCPeerConnection.turnLogin = this.view.getTurnLoginTextInputValue();
                this.webRTCommClientConfiguration.RTCPeerConnection.turnPassword = this.view.getTurnPasswordTextInputValue();
            }
            else
            {
                this.webRTCommClientConfiguration.RTCPeerConnection.turnServer = undefined;
                this.webRTCommClientConfiguration.RTCPeerConnection.turnLogin = undefined;
                this.webRTCommClientConfiguration.RTCPeerConnection.turnPassword = undefined;
            }

            this.webRTCommClientConfiguration.RTCPeerConnection.forceTurnMediaRelay = this.view.getForceTurnMediaRelayValue();
            this.webRTCommClientConfiguration.RTCPeerConnection.dtlsSrtpKeyAgreement = this.view.getDtlsSrtpKeyAgreementValue();
            this.webRTCommClientConfiguration.sip.sipOutboundProxy = this.view.getSipOutboundProxyTextInputValue();
            this.webRTCommClientConfiguration.sip.sipUserAgent = this.view.getSipUserAgentTextInputValue();
            this.webRTCommClientConfiguration.sip.sipUriContactParameters = this.view.getSipUriContactParametersTextInputValue();
            this.webRTCommClientConfiguration.sip.sipUserAgentCapabilities = this.view.getSipUserAgentCapabilitiesTextInputValue();
            this.webRTCommClientConfiguration.sip.sipDomain = this.view.getSipDomainTextInputValue();
            this.webRTCommClientConfiguration.sip.sipDisplayName = this.view.getSipDisplayNameTextInputValue();
            this.webRTCommClientConfiguration.sip.sipUserName = this.view.getSipUserNameTextInputValue();
            this.webRTCommClientConfiguration.sip.sipLogin = this.view.getSipLoginTextInputValue();
            this.webRTCommClientConfiguration.sip.sipPassword = this.view.getSipPasswordTextInputValue();
            this.webRTCommClientConfiguration.sip.sipRegisterMode = this.view.getSipRegisterModeValue();
            this.webRTCommClient.open(this.webRTCommClientConfiguration);
            this.view.disableConnectButton();
        }
        catch (exception)
        {
            console.error("WebRTCommTestWebAppController:onClickConnectButtonViewEventHandler(): catched exception:" + exception);
        }
    }
    else
    {
        console.error("WebRTCommTestWebAppController:onClickConnectButtonViewEventHandler(): internal error");
    }
};


/**
 * on disconnect event handler
 */
WebRTCommTestWebAppController.prototype.onClickDisconnectButtonViewEventHandler = function()
{
    console.debug("WebRTCommTestWebAppController:onClickDisconnectButtonViewEventHandler()");
    if (this.webRTCommClient != undefined)
    {
        try
        {
            this.webRTCommClient.close();
        }
        catch (exception)
        {
            console.error("WebRTCommTestWebAppController:onClickDisconnectButtonViewEventHandler(): catched exception:" + exception);
        }
    }
    else
    {
        console.error("WebRTCommTestWebAppController:onClickDisconnectButtonViewEventHandler(): internal error");
    }
};

/**
 * on call event handler
 */
WebRTCommTestWebAppController.prototype.onClickCallButtonViewEventHandler = function(calleePhoneNumber)
{
    console.debug("WebRTCommTestWebAppController:onClickCallButtonViewEventHandler()");
    if (this.webRTCommCall == undefined)
    {
        try
        {
            var callConfiguration = {
                displayName: this.view.getSipDisplayNameTextInputValue(),
                localMediaStream: this.localAudioVideoMediaStream,
                audioMediaFlag: this.view.getAudioMediaValue(),
                videoMediaFlag: this.view.getVideoMediaValue(),
                messageMediaFlag: this.view.getMessageMediaValue(),
                audioCodecsFilter: this.view.getAudioCodecsFilterTextInputValue(),
                videoCodecsFilter: this.view.getVideoCodecsFilterTextInputValue(),
                opusFmtpCodecsParameters: this.view.getOpusFmtpCodecsParametersTextInputValue()
            };
            this.webRTCommCall = this.webRTCommClient.call(calleePhoneNumber, callConfiguration);
            this.view.disableCallButton();
            this.view.disableDisconnectButton();
            this.view.enableCancelCallButton();
        }
        catch (exception)
        {
            console.error("WebRTCommTestWebAppController:onClickCallButtonViewEventHandler(): catched exception:" + exception);
            alert("Call failed: " + exception);
        }
    }
    else
    {
        console.error("WebRTCommTestWebAppController:onClickCallButtonViewEventHandler(): internal error");
    }
};

/**
 * on call event handler
 */
WebRTCommTestWebAppController.prototype.onClickCancelCallButtonViewEventHandler = function()
{
    console.debug("WebRTCommTestWebAppController:onClickCancelCallButtonViewEventHandler()");
    if (this.webRTCommCall != undefined)
    {
        try
        {
            this.webRTCommCall.close();
            this.view.disableCancelCallButton();
            this.view.stopRinging();
        }
        catch (exception)
        {
            console.error("WebRTCommTestWebAppController:onClickCancelCallButtonViewEventHandler(): catched exception:" + exception);
        }
    }
    else
    {
        console.error("WebRTCommTestWebAppController:onClickCancelCallButtonViewEventHandler(): internal error");
    }
};

/**
 * on call event handler
 */
WebRTCommTestWebAppController.prototype.onClickEndCallButtonViewEventHandler = function()
{
    console.debug("WebRTCommTestWebAppController:onClickEndCallButtonViewEventHandler()");
    if (this.webRTCommCall)
    {
        try
        {
            this.webRTCommCall.close();
        }
        catch (exception)
        {
            console.error("WebRTCommTestWebAppController:onClickEndCallButtonViewEventHandler(): catched exception:" + exception);
        }
    }
    else
    {
        console.error("WebRTCommTestWebAppController:onClickEndCallButtonViewEventHandler(): internal error");
    }
};

/**
 * on accept event handler
 */
WebRTCommTestWebAppController.prototype.onClickAcceptCallButtonViewEventHandler = function()
{
    console.debug("WebRTCommTestWebAppController:onClickAcceptCallButtonViewEventHandler()");
    if (this.webRTCommCall)
    {
        try
        {
            var callConfiguration = {
                displayName: this.view.getSipDisplayNameTextInputValue(),
                localMediaStream: this.localAudioVideoMediaStream,
                audioMediaFlag: this.view.getAudioMediaValue(),
                videoMediaFlag: this.view.getVideoMediaValue(),
                messageMediaFlag: this.view.getMessageMediaValue(),
                audioCodecsFilter: this.view.getAudioCodecsFilterTextInputValue(),
                videoCodecsFilter: this.view.getVideoCodecsFilterTextInputValue(),
                opusFmtpCodecsParameters: this.view.getOpusFmtpCodecsParametersTextInputValue() 
            };
            
            this.webRTCommCall.accept(callConfiguration);
            this.view.disableAcceptCallButton();
            this.view.disableRejectCallButton();
            this.view.enableEndCallButton();
            this.view.stopRinging();
        }
        catch (exception)
        {
            console.error("WebRTCommTestWebAppController:onClickAcceptCallButtonViewEventHandler(): catched exception:" + exception);
            alert("Call failed: " + exception);
        }
    }
    else
    {
        console.error("WebRTCommTestWebAppController:onClickAcceptCallButtonViewEventHandler(): internal error");
    }
};

/**
 * on accept event handler
 */
WebRTCommTestWebAppController.prototype.onClickRejectCallButtonViewEventHandler = function()
{
    console.debug("WebRTCommTestWebAppController:onClickRejectCallButtonViewEventHandler()");
    if (this.webRTCommCall)
    {
        try
        {
            this.webRTCommCall.reject();
            this.view.disableAcceptCallButton();
            this.view.disableRejectCallButton();
            this.view.enableCallButton();
            this.view.enableDisconnectButton();
            this.view.stopRinging();
        }
        catch (exception)
        {
            console.error("WebRTCommTestWebAppController:onClickRejectCallButtonViewEventHandler(): catched exception:" + exception);
        }
    }
    else
    {
        console.error("WebRTCommTestWebAppController:onClickRejectCallButtonViewEventHandler(): internal error");
    }
};

/**
 * on accept event handler
 */
WebRTCommTestWebAppController.prototype.onClickSendMessageButtonViewEventHandler = function()
{
    console.debug("WebRTCommTestWebAppController:onClickSendMessageButtonViewEventHandler()");
    var message = document.getElementById("messageTextArea").value;
    if (this.webRTCommCall)
    {
        try
        {
            this.webRTCommCall.sendMessage(message);
            document.getElementById("messageTextArea").value = "";
        }
        catch (exception)
        {
            console.error("WebRTCommTestWebAppController:onClickRejectCallButtonViewEventHandler(): catched exception:" + exception);
            alert("Send message failed:" + exception);
        }
    }
    else
    {
        try
        {
            this.webRTCommClient.sendMessage(this.view.getSipContactTextInputValue(), message);
            document.getElementById("messageTextArea").value = "";
        }
        catch (exception)
        {
            console.error("WebRTCommTestWebAppController:onClickRejectCallButtonViewEventHandler(): catched exception:" + exception);
            alert("Send message failed:" + exception);
        }
    }
};



/**
 * on local audio mute event handler
 */
WebRTCommTestWebAppController.prototype.onClickMuteLocalAudioButtonViewEventHandler = function(checked)
{
    console.debug("WebRTCommTestWebAppController:onClickMuteLocalAudioButtonViewEventHandler():checked=" + checked);
    if (this.webRTCommCall)
    {
        try
        {
            if (checked)
                this.webRTCommCall.muteLocalAudioMediaStream();
            else
                this.webRTCommCall.unmuteLocalAudioMediaStream();
        }
        catch (exception)
        {
            console.error("WebRTCommTestWebAppController:onClickMuteLocalAudioButtonViewEventHandler(): catched exception:" + exception);
        }
    }
    else
    {
        console.error("WebRTCommTestWebAppController:onClickMuteLocalAudioButtonViewEventHandler(): internal error");
    }
};

/**
 * on local video hide event handler
 */
WebRTCommTestWebAppController.prototype.onClickHideLocalVideoButtonViewEventHandler = function(checked)
{
    console.debug("WebRTCommTestWebAppController:onClickHideLocalVideoButtonViewEventHandler():checked=" + checked);
    if (this.webRTCommCall)
    {
        try
        {
            if (checked)
                this.webRTCommCall.hideLocalVideoMediaStream();
            else
                this.webRTCommCall.showLocalVideoMediaStream();
        }
        catch (exception)
        {
            console.error("WebRTCommTestWebAppController:onClickHideLocalVideoButtonViewEventHandler(): catched exception:" + exception);
        }
    }
    else
    {
        console.error("WebRTCommTestWebAppController:onClickHideLocalVideoButtonViewEventHandler(): internal error");
    }
};

/**
 * on remote audio mute event handler
 */
WebRTCommTestWebAppController.prototype.onClickMuteRemoteAudioButtonViewEventHandler = function(checked)
{
    console.debug("WebRTCommTestWebAppController:onClickMuteRemoteAudioButtonViewEventHandler():checked=" + checked);
    if (this.webRTCommCall)
    {
        try
        {
            if (checked)
                this.webRTCommCall.muteRemoteAudioMediaStream();
            else
                this.webRTCommCall.unmuteRemoteAudioMediaStream();
        }
        catch (exception)
        {
            console.error("WebRTCommTestWebAppController:onClickMuteRemoteAudioButtonViewEventHandler(): catched exception:" + exception);
        }
    }
    else
    {
        console.error("WebRTCommTestWebAppController:onClickMuteRemoteAudioButtonViewEventHandler(): internal error");
    }
};

/**
 * on remote video mute event handler
 */
WebRTCommTestWebAppController.prototype.onClickHideRemoteVideoButtonViewEventHandler = function(checked)
{
    console.debug("WebRTCommTestWebAppController:onClickHideRemoteVideoButtonViewEventHandler():checked=" + checked);
    if (this.webRTCommCall)
    {
        try
        {
            if (checked)
                this.webRTCommCall.hideRemoteVideoMediaStream();
            else
                this.webRTCommCall.showRemoteVideoMediaStream();
        }
        catch (exception)
        {
            console.error("WebRTCommTestWebAppController:onClickHideRemoteVideoButtonViewEventHandler(): catched exception:" + exception);
        }
    }
    else
    {
        console.error("WebRTCommTestWebAppController:onClickHideRemoteVideoButtonViewEventHandler(): internal error");
    }
};

/**
 * on remote video mute event handler
 */
WebRTCommTestWebAppController.prototype.onClickStopVideoStreamButtonViewEventHandler = function(checked)
{
    console.debug("WebRTCommTestWebAppController:onClickStopVideoStreamButtonViewEventHandler():checked=" + checked);
    var videoTracks = undefined;
    if (this.localAudioVideoMediaStream.videoTracks)
        videoTracks = this.localAudioVideoMediaStream.videoTracks;
    else if (this.localAudioVideoMediaStream.getVideoTracks)
        videoTracks = this.localAudioVideoMediaStream.getVideoTracks();
    if (videoTracks)
    {
        for (var i = 0; i < videoTracks.length; i++)
        {
            this.localAudioVideoMediaStream.removeTrack(videoTracks[i]);
        }
    }
    if (this.webRTCommCall)
    {
        try
        {
            //this.webRTCommCall.stopVideoMediaStream();
            var videoTracks = undefined;
            if (this.localAudioVideoMediaStream.videoTracks)
                videoTracks = this.localAudioVideoMediaStream.videoTracks;
            else if (this.localAudioVideoMediaStream.getVideoTracks)
                videoTracks = this.localAudioVideoMediaStream.getVideoTracks();
            if (videoTracks)
            {
                for (var i = 0; i < videoTracks.length; i++)
                {
                    this.localAudioVideoMediaStream.removeTrack(videoTracks[i]);
                }
            }
        }
        catch (exception)
        {
            console.error("WebRTCommTestWebAppController:onClickStopVideoStreamButtonViewEventHandler(): catched exception:" + exception);
        }
    }
    else
    {
        console.error("WebRTCommTestWebAppController:onClickStopVideoStreamButtonViewEventHandler(): internal error");
    }
};

/**
 * Implementation of the WebRTCommClient listener interface
 */
WebRTCommTestWebAppController.prototype.onWebRTCommClientOpenedEvent = function()
{
    console.debug("WebRTCommTestWebAppController:onWebRTCommClientOpenedEvent()");
    //Enabled button DISCONNECT, CALL diable CONNECT and BYE
    this.view.enableDisconnectButton();
    this.view.enableCallButton();
    this.view.disableConnectButton();
    this.view.disableRejectCallButton();
    this.view.disableAcceptCallButton();
    this.view.disableEndCallButton();
    this.view.disableCancelCallButton();
    this.view.enableSendMessageButton();
    alert("Online");
};

WebRTCommTestWebAppController.prototype.onWebRTCommClientOpenErrorEvent = function(error)
{
    console.debug("WebRTCommTestWebAppController:onWebRTCommClientOpenErrorEvent():error:" + error);
    this.view.enableConnectButton();
    this.view.disableDisconnectButton();
    this.view.disableCallButton();
    this.view.disableRejectCallButton();
    this.view.disableAcceptCallButton();
    this.view.disableEndCallButton();
    this.view.disableCancelCallButton();
    this.view.disableSendMessageButton();
    this.webRTCommCall = undefined;
    alert("Connection has failed, offline");
};

/**
 * Implementation of the WebRTCommClient listener interface
 */
WebRTCommTestWebAppController.prototype.onWebRTCommClientClosedEvent = function()
{
    console.debug("WebRTCommTestWebAppController:onWebRTCommClientClosedEvent()");
    //Enabled button CONNECT, disable DISCONECT, CALL, BYE
    this.view.enableConnectButton();
    this.view.disableDisconnectButton();
    this.view.disableCallButton();
    this.view.disableRejectCallButton();
    this.view.disableAcceptCallButton();
    this.view.disableEndCallButton();
    this.view.disableCancelCallButton();
    this.view.disableSendMessageButton();
    this.webRTCommCall = undefined;
    alert("Offline");
};

/**
 * Implementation of the WebRTCommCall listener interface
 */
WebRTCommTestWebAppController.prototype.onWebRTCommCallClosedEvent = function(webRTCommCall)
{
    console.debug("WebRTCommTestWebAppController:onWebRTCommCallClosedEvent(): webRTCommCall.getId()=" + webRTCommCall.getId());

    //Enabled button DISCONECT, CALL
    this.view.stopRinging();
    this.view.enableCallButton();
    this.view.enableDisconnectButton();
    this.view.disableRejectCallButton();
    this.view.disableAcceptCallButton();
    this.view.disableEndCallButton();
    this.view.disableCancelCallButton();
    this.view.disableConnectButton();
    this.view.stopRemoteVideo();
    this.view.stopRemoteAudio();
    this.view.hideRemoteVideo();
    this.webRTCommCall = undefined;
    alert("Communication closed");
};


/**
 * Implementation of the WebRTCommCall listener interface
 */
WebRTCommTestWebAppController.prototype.onWebRTCommCallOpenedEvent = function(webRTCommCall)
{
    console.debug("WebRTCommTestWebAppController:onWebRTCommCallOpenedEvent(): webRTCommCall.getId()=" + webRTCommCall.getId());

    this.view.stopRinging();
    this.view.disableCallButton();
    this.view.disableDisconnectButton();
    this.view.disableRejectCallButton();
    this.view.disableAcceptCallButton();
    this.view.enableEndCallButton();
    this.view.disableCancelCallButton();
    this.view.disableDisconnectButton();
    this.view.disableConnectButton();
    if (webRTCommCall.getRemoteBundledAudioVideoMediaStream())
    {
        this.view.showRemoteVideo();
        this.view.playRemoteVideo(webRTCommCall.getRemoteBundledAudioVideoMediaStream());
    }
    else
    {
        if (webRTCommCall.getRemoteAudioMediaStream())
        {
            this.view.playRemoteAudio(webRTCommCall.getRemoteAudioMediaStream());
        }
        if (webRTCommCall.getRemoteVideoMediaStream())
        {
            this.view.showRemoteVideo();
            this.view.playRemoteVideo(webRTCommCall.getRemoteVideoMediaStream());
        }
    }
    alert("Communication opened");
};

/**
 * Implementation of the WebRTCommCall listener interface
 */
WebRTCommTestWebAppController.prototype.onWebRTCommCallInProgressEvent = function(webRTCommCall)
{
    console.debug("WebRTCommTestWebAppController:onWebRTCommCallInProgressEvent(): webRTCommCall.getId()=" + webRTCommCall.getId());

    alert("Communication in progress");
};


/**
 * Implementation of the WebRTCommCall listener interface
 */
WebRTCommTestWebAppController.prototype.onWebRTCommCallOpenErrorEvent = function(webRTCommCall, error)
{
    console.debug("WebRTCommTestWebAppController:onWebRTCommCallOpenErrorEvent(): webRTCommCall.getId()=" + webRTCommCall.getId());

    //Enabled button DISCONECT, CALL
    this.view.enableCallButton();
    this.view.enableDisconnectButton();
    this.view.disableRejectCallButton();
    this.view.disableAcceptCallButton();
    this.view.disableEndCallButton();
    this.view.disableCancelCallButton();
    this.view.disableConnectButton();
    this.view.hideRemoteVideo();
    this.view.stopRemoteVideo();
    this.view.stopRemoteAudio();
    this.view.stopRinging();
    this.webRTCommCall = undefined;
    alert("Communication failed: error:" + error);
};

/**
 * Implementation of the WebRTCommCall listener interface
 */
WebRTCommTestWebAppController.prototype.onWebRTCommCallRingingEvent = function(webRTCommCall)
{
    console.debug("WebRTCommTestWebAppController:onWebRTCommCallRingingEvent(): webRTCommCall.getId()=" + webRTCommCall.getId());
    this.webRTCommCall = webRTCommCall;
    this.view.playRinging();
    this.view.disableCallButton();
    this.view.disableDisconnectButton();
    this.view.enableRejectCallButton();
    this.view.enableAcceptCallButton();
    this.view.disableEndCallButton();
    this.view.disableCancelCallButton();
    this.view.disableConnectButton();
    var caller = webRTCommCall.getCallerDisplayName();
    if (caller == undefined)
        caller = webRTCommCall.getCallerPhoneNumber()
    alert("Communication from " + caller + ", accept or reject");
};

/**
 * Implementation of the WebRTCommCall listener interface
 */
WebRTCommTestWebAppController.prototype.onWebRTCommCallRingingBackEvent = function(webRTCommCall)
{
    console.debug("WebRTCommTestWebAppController:onWebRTCommCallRingingBackEvent(): webRTCommCall.getId()=" + webRTCommCall.getId());
    this.view.playRinging();
    this.view.disableCallButton();
    this.view.disableDisconnectButton();
    this.view.disableRejectCallButton();
    this.view.disableAcceptCallButton();
    this.view.disableEndCallButton();
    this.view.enableCancelCallButton();
    this.view.disableConnectButton();
};

/**
 * Implementation of the WebRTCommCall listener interface
 */
WebRTCommTestWebAppController.prototype.onWebRTCommCallHangupEvent = function(webRTCommCall)
{
    console.debug("WebRTCommTestWebAppController:onWebRTCommCallHangupEvent(): webRTCommCall.getId()=" + webRTCommCall.getId());
    //Enabled button DISCONECT, CALL
    this.view.enableCallButton();
    this.view.enableDisconnectButton();
    this.view.disableRejectCallButton();
    this.view.disableAcceptCallButton();
    this.view.disableEndCallButton();
    this.view.disableCancelCallButton();
    this.view.disableConnectButton();
    this.view.hideRemoteVideo();
    this.view.stopRemoteVideo();
    this.view.stopRemoteAudio();
    this.view.stopRinging();
    this.webRTCommCall = undefined;

    if (webRTCommCall.getCallerPhoneNumber())
        alert("Communication closed by " + webRTCommCall.getCallerPhoneNumber());
    else
        alert("Communication close by " + webRTCommCall.getCalleePhoneNumber());
};

/**
 * Message event
 * @public
 * @param {String} from phone number
 * @param {String} message message
 */
WebRTCommTestWebAppController.prototype.onWebRTCommMessageReceivedEvent = function(message) {
    var webRTCommCall = message.getLinkedWebRTCommCall();
    if (webRTCommCall)
    {
        if (webRTCommCall.isIncoming())
            alert("Call message from " + webRTCommCall.getCallerPhoneNumber() + ":" + message.getText());
        else
            alert("Call message from " + webRTCommCall.getCalleePhoneNumber() + ":" + message.getText());
    }
    else
        alert("Message received from " + message.getFrom() + ":" + message.getText());
};


/**
 * Message received event
 * @public
 * @param {String} error
 */
WebRTCommTestWebAppController.prototype.onWebRTCommMessageSentEvent = function(message) {
    alert("Message has been received:" + message.getId());
};

/**
 * Message error event
 * @public
 * @param {String} error
 */
WebRTCommTestWebAppController.prototype.onWebRTCommMessageSendErrorEvent = function(message, error) {
    alert("Send message " + message.getId() + " has failed:" + error);
};

