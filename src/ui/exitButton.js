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






// export function setupExitButton() {
//   // Clean up any existing exit UI
//   const existingBtn = document.getElementById('exitButton');
//   if (existingBtn) existingBtn.remove();
//   const existingModal = document.getElementById('exitModal');
//   if (existingModal) existingModal.remove();
//
//   // Create exit button
//   const btn = document.createElement('button');
//   btn.id = 'exitButton';
//   btn.className = 'exit-button';
//   btn.type = 'button';
//   btn.textContent = 'Exit';
//   // Improve touch behavior on mobile
//   // allow manipulation gestures and remove tap highlight
//   try {
//     btn.style.touchAction = 'manipulation';
//     btn.style.webkitTapHighlightColor = 'transparent';
//   } catch (e) {}
//
//   // Create modal markup (reusing modal-panel styling)
//   const modal = document.createElement('div');
//   modal.id = 'exitModal';
//   modal.className = 'modal hidden';
//   modal.setAttribute('aria-hidden', 'true');
//   modal.innerHTML = `
//     <div class="modal-panel exit-modal-panel">
//       <div class="exit-modal-content">
//         <h3>Are you sure?</h3>
//         <div class="exit-modal-actions">
//           <button id="exitYes" class="exit-yes">Yes</button>
//           <button id="exitNo" class="exit-no">No</button>
//         </div>
//       </div>
//     </div>
//   `;
//
//   // Append to body so it's always at the bottom of the viewport
//   document.body.appendChild(btn);
//   document.body.appendChild(modal);
//
//   // // Helper: attach a unified activation listener (pointer/touch/click)
//   // function addActivationListener(el, handler) {
//   //   let handled = false;
//   //   const wrapper = (e) => {
//   //     // Ignore duplicate activations
//   //     if (handled) return;
//   //     handled = true;
//   //
//   //     // For touch/pointer events, prevent the synthetic click when needed
//   //     try {
//   //       if (e && (e.type === 'touchstart' || e.type === 'pointerdown')) e.preventDefault();
//   //     } catch (err) {}
//   //
//   //     handler(e);
//   //
//   //     // small debounce window to avoid duplicates
//   //     setTimeout(() => { handled = false; }, 300);
//   //   };
//   //
//   //   if (window.PointerEvent) {
//   //     el.addEventListener('pointerdown', wrapper);
//   //   } else {
//   //     el.addEventListener('touchstart', wrapper, { passive: false });
//   //     el.addEventListener('click', wrapper);
//   //   }
//   //
//   //   // return a remover so cleanup can remove listeners
//   //   return () => {
//   //     if (window.PointerEvent) {
//   //       el.removeEventListener('pointerdown', wrapper);
//   //     } else {
//   //       el.removeEventListener('touchstart', wrapper);
//   //       el.removeEventListener('click', wrapper);
//   //     }
//   //   };
//   // }
//
//   //New code for Active Listener
//   function addActivationListener(el, handler) {
//     const listener = (e) => {
//       // Only block default for touch scrolling
//       if (e.cancelable) e.preventDefault();
//       handler(e);
//     };
//
//     // pointerup works consistently across mobile & desktop
//     el.addEventListener('pointerup', listener);
//
//     return () => {
//       el.removeEventListener('pointerup', listener);
//     };
//   }
//
//
//   // Show modal (use unified listener so mobile taps work)
//   const removeBtnListeners = addActivationListener(btn, () => {
//     const mainScreen = document.querySelector('.main-screen');
//     if (mainScreen) {
//       try { mainScreen.setAttribute('inert', ''); } catch (e) {}
//     }
//     modal.classList.remove('hidden');
//     modal.setAttribute('aria-hidden', 'false');
//     // move focus into modal (to No button)
//     const exitNo = modal.querySelector('#exitNo');
//     if (exitNo) try { exitNo.focus(); } catch (e) {}
//   });
//
//   // No button closes modal (mobile-friendly listener)
//   const exitNoBtn = modal.querySelector('#exitNo');
//   function hideExitModal() {
//     try {
//       const active = document.activeElement;
//       if (active && modal.contains(active)) active.blur();
//     } catch (e) {}
//     modal.classList.add('hidden');
//     modal.setAttribute('aria-hidden', 'true');
//     const mainScreen = document.querySelector('.main-screen');
//     if (mainScreen) {
//       try { mainScreen.removeAttribute('inert'); } catch (e) {}
//     }
//     // restore focus to the exit button
//     const exitBtnRef = document.getElementById('exitButton');
//     if (exitBtnRef) try { exitBtnRef.focus(); } catch (e) {}
//   }
//
//   const removeNoListeners = addActivationListener(exitNoBtn, () => {
//     hideExitModal();
//   });
//
//   // Yes button tries to close app/browser window (mobile-friendly listener)
//   const exitYesBtn = modal.querySelector('#exitYes');
//   const removeYesListeners = addActivationListener(exitYesBtn, () => {
//     // blur active element inside modal to avoid aria-hidden on focused descendant
//     try {
//       const active = document.activeElement;
//       if (active && modal.contains(active)) active.blur();
//     } catch (e) {}
//
//     // remove inert and hide modal before attempting exit
//     try {
//       const mainScreen = document.querySelector('.main-screen');
//       if (mainScreen) mainScreen.removeAttribute('inert');
//     } catch (e) {}
//     modal.classList.add('hidden');
//     modal.setAttribute('aria-hidden', 'true');
//
//     // Try Cordova / hybrid app exit
//     try {
//       if (navigator && navigator.app && typeof navigator.app.exitApp === 'function') {
//         navigator.app.exitApp();
//         return;
//       }
//     } catch (e) {}
//
//     // Try window.close (may be blocked by browser if not opened by script)
//     try {
//       window.close();
//       return;
//     } catch (e) {}
//
//     // Fallback: navigate away / blank page or history back
//     try {
//       window.location.href = 'about:blank';
//       return;
//     } catch (e) {}
//
//     try { history.back(); } catch (e) {}
//   });
//
//   // Accessibility: close modal on backdrop click (also support pointerdown)
//   const backdropHandler = (e) => {
//     if (e.target === modal) {
//       hideExitModal();
//     }
//   };
//   modal.addEventListener('click', backdropHandler);
//   if (window.PointerEvent) modal.addEventListener('pointerdown', backdropHandler);
//
//   // Return a cleanup function in case caller wants to remove the UI
//   return function cleanup() {
//     // remove our created listeners
//     try { if (removeBtnListeners) removeBtnListeners(); } catch (e) {}
//     try { if (removeNoListeners) removeNoListeners(); } catch (e) {}
//     try { if (removeYesListeners) removeYesListeners(); } catch (e) {}
//     try { modal.removeEventListener('click', backdropHandler); } catch (e) {}
//     try { if (window.PointerEvent) modal.removeEventListener('pointerdown', backdropHandler); } catch (e) {}
//
//     // remove DOM
//     try { btn.remove(); } catch (e) {}
//     try { modal.remove(); } catch (e) {}
//   };
// }




