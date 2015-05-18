/**
 * Object:  Html5RTCRecorder
 * Version: master
 * Author:  Edouard Kombo
 * Twitter: @EdouardKombo
 * Github:  https://github.com/edouardkombo
 * Blog:    http://creativcoders.wordpress.com
 * Url:     https://github.com/edouardkombo/Html5RTCRecorder
 * 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 * Record both audio and video in html5 with webRTC.
 */

var Html5RTCRecorder = function(){};

Html5RTCRecorder.prototype = {
    audioContext: '',
    url: '',
    mediaStream: '',
    recordAudio: '',
    recordVideo: '',
    video: '',
    canvas: '',
    audio: '',
    rtc: '',
    frameRate: 60,
    quality: 10,
    option: {download: false},
    callback: '',


    /**
     * Associate tag to specific id
     *
     * @param {String} tag
     * @param {String} tagId
     * @returns true
     */
    associate: function(tag, tagId)
    {
        var myTag   = document.getElementById(tagId);

        if (tag === 'canvas') {
            this.canvas                  = myTag;
            this.canvas.id               = tagId;
        } else if (tag === 'video') {
            this.video                   = myTag;
            this.video.id                = tagId;
        } else {
            this.audio                   = myTag;
            this.audio.id                = tagId;
        }
    },

    /**
     * Allow webcam live feed
     * 
     * @returns {undefined}
     */
    init: function (){
        navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.AudioContext     = window.AudioContext || window.webkitAudioContext;
        window.URL              = window.URL || window.webkitURL;
        
        this.getUserMedia = navigator.getUserMedia;
        this.audioContext = window.AudioContext;
        this.url          = window.URL;
        
        window.onload = this.onload(); 
    },
    
    /**
     * Load getUserMedia
     * 
     * @returns {undefined}
     */
    onload: function () {
        navigator.getUserMedia({
            audio: true, 
            video: true         
        }, this.onStream.bind(this), function(e) {
            console.log('No live audio input or video stream: ' + e);
        });        
    },    
    
    /**
     * Send stream to video tag
     * 
     * @param {Object} stream
     * @returns {undefined}
     */
    onStream: function(stream) {
                
        this.mediaStream        = stream;

        this.video.src       = this.url.createObjectURL(stream);
        this.video.muted     = true;
    },

    /**
     * Stream video tag with live webcam feed
     */
    stream: function() {
        if (this.mediaStream !== '') {
            this.video.src = window.URL.createObjectURL(this.mediaStream);
        }

        this.video.play();
    },

    /**
     * Stop webcam live webcam feed for performance reasons
     */
    unStream: function() {
        this.video.pause();
    },

    /**
     * Show video tag
     */
    show: function() {
        this.video.style.visibility = 'display';
    },

    /**
     * Hide video tag for performance reasons
     */
    hide: function() {
        this.video.style.visibility = 'hidden';
    },

    /**
     * Begin both audio and video record
     * 
     * @returns {undefined}
     */
    record: function () {
        
        //Close previous xmlHttpRequest connection, so we avoid memory limit
        this.client = '';
        
        if (this.hideWebcamWhileRecording) {
            this.showHideStream('hide');
        }
        
        this.recordAudio = '';
        this.recordVideo = '';        
        
        this.recordAudio = this.rtc(this.mediaStream, {
            // bufferSize: 16384,
            onAudioProcessStarted: function() {
                this.recordVideo.startRecording();
            }.bind(this)
        });

        var options = {
            type: 'video',
            video: {
                width: this.video.offsetWidth,
                height: this.video.offsetHeight
            },
            canvas: {
                width: this.video.offsetWidth,
                height: this.video.offsetHeight
            },
            frameRate: this.frameRate,
            quality: this.quality            
        };

        this.recordVideo = this.rtc(this.mediaStream, options);

        this.recordAudio.startRecording();        
    },
    
    /**
     * Stop both audio and video record
     *
     * @param url   string
     * @param param string
     *
     * @returns {undefined}
     */
    stop: function (url, param) {
        this.recordAudio.stopRecording(function() {
            this.recordVideo.stopRecording(function() {
                this.postBlob(url, param, 'audio');
                this.postBlob(url, param, 'video');
                if (true === this.option.download) {
                    this.download(this.recordAudio.getBlob(), 'video' + Date.now());
                    this.download(this.recordVideo.getBlob(), 'video' + Date.now());
                }
            }.bind(this));
        }.bind(this));        
    },


    /**
     * Downloads blob files to user disk
     *
     * @param blobURL Blob
     * @param fileName string
     */
    download: function (blobURL, fileName) {
        var reader = new FileReader();
        reader.readAsDataURL(blobURL);
        reader.onload = function (event) {
            var save = document.createElement('a');
            save.href = event.target.result;
            save.target = '_blank';
            save.download = fileName || 'unknown file';

            var event = document.createEvent('Event');
            event.initEvent('click', true, true);
            save.dispatchEvent(event);
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        }.bind(this);
    },


    /**
     * Post audio, video and other informations to php file, and execute callback function
     *
     * @param url   string
     * @param param string
     * @param type  string
     *
     * @returns {undefined}
     */
    postBlob: function (url, param, type) {

        var blob = (type === 'audio') ? this.recordAudio.getBlob() : this.recordVideo.getBlob() ;
        var extension = (type === 'audio') ? 'wav' : 'webm' ;

        var reader = new window.FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
            base64data = reader.result;

            var params = new FormData();
            params.append("session", param);
            params.append("media", blob);
            params.append("extension", extension);

            //var params = "session="+param+"&media="+base64data+"&extension="+extension;

            client = new XMLHttpRequest();
            client.onreadystatechange = function()
            {
                if ((client.readyState === 4) && (client.status === 200))
                {
                    console.log(client.response);

                    //var fn = window[this.callback];
                    //fn();

                    client = null;
                }
            }.bind(this);
            client.open("post", url, true);
            client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            client.send(params);

        }.bind(this);
    }


};