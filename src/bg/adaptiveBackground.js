export function setupAdaptiveBackground(selectedImagePath, selectedImageFile) {
  // returns an object to control/adapt background and focal picker
  function getSavedFocal(imageFile) {
    const raw = localStorage.getItem('bgFocal_' + imageFile);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  function saveFocal(imageFile, xPercent, yPercent) {
    localStorage.setItem('bgFocal_' + imageFile, JSON.stringify({x: xPercent, y: yPercent}));
  }

  function applySavedFocal(img, imageFile) {
    const saved = getSavedFocal(imageFile);
    if (!saved) return false;
    img.style.objectPosition = `${saved.x}% ${saved.y}%`;
    return true;
  }

  function adaptBackground() {
    const img = document.querySelector('.bg-image');
    const content = document.querySelector('.content');
    if (!img) return;

    // Ensure the image element fully fills the .bg container and covers the viewport
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.left = '0';
    img.style.width = '100%';
    img.style.height = '100%';

    // Always use cover so the image fills both width and height and crops as necessary
    img.style.objectFit = 'cover';

    // If user saved a focal point for this image, apply it; otherwise default to center
    const userFocalApplied = applySavedFocal(img, selectedImageFile);
    if (!userFocalApplied) {
      img.style.objectPosition = 'center center';
    }

    // Keep content offset (can be adjusted) so title/buttons sit visually over image
    if (content) content.style.marginTop = '14vh';
  }

  // Focal picker UI
  let focalOverlay = null;
  function openFocalPicker() {
    if (focalOverlay) return;
    focalOverlay = document.createElement('div');
    focalOverlay.className = 'focal-overlay';
    focalOverlay.innerHTML = `
      <div class="focal-instructions">Tap anywhere to set background focus</div>
      <div class="focal-done-row"><button id="focalDone">Done</button><button id="focalReset">Reset</button></div>
    `;
    document.body.appendChild(focalOverlay);

    const img = document.querySelector('.bg-image');

    function onTap(e) {
      e.preventDefault();
      let clientX, clientY;
      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX; clientY = e.clientY;
      }
      const rect = img.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      img.style.objectPosition = `${x.toFixed(1)}% ${y.toFixed(1)}%`;
      saveFocal(selectedImageFile, Number(x.toFixed(1)), Number(y.toFixed(1)));
      placeMarker(x, y);
    }

    function placeMarker(xPct, yPct) {
      let marker = focalOverlay.querySelector('.focal-marker');
      if (!marker) {
        marker = document.createElement('div');
        marker.className = 'focal-marker';
        focalOverlay.appendChild(marker);
      }
      // position relative to image rect
      const imgRect = img.getBoundingClientRect();
      const left = imgRect.left + (xPct / 100) * imgRect.width;
      const top = imgRect.top + (yPct / 100) * imgRect.height;
      marker.style.left = (left - 14) + 'px';
      marker.style.top = (top - 14) + 'px';
      marker.style.display = 'block';
    }

    focalOverlay.addEventListener('touchstart', onTap, {passive: false});
    focalOverlay.addEventListener('click', onTap);

    document.getElementById('focalDone').addEventListener('click', closeFocalPicker);
    document.getElementById('focalReset').addEventListener('click', () => {
      localStorage.removeItem('bgFocal_' + selectedImageFile);
      adaptBackground();
      const marker = focalOverlay.querySelector('.focal-marker'); if (marker) marker.style.display = 'none';
    });

    // If there's saved focal for this image, show marker
    const saved = getSavedFocal(selectedImageFile);
    if (saved) placeMarker(saved.x, saved.y);
  }

  function closeFocalPicker() {
    if (!focalOverlay) return;
    focalOverlay.remove();
    focalOverlay = null;
  }

  function setupLongPress() {
    const bg = document.querySelector('.bg');
    if (!bg) return;
    let pressTimer = null;

    function startPress() {
      if (pressTimer) clearTimeout(pressTimer);
      pressTimer = setTimeout(() => openFocalPicker(), 600);
    }
    function cancelPress() { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } }

    bg.addEventListener('touchstart', startPress);
    bg.addEventListener('mousedown', startPress);
    bg.addEventListener('touchend', cancelPress);
    bg.addEventListener('touchmove', cancelPress);
    bg.addEventListener('mouseup', cancelPress);
    bg.addEventListener('mouseleave', cancelPress);
  }

  // Initialize
  setupLongPress();
  adaptBackground();
  window.addEventListener('resize', adaptBackground);
  window.addEventListener('orientationchange', adaptBackground);

  // Exposed API
  return {
    adaptBackground,
    openFocalPicker,
    closeFocalPicker,
    getSavedFocal,
  };
}
