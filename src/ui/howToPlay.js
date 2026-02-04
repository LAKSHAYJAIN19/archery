import getImageForDevice from '../utils/getImageForDevice'

export function renderHowToPlayScreen(container) {
  const imagePath = (function() {
    const ua = getImageForDevice();
    if (ua.includes('android_size')) return '/images/android_size/howtoplaybga.png';
    if (ua.includes('iphone_size')) return '/images/iphone_size/howtoplaybgi.png';
    return '/images/android_size/howtoplaybga.png';
  })();

  container.innerHTML = `
    <div class="howto-screen">
      <div class="howto-bg" style="background-image: url('${imagePath}')">
        <div class="howto-overlay">
          <div class="howto-text">Shoot the arrow to gain maximum points.</div>
          <div class="buttons">
            <button id="goMainBtn" class="primary">Go to main screen</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const goMain = container.querySelector('#goMainBtn');
  if (goMain) {
    goMain.addEventListener('click', () => {
      container.dispatchEvent(new CustomEvent('navigateMain'));
    });
  }
}
