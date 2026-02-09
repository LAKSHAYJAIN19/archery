
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

        <button id="exitGameBtn" class="primary">
          Exit to main
        </button>
      </div>
    </div>
  `;

    /* ================= EXIT ================= */
    const exitBtn = container.querySelector('#exitGameBtn');
    exitBtn.addEventListener('click', () => {
        container.dispatchEvent(new CustomEvent('navigateMain'));
    });

    /* ================= SLIDER ================= */
    const speedSlider = container.querySelector('#speedSlider');

    speedSlider.addEventListener('input', (e) => {
        arrowSpeed = Number(e.target.value);

        // Calculate score silently (do not display)
        const score = calculateShotScore(arrowSpeed, windStrength);

        // For ,now we just keep it internally
        console.log({
            level,
            arrowSpeed,
            windStrength,
            score,
        });
    });
}

/* ================= GAME LOGIC ================= */

/**
 * Calculates shot accuracy score (1–10)
 * based on arrow speed and wind
 */
function calculateShotScore(speed, wind) {
    /**
     * Ideal speed counters wind:
     * Higher wind → needs higher speed
     */
    const idealSpeed = wind * 2;

    // Difference from ideal
    const error = Math.abs(speed - idealSpeed);

    /**
     * Convert error into score
     * Small error → high score
     */
    let score = Math.round(10 - error / 2);

    // Clamp between 1 and 10
    score = Math.max(1, Math.min(10, score));

    return score;
}


