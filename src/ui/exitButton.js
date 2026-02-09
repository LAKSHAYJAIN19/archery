export function setupExitButton() {
  // Clean up any existing exit UI
  const existingBtn = document.getElementById("exitButton");
  if (existingBtn) existingBtn.remove();

  const existingModal = document.getElementById("exitModal");
  if (existingModal) existingModal.remove();

  // -------------------------
  // Exit Button
  // -------------------------
  const btn = document.createElement("button");
  btn.id = "exitButton";
  btn.className = "exit-button";
  btn.type = "button";
  btn.textContent = "Exit";

  // Mobile touch optimization
  btn.style.touchAction = "manipulation";
  btn.style.webkitTapHighlightColor = "transparent";

  // -------------------------
  // Modal
  // -------------------------
  const modal = document.createElement("div");
  modal.id = "exitModal";
  modal.className = "modal hidden";
  modal.setAttribute("aria-hidden", "true");


  modal.innerHTML = `
    <div class="modal-panel exit-modal-panel">
      <div class="exit-modal-content">
        <h3>Are you sure?</h3>
        <div class="exit-modal-actions">
          <button id="exitYes" class="exit-yes" type="button">Yes</button>
          <button id="exitNo" class="exit-no" type="button">No</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(modal);

  // -------------------------
  // Unified mobile-safe listener
  // -------------------------
  function addActivationListener(el, handler) {
    const listener = (e) => {
      if (e.cancelable) e.preventDefault();
      handler(e);
    };

    el.addEventListener("pointerup", listener);
    return () => el.removeEventListener("pointerup", listener);
  }

  // -------------------------
  // Show modal
  // -------------------------
  const removeBtnListener = addActivationListener(btn, () => {
    const mainScreen = document.querySelector(".main-screen");
    if (mainScreen) {
      try {
        mainScreen.setAttribute("inert", "");
      } catch (e) {}
    }

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    btn.classList.add("disabled");

    const exitNo = modal.querySelector("#exitNo");
    if (exitNo) exitNo.focus();
  });

  // -------------------------
  // Hide modal helper
  // -------------------------
  function hideExitModal() {
    try {
      const active = document.activeElement;
      if (active && modal.contains(active)) active.blur();
    } catch (e) {}

    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    btn.classList.remove("disabled");


    const mainScreen = document.querySelector(".main-screen");
    if (mainScreen) {
      try {
        mainScreen.removeAttribute("inert");
      } catch (e) {}
    }

    btn.focus();
  }

  // -------------------------
  // NO Button
  // -------------------------
  const exitNoBtn = modal.querySelector("#exitNo");
  const removeNoListener = addActivationListener(exitNoBtn, () => {
    if (navigator.vibrate) navigator.vibrate(20);
    hideExitModal();
  });

  // -------------------------
  // YES Button
  // -------------------------
  const exitYesBtn = modal.querySelector("#exitYes");
  const removeYesListener = addActivationListener(exitYesBtn, () => {
    if (navigator.vibrate) navigator.vibrate(20);
    hideExitModal();

    // Hybrid apps (Cordova / Capacitor)
    try {
      if (
          navigator?.app &&
          typeof navigator.app.exitApp === "function"
      ) {
        navigator.app.exitApp();
        return;
      }
    } catch (e) {}

    // Browser fallback (mobile-safe behavior)
    try {
      history.back();
    } catch (e) {}
  });

  // -------------------------
  // Backdrop click closes modal
  // -------------------------
  const backdropHandler = (e) => {
    if (e.target === modal) hideExitModal();
  };

  modal.addEventListener("pointerup", backdropHandler);

  // -------------------------
  // Cleanup API
  // -------------------------
  return function cleanup() {
    try { removeBtnListener(); } catch (e) {}
    try { removeNoListener(); } catch (e) {}
    try { removeYesListener(); } catch (e) {}
    try { modal.removeEventListener("pointerup", backdropHandler); } catch (e) {}
    try { btn.remove(); } catch (e) {}
    try { modal.remove(); } catch (e) {}
  };
}









