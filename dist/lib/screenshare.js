export const initScreenShare = () => {
    return new Promise((resolve, reject) => {
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
    });
};
