export function setupExitButton() {
  // Clean up any existing exit UI
  const existingBtn = document.getElementById('exitButton');
  if (existingBtn) existingBtn.remove();
  const existingModal = document.getElementById('exitModal');
  if (existingModal) existingModal.remove();

  // Create exit button
  const btn = document.createElement('button');
  btn.id = 'exitButton';
  btn.className = 'exit-button';
  btn.type = 'button';
  btn.textContent = 'Exit';

  // Create modal markup (reusing modal-panel styling)
  const modal = document.createElement('div');
  modal.id = 'exitModal';
  modal.className = 'modal hidden';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="modal-panel exit-modal-panel">
      <div class="exit-modal-content">
        <h3>Are you sure?</h3>
        <div class="exit-modal-actions">
          <button id="exitYes" class="exit-yes">Yes</button>
          <button id="exitNo" class="exit-no">No</button>
        </div>
      </div>
    </div>
  `;

  // Append to body so it's always at the bottom of the viewport
  document.body.appendChild(btn);
  document.body.appendChild(modal);

  // Show modal
  btn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  });

  // No button closes modal
  modal.querySelector('#exitNo').addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  });

  // Yes button tries to close app/browser window
  modal.querySelector('#exitYes').addEventListener('click', () => {
    // Try Cordova / hybrid app exit
    try {
      if (navigator && navigator.app && typeof navigator.app.exitApp === 'function') {
        navigator.app.exitApp();
        return;
      }
    } catch (e) {}

    // Try window.close (may be blocked by browser if not opened by script)
    try {
      window.close();
    } catch (e) {}

    // Fallback: navigate away / blank page
    try {
      window.location.href = 'about:blank';
    } catch (e) {}
  });

  // Accessibility: close modal on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  // Return a cleanup function in case caller wants to remove the UI
  return function cleanup() {
    btn.remove();
    modal.remove();
  };
}
