
export function renderGameScreen(container, level) {
    const bgMap = {
        easy: '/images/Dlevel/easy.png',
        medium: '/images/Dlevel/medium.png',
        hard: '/images/Dlevel/hard.png',
        expert: '/images/Dlevel/expert.png',
    };

    // Wind strength per difficulty (higher = harder)
    const windByLevel = {
        easy: 2,
        medium: 5,
        hard: 8,
        expert: 12,
    };

    let arrowSpeed = 1; // default minimum
    let windStrength = windByLevel[level];

    container.innerHTML = `
    <div class="game-screen level-${level}">
      <div class="game-bg" style="background-image: url('${bgMap[level]}')"></div>

      <div class="game-overlay">
        <h2 class="game-heading">${level.toUpperCase()} MODE</h2>
           <input
          type="range"
          min="1"
          max="30"
          value="1"
          id="speedSlider"
          class="speed-slider ${level}"
        />   

        <div class="bottom-actions">
            <button id="shootBtn" class="primary shoot-btn">
              Shoot
            </button>
            
            <button id="exitGameBtn" class="primary exit-btn">
              Exit to main
            </button>
        </div>
      </div>
      
      <!-- CONFIRMATION MODAL -->
      <div id="shootModal" class="shoot-modal hidden">
        <div class="shoot-box">
          <p id="shootText"></p>
          <div class="shoot-actions">
            <button id="shootYes" class="yes">Yes</button>
            <button id="shootNo" class="no">No</button>
          </div>
        </div>
      </div>
    </div>
  `;

    /* ================= EXIT ================= */
    const exitBtn = container.querySelector('#exitGameBtn');
    exitBtn.addEventListener('click', () => {
        container.dispatchEvent(new CustomEvent('navigateMain'));
    });
    const slider = container.querySelector('#speedSlider');
    slider.addEventListener('input', e => {
        arrowSpeed = Number(e.target.value);
    });

    /* ================= SHOOT FLOW ================= */
    const shootBtn = container.querySelector('#shootBtn');
    const modal = container.querySelector('#shootModal');
    const shootText = container.querySelector('#shootText');

    shootBtn.addEventListener('click', () => {
        shootText.textContent =
            `The speed of the arrow is ${arrowSpeed} m/s, do you want to shoot?`;

        modal.classList.remove('hidden');
    });

    container.querySelector('#shootNo').addEventListener('click', () => {
        modal.classList.add('hidden');
        slider.value = 1;
        arrowSpeed = 1;
    });

    container.querySelector('#shootYes').addEventListener('click', () => {
        modal.classList.add('hidden');

        const score = calculateShotScore(arrowSpeed, windStrength);

        container.dispatchEvent(
            new CustomEvent('navigateScore', {
                detail: {score}
            })
        );
    });

}

function calculateShotScore(speed, wind) {
    const idealSpeed = wind * 2;
    const error = Math.abs(speed - idealSpeed);

    let score = Math.round(10 - error / 2);
    score = Math.max(1, Math.min(10, score));

    return score;
}
