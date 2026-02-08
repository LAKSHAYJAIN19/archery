export function createSettingsModalHTML() {
  return `
    <div id="settingsModal" class="modal hidden" aria-hidden="true">
      <div class="modal-panel" role="dialog" aria-modal="true" tabindex="-1">
        <button class="modal-close" id="closeModal" aria-label="Close settings">&times;</button>
        <h2>Settings</h2>
        <div class="setting"><label for="musicToggle">Music</label><input type="checkbox" id="musicToggle" /></div>
        <div class="setting"><label for="soundToggle">Sound</label><input type="checkbox" id="soundToggle" /></div>
        <div class="setting"><label for="vibToggle">Vibration</label><input type="checkbox" id="vibToggle" /></div>
        <div class="setting contact-row"><button id="contactBtn" class="contact">Contact Details</button></div>
      </div>
    </div>
  `;
}
