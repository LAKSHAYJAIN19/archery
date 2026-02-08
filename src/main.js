import './style.css'
import getImageForDevice from './utils/getImageForDevice'
import { createSettingsModalHTML } from './ui/settingsModal'
import { renderHowToPlayScreen } from './ui/howToPlay'
import { setupAdaptiveBackground } from './bg/adaptiveBackground'
import { setupExitButton } from './ui/exitButton'
import { DifficultyScreen } from './ui/DifficultyScreen'


const app = document.getElementById('app');

renderMainScreen(app)

/* Navigation events */
app.addEventListener('navigateHowTo', () => {
  renderHowToPlayScreen(app)
})

app.addEventListener('navigateMain', () => {
  renderMainScreen(app)
})

app.addEventListener('navigateDifficulty', () => {
  DifficultyScreen(app)
})

// app.addEventListener('navigateMain', () => {
//   renderMainScreen();
// });
//
// app.addEventListener('navigateDifficulty', () => {
//   DifficultyScreen(app);
// });

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

  // Show/hide helpers that manage focus and inert state to avoid aria-hidden on focused elements
  function showSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    const mainScreen = document.querySelector('.main-screen');
    if (mainScreen) {
      try { mainScreen.setAttribute('inert', ''); } catch (e) {}
    }
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    // Move focus into the dialog (to close button) for accessibility
    const close = document.getElementById('closeModal');
    if (close) {
      try { close.focus(); } catch (e) {}
    } else {
      // fallback: focus modal panel
      const panel = modal.querySelector('.modal-panel');
      if (panel) try { panel.focus(); } catch (e) {}
    }
  }

  function hideSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    // If a descendant has focus, blur it before hiding to avoid aria-hidden on focused element
    try {
      const active = document.activeElement;
      if (active && modal.contains(active)) active.blur();
    } catch (e) {}

    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');

    const mainScreen = document.querySelector('.main-screen');
    if (mainScreen) {
      try { mainScreen.removeAttribute('inert'); } catch (e) {}
    }

    // Restore focus to the settings button
    const settingsBtnRef = document.getElementById('settingsBtn');
    if (settingsBtnRef) try { settingsBtnRef.focus(); } catch (e) {}
  }

  settingsBtn.addEventListener('click', () => { showSettingsModal(); });

  const closeModal = document.getElementById('closeModal');
  const contactBtn = document.getElementById('contactBtn');
  if (closeModal) closeModal.addEventListener('click', () => { hideSettingsModal(); });
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
  // app.addEventListener('navigateMain', () => {
  //   renderMainScreen();
  // });
}

// initial render
renderMainScreen();
