export const initCamera = (onFrame) => {
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const intervalId = setInterval(() => {
                if (context) {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = canvas.toDataURL('image/jpeg');
                    onFrame(imageData);
                }
            }, 1000);
            resolve({
                stream,
                stop: () => {
                    clearInterval(intervalId);
                    stream.getTracks().forEach(track => track.stop());
                }
            });
        })
            .catch(reject);
    });
};
