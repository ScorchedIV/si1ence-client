// SI1ENCE Client - Combat-Optimized Eaglercraft 26.2 Launcher
// Low-latency PvP settings, custom HUD, and performance tuning

let currentPreset = 'balanced';
let clientLoaded = false;
let gameFrame = null;
let fpsCounter = null;

const PRESETS = {
  balanced: {
    renderDistance: 12,
    particleDistance: 16,
    shadowDistance: 40,
    fpsTarget: 60,
    latency: 'normal'
  },
  performance: {
    renderDistance: 8,
    particleDistance: 8,
    shadowDistance: 20,
    fpsTarget: 144,
    latency: 'ultra-low'
  },
  pvp: {
    renderDistance: 16,
    particleDistance: 4,
    shadowDistance: 12,
    fpsTarget: 120,
    latency: 'hyper-aggressive',
    features: ['hitboxes', 'chunk-borders', 'crystal-tracker', 'anchor-warning']
  },
  chunks: {
    renderDistance: 20,
    particleDistance: 12,
    shadowDistance: 32,
    fpsTarget: 60,
    latency: 'low'
  }
};

const COMBAT_SETTINGS = {
  'hyper-aggressive': {
    inputLag: 0,
    packetRate: 60,
    hitboxRender: true,
    trackerMode: 'crystal',
    deathMessage: 'si1ence'
  },
  'ultra-low': {
    inputLag: 1,
    packetRate: 30,
    hitboxRender: false,
    trackerMode: 'none',
    deathMessage: 'performance'
  },
  'low': {
    inputLag: 2,
    packetRate: 30,
    hitboxRender: true,
    trackerMode: 'anchor',
    deathMessage: 'chunk'
  },
  'normal': {
    inputLag: 3,
    packetRate: 20,
    hitboxRender: false,
    trackerMode: 'none',
    deathMessage: 'balanced'
  }
};

// Initialize UI
function init() {
  gameFrame = document.getElementById('game-frame');
  fpsCounter = document.getElementById('fps-box');

  // Load Rise Client on startup
  loadRiseClient();

  // Preset buttons
  document.querySelectorAll('.preset').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPreset = btn.dataset.preset;
      applyPreset(currentPreset);
      updateStatus(`Preset: ${currentPreset.toUpperCase()}`);
    });
  });

  // Load buttons
  document.getElementById('load-rise-btn').addEventListener('click', loadRiseClient);
  document.getElementById('load-url-btn').addEventListener('click', loadFromURL);
  document.getElementById('load-local-btn').addEventListener('click', loadLocalFile);

  // Toggle switches
  document.getElementById('toggle-crosshair').addEventListener('change', (e) => {
    toggleCrosshair(e.target.checked);
  });

  document.getElementById('toggle-fps').addEventListener('change', (e) => {
    toggleFPS(e.target.checked);
  });

  document.getElementById('toggle-particles').addEventListener('change', (e) => {
    applyParticleReduction(e.target.checked);
  });

  document.getElementById('toggle-shadows').addEventListener('change', (e) => {
    applyShadowReduction(e.target.checked);
  });

  // Start FPS monitoring
  startFPSMonitor();

  // Apply default preset
  applyPreset('pvp');
  updateStatus('SI1ENCE ready - Click "Load Rise" to play');
}

// Load Rise Client (now called SI1ENCE)
function loadRiseClient() {
  const url = 'https://raw.githubusercontent.com/CloudyIceWater/Riseeeeeiey/main/dist/RiseClient.html';
  gameFrame.src = url;
  document.getElementById('empty-state').style.display = 'none';
  updateStatus('SI1ENCE Eaglercraft 26.2 loading...');
  clientLoaded = true;
  applyPreset(currentPreset);
}

// Load from URL
function loadFromURL() {
  const url = document.getElementById('game-url').value;
  if (!url) {
    updateStatus('ERROR: No URL provided');
    return;
  }
  gameFrame.src = url;
  document.getElementById('empty-state').style.display = 'none';
  updateStatus(`Loading from URL: ${url}`);
  clientLoaded = true;
  applyPreset(currentPreset);
}

// Load local HTML file
function loadLocalFile() {
  const input = document.getElementById('local-file-input');
  input.click();
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const blob = new Blob([event.target.result], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      gameFrame.src = url;
      document.getElementById('empty-state').style.display = 'none';
      updateStatus(`Local client loaded: ${file.name}`);
      clientLoaded = true;
      applyPreset(currentPreset);
    };
    reader.readAsText(file);
  });
}

// Apply preset settings
function applyPreset(preset) {
  const config = PRESETS[preset] || PRESETS.balanced;
  const combat = COMBAT_SETTINGS[config.latency];

  document.body.className = `preset-${preset}`;

  // Inject settings into iframe if it's loaded
  if (clientLoaded && gameFrame.contentWindow) {
    try {
      gameFrame.contentWindow.postMessage({
        type: 'si1ence-config',
        preset: preset,
        ...config,
        combat: combat
      }, '*');
    } catch (e) {
      // CORS / Same-origin policy may block this
    }
  }

  updateStatus(`${preset.toUpperCase()} preset applied\nLatency: ${config.latency}\nTarget FPS: ${config.fpsTarget}`);
}

// Toggle crosshair
function toggleCrosshair(enabled) {
  const crosshair = document.getElementById('crosshair');
  if (enabled) {
    crosshair.classList.add('visible');
    updateStatus('SI1ENCE crosshair: ON');
  } else {
    crosshair.classList.remove('visible');
    updateStatus('SI1ENCE crosshair: OFF');
  }
}

// Toggle FPS display
function toggleFPS(enabled) {
  if (enabled) {
    fpsCounter.classList.add('visible');
    updateStatus('FPS counter: ON');
  } else {
    fpsCounter.classList.remove('visible');
    updateStatus('FPS counter: OFF');
  }
}

// Reduce particles
function applyParticleReduction(enabled) {
  if (clientLoaded && gameFrame.contentWindow) {
    try {
      gameFrame.contentWindow.postMessage({
        type: 'si1ence-particles',
        reduce: enabled
      }, '*');
    } catch (e) {}
  }
  updateStatus(enabled ? 'Particles reduced' : 'Particles normal');
}

// Reduce shadows
function applyShadowReduction(enabled) {
  if (clientLoaded && gameFrame.contentWindow) {
    try {
      gameFrame.contentWindow.postMessage({
        type: 'si1ence-shadows',
        reduce: enabled
      }, '*');
    } catch (e) {}
  }
  updateStatus(enabled ? 'Shadows reduced' : 'Shadows normal');
}

// FPS Monitor
let lastTime = performance.now();
let frames = 0;

function startFPSMonitor() {
  setInterval(() => {
    const now = performance.now();
    const delta = now - lastTime;
    if (delta >= 1000) {
      const fps = Math.round(frames * 1000 / delta);
      document.getElementById('fps-box').textContent = `FPS: ${fps}`;
      frames = 0;
      lastTime = now;
    }
    frames++;
  }, 16);
}

// Update status display
function updateStatus(message) {
  document.getElementById('status-text').textContent = message;
}

// Listen for messages from iframe
window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'si1ence-ready') {
    updateStatus('SI1ENCE client connected and ready for combat');
  }
  if (e.data && e.data.type === 'si1ence-death') {
    updateStatus(`Died: ${e.data.reason || 'SI1ENCE moment'}`);
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
