// lib/index.ts
import { initCamera } from './camera';
import { initMicrophone } from './microphone';
import { initScreenShare } from './screenshare';
import { detectTabSwitch } from './tabswitch';
export class Proctor {
    constructor(options) {
        this.options = options;
    }
    startCamera() {
        if (this.options.onVideoFrame) {
            initCamera(this.options.onVideoFrame)
                .then(handler => {
                this.videoHandler = handler;
            })
                .catch(error => {
                console.error('Error initializing camera:', error);
            });
        }
    }
    startMicrophone() {
        if (this.options.onAudioStream) {
            initMicrophone()
                .then(stream => {
                this.options.onAudioStream(stream);
            })
                .catch(error => {
                console.error('Error initializing microphone:', error);
            });
        }
    }
    startScreenShare() {
        if (this.options.onScreenStream) {
            initScreenShare()
                .then(handler => {
                this.screenHandler = handler;
                this.options.onScreenStream(handler.stream);
            })
                .catch(error => {
                console.error('Error initializing screen share:', error);
            });
        }
    }
    detectTabSwitch() {
        if (this.options.onTabSwitch) {
            detectTabSwitch(this.options.onTabSwitch);
        }
    }
    stopCamera() {
        if (this.videoHandler) {
            this.videoHandler.stop();
        }
    }
    stopScreenShare() {
        if (this.screenHandler) {
            this.screenHandler.stop();
        }
    }
}
