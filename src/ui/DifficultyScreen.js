import getImageForDevice from '../utils/getImageForDevice'

export function DifficultyScreen(container) {
    const bgImage = (function () {
        const ua = getImageForDevice();
        if (ua.includes('android_size')) return '/images/android_size/multibga.png';
        if (ua.includes('iphone_size')) return '/images/iphone_size/multibgi.png';
        return '/images/android_size/multibga.png';
    })();

    container.innerHTML = `
    <div class="difficulty-screen">
      <div 
        class="difficulty-bg"
        style="background-image: url('${bgImage}')"
      ></div>

      <div class="difficulty-card">
        <h2 class="difficulty-title">Difficulty Level ?</h2>

        <div class="difficulty-options">
          <button class="difficulty-btn" data-level="easy">
            <strong>Easy</strong>
            <span>Wind level (0–10 m/s)</span>
            <span>Target visibilty (100%)</span>
          </button>

          <button class="difficulty-btn" data-level="medium">
            <strong>Medium</strong>
            <span>Wind level (15–30 m/s)</span>
            <span>Target visibilty (90%)</span>
          </button>

          <button class="difficulty-btn" data-level="hard">
            <strong>Hard</strong>
            <span>Wind level (35–45 m/s)</span>
            <span>Target visibilty (70%)</span>
          </button>

          <button class="difficulty-btn" data-level="expert">
            <strong>Expert</strong>
            <span>Wind level (50–60 m/s)</span>
            <span>Target visibilty (50%)</span>
          </button>
        </div>

        <div class="buttons">
          <button id="backToMainBtn" class="primary">
            Back to main screen
          </button>
        </div>
      </div>
    </div>
  `

  //difficulty click handlers
    container.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.dataset.level;
            container.dispatchEvent(
                new CustomEvent('navigateGame', {
                    detail: { level }
                })
            );
        });
    });

  //back to main screen
    container
        .querySelector('#backToMainBtn')
        .addEventListener('click', () => {
            container.dispatchEvent(new CustomEvent('navigateMain'))
        })
}
