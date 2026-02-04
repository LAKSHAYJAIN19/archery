import './style.css'
import getImageForDevice from './utils/getImageForDevice'
import { createSettingsModalHTML } from './ui/settingsModal'
import { renderHowToPlayScreen } from './ui/howToPlay'
import { setupAdaptiveBackground } from './bg/adaptiveBackground'
import { setupExitButton } from './ui/exitButton'

const app = document.getElementById('app');

function renderMainScreen() {
  const selectedImagePath = getImageForDevice();
  const selectedImageFile = selectedImagePath.split('/').pop();

  app.innerHTML = `
    <div class="main-screen">
      <div class="bg" aria-hidden="true">
        <img class="bg-image" src="${selectedImagePath}" alt="background" />
      </div>
      <div class="content">
        <h1 class="game-title"><span class="shimmer">Take a Shot!</span></h1>
        <div class="buttons">
          <button id="howBtn" class="primary">How to play</button>
          <button id="settingsBtn">Settings</button>
        </div>
      </div>
    </div>
    ${createSettingsModalHTML()}
  `;

  // Hook up UI actions
  const howBtn = document.getElementById('howBtn');
  const settingsBtn = document.getElementById('settingsBtn');

  // Prepare exit button and keep cleanup handle
  const cleanupExit = setupExitButton();

  howBtn.addEventListener('click', () => {
    // remove exit UI when navigating away from main
    try { if (typeof cleanupExit === 'function') cleanupExit(); } catch (e) {}
    renderHowToPlayScreen(app);
  });
  settingsBtn.addEventListener('click', () => {
    const modal = document.getElementById('settingsModal'); if (!modal) return; modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
  });

  const closeModal = document.getElementById('closeModal');
  const contactBtn = document.getElementById('contactBtn');
  if (closeModal) closeModal.addEventListener('click', () => { const modal = document.getElementById('settingsModal'); modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); });
  if (contactBtn) contactBtn.addEventListener('click', () => alert('Contact: developer@example.com'));

  // Initialize settings toggles
  ['music','sound','vibration'].forEach(k => {
    const el = document.getElementById(k + 'Toggle');
    if (!el) return;
    const saved = localStorage.getItem('setting_' + k);
    el.checked = saved === 'true';
    el.addEventListener('change', () => { localStorage.setItem('setting_' + k, el.checked); });
  });

  // Setup adaptive background for the selected image
  setupAdaptiveBackground(selectedImagePath, selectedImageFile);

  // When instructions screen requests going back, re-render main
  app.addEventListener('navigateMain', () => {
    renderMainScreen();
  });
}

// initial render
renderMainScreen();
