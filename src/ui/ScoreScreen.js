export function renderScoreScreen(container, score) {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const bgImage = isIOS
        ? '/images/iphone_size/scorebgi.png'
        : '/images/android_size/scorebga.png';

    let message = '';
    if (score >= 1 && score <= 4) {
        message = 'Ahh, not so perfect, Try again';
    } else if (score >= 5 && score <= 7) {
        message = 'Good, but you can do better';
    } else if (score >= 8 && score <= 9) {
        message = 'Great , few inches away from bullseye';
    } else if (score === 10) {
        message = 'Excellent, you have got an eagle eye';
    }

    container.innerHTML = `
      <div class="score-screen">
        <div class="score-bg" style="background-image: url('${bgImage}')"></div>

        <div class="score-overlay">
          <div class="score-card">
          <h2>Your Score: ${score}</h2>
          <p>${message}</p>
          <div class="score-buttons">
              <button id="playAgainBtn" class="primary">Play Again</button>  
              <button id="backToMain" class="primary">
                Back to Main Menu
              </button>
          </div>  
          </div>
        </div>
      </div>
    `;

    container.querySelector('#playAgainBtn')
        ?.addEventListener('click', () => {
            container.dispatchEvent(new CustomEvent('navigateDifficulty'));
        });

    container.querySelector('#backToMain').addEventListener('click', () => {
        container.dispatchEvent(new CustomEvent('navigateMain'));
    });
}
