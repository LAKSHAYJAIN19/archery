export function renderInstructionsScreen(container) {
  container.innerHTML = `
    <div class="instructions-screen">
      <h2>How to play</h2>
      <p class="instructions">Shoot the arrow to gain maximum points.</p>
      <div class="buttons">
        <button id="backBtn">Back</button>
      </div>
    </div>
  `;

  const back = container.querySelector('#backBtn');
  if (back) back.addEventListener('click', () => {
    // main will handle navigation: dispatch a custom event
    container.dispatchEvent(new CustomEvent('navigateMain'));
  });
}
