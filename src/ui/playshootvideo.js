export function playShootVideo(container, level) {
    return new Promise((resolve) => {
        const videoMap = {
            easy: '/images/videos/easy.mp4',
            medium: '/images/videos/medium.mp4',
            hard: '/images/videos/hard.mp4',
            expert: '/images/videos/expert.mp4'
        };

        const videoSrc = videoMap[level];
        if (!videoSrc) {
            resolve();
            return;
        }

        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'shoot-video-wrapper';

        videoWrapper.innerHTML = `
          <video
            class="shoot-video"
            src="${videoSrc}"
            autoplay
            playsinline
          ></video>
        `;

        container.appendChild(videoWrapper);

        const video = videoWrapper.querySelector('video');
        video.volume= 1.0;
        // Fade in
        requestAnimationFrame(() => {
            videoWrapper.classList.add('visible');
        });

        video.addEventListener('ended', () => {
            videoWrapper.classList.remove('visible');

            setTimeout(() => {
                videoWrapper.remove();
                resolve(); // ✅ Promise resolves here
            }, 400);
        });
    });
}
