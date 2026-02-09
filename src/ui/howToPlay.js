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
          <div class="howto-text"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
  nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
  eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
  sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          <div class="buttons">
            <button id="goMainBtn" class="primary">Go to main screen</button>
            <button id="playGameBtn" class="primary">Play Game</button>          
          </div>
        </div>
      </div>
    </div>
  `;


  container.querySelector('#goMainBtn')
      ?.addEventListener('click', () => {
        container.dispatchEvent(new CustomEvent('navigateMain'));
      });

  container.querySelector('#playGameBtn')
      ?.addEventListener('click', () => {
        container.dispatchEvent(new CustomEvent('navigateDifficulty'));
      });

}
