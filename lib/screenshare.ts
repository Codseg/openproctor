// lib/screenShare.ts
import { ScreenStreamHandler } from '../types/proctor';

export const initScreenShare = (): Promise<ScreenStreamHandler> => {
    return new Promise((resolve, reject) => {
        // Check if `getDisplayMedia` is available, otherwise reject with an error
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            navigator.mediaDevices.getDisplayMedia({ video: true })
                .then((stream) => {
                    resolve({
                        stream,
                        stop: () => {
                            stream.getTracks().forEach(track => track.stop());
                        }
                    });
                })
                .catch(reject);
        } else {
            // Check if it's Safari and handle it accordingly
            if (navigator.vendor && navigator.vendor.indexOf('Apple') > -1) {
                reject(new Error("Screen sharing is not fully supported in Safari."));
            } else {
                reject(new Error("Screen sharing is not supported in this browser."));
            }
        }
    });
};
