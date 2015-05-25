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

        if (undefined !== this.video.paused) {
            this.video.play();
        }
    },

    /**
     * Stop webcam live webcam feed for performance reasons
     */
    unStream: function() {
        if (undefined !== this.video.paused) {
            this.video.pause();
        }
    },

    /**
     * Show video tag
     */
    show: function() {
        if (undefined !== this.video.paused) {
            this.video.style.visibility = 'display';
        }
    },

    /**
     * Hide video tag for performance reasons
     */
    hide: function() {
        if (undefined !== this.video.paused) {
            this.video.style.visibility = 'hidden';
        }
    },

    /**
     * Begin both audio and video record
     * 
     * @returns {undefined}
     */
    record: function () {
        
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
     * Video and audio blob are saved inside the object
     * So you can apply your own callback logic, after all medias have been recorded
     *
     * @param callback function
     *
     * @returns {undefined}
     */
    stop: function (callback) {
        this.recordAudio.stopRecording(function() {
            this.recordVideo.stopRecording(function() {
                if (callback && typeof(callback) === "function") {
                    callback();
                }
            }.bind(this));
        }.bind(this));        
    }
};