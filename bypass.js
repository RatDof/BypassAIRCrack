// ─── stealth-bypass.js ──────────────────────────────────────────────────────
(function () {
  "use strict";

  // ─── CONFIG ────────────────────────────────────────────────────────────────
  const CFG = {
    redirectUrls: [
      "https://raw.githubusercontent.com/dbofchl/bypass/main/bypass.txt",
      "https://pastebin.com/raw/your-fallback-link"
    ],
    musicUrl: "https://raw.githubusercontent.com/vanz-website/VanzBypass/main/music.mp3",
    telegram: "https://t.me/psteamadm_official",
    title: "PSTeamAdm",
    countdowns: { fast: 30, secure: 45, safe: 60 },
    autoMode: null // "fast" | "secure" | "safe" | null
  };

  // ─── STEALTH LAYER ────────────────────────────────────────────────────────
  (function stealth() {
    // Generate random class names to avoid fingerprinting
    const rnd = (len = 6) => Math.random().toString(36).substring(2, 2 + len);
    const boxClass = `vz-${rnd(8)}`;
    const btnClass = `vz-${rnd(8)}`;
    const creditClass = `vz-${rnd(8)}`;

    // ─── INJECT STYLES (via Blob to avoid detection) ──────────────────────
    const styleContent = `
      @keyframes g${rnd(4)} { 0%,100%{box-shadow:0 0 10px #00ffcc} 50%{box-shadow:0 0 30px #00ffcc} }
      @keyframes s${rnd(4)} { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      @keyframes r${rnd(4)} { 0%{color:#ff0000} 25%{color:#ffff00} 50%{color:#00ff00} 75%{color:#00ffff} 100%{color:#ff0000} }
      .${boxClass} { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
        background:rgba(6,10,23,0.97); backdrop-filter:blur(16px); color:#fff;
        padding:32px 28px; border-radius:20px; z-index:2147483647;
        width:320px; max-width:92vw; font-family:system-ui,sans-serif;
        text-align:center; box-sizing:border-box; border:2px solid #00ffcc;
        animation:g${rnd(4)} 3s infinite; box-shadow:0 20px 60px rgba(0,0,0,0.8); }
      .${boxClass} h2 { margin:0 0 4px 0; color:#00ffcc; font-size:20px;
        letter-spacing:2px; font-weight:800; text-shadow:0 0 20px rgba(0,255,204,0.4); }
      .${boxClass} .sub { color:#64748b; font-size:11px; letter-spacing:2px;
        font-weight:600; margin:0 0 22px 0; }
      .${btnClass} { width:100%; padding:14px; border:1px solid rgba(0,255,204,0.2);
        border-radius:10px; font-weight:700; cursor:pointer; font-size:14px;
        letter-spacing:1.5px; margin-bottom:10px; color:#fff;
        transition:all 0.25s ease; text-transform:uppercase;
        background:rgba(255,255,255,0.03); }
      .${btnClass}:hover { transform:scale(1.02); }
      .${btnClass}-f { border-color:#ff3366; color:#ff3366; }
      .${btnClass}-f:hover { background:#ff3366; color:#000; box-shadow:0 0 25px rgba(255,51,102,0.4); }
      .${btnClass}-s { border-color:#ffaa00; color:#ffaa00; }
      .${btnClass}-s:hover { background:#ffaa00; color:#000; box-shadow:0 0 25px rgba(255,170,0,0.4); }
      .${btnClass}-a { border-color:#00ccff; color:#00ccff; }
      .${btnClass}-a:hover { background:#00ccff; color:#000; box-shadow:0 0 25px rgba(0,204,255,0.4); }
      .${creditClass} { position:fixed; bottom:16px; right:20px; font-size:16px;
        font-weight:bold; font-family:monospace; z-index:2147483647;
        cursor:pointer; animation:r${rnd(4)} 4s linear infinite;
        text-decoration:none; background:transparent; border:none; }
      .${boxClass} .music { position:absolute; top:14px; right:14px;
        background:rgba(255,255,255,0.05); border:1px solid rgba(0,255,204,0.2);
        color:#ff4444; border-radius:50%; width:34px; height:34px;
        cursor:pointer; font-size:14px; display:flex; align-items:center;
        justify-content:center; transition:all 0.3s; z-index:10; }
      .${boxClass} .shortcut { margin-top:12px; font-size:10px; color:#475569; letter-spacing:0.5px; }
      .${boxClass} .shortcut kbd { background:rgba(255,255,255,0.06); padding:2px 8px;
        border-radius:4px; font-family:monospace; border:1px solid rgba(255,255,255,0.08); }
    `;

    const styleBlob = new Blob([styleContent], { type: "text/css" });
    const styleUrl = URL.createObjectURL(styleBlob);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = styleUrl;
    document.head.appendChild(link);

    // ─── WAIT FOR PAGE TO BE READY ─────────────────────────────────────────
    function waitForReady(callback) {
      if (document.readyState === "complete") {
        callback();
      } else {
        const observer = new MutationObserver(() => {
          if (document.readyState === "complete") {
            observer.disconnect();
            callback();
          }
        });
        observer.observe(document, { childList: true, subtree: true });
      }
    }

    waitForReady(() => {
      // Clean up any previous instances (using a unique ID to avoid detection)
      const uid = "vz-" + rnd(6);
      document.querySelectorAll(`[data-vz="${uid}"]`).forEach(el => el.remove());

      // ─── CREATE CREDIT LINK ──────────────────────────────────────────────
      const credit = document.createElement("a");
      credit.className = creditClass;
      credit.textContent = CFG.title;
      credit.href = CFG.telegram;
      credit.target = "_blank";
      credit.dataset.vz = uid;
      document.body.appendChild(credit);

      // ─── CREATE BOX ──────────────────────────────────────────────────────
      const box = document.createElement("div");
      box.className = boxClass;
      box.dataset.vz = uid;
      box.innerHTML = `
        <button class="music" id="vz-music-${uid}">🔇</button>
        <h2>${CFG.title}</h2>
        <p class="sub">SELECT BYPASS MODE</p>
        <button class="${btnClass} ${btnClass}-f" data-mode="fast">⚡ FAST (HIGH RISK)</button>
        <button class="${btnClass} ${btnClass}-s" data-mode="secure">🛡️ SECURE (MEDIUM)</button>
        <button class="${btnClass} ${btnClass}-a" data-mode="safe">🐢 SAFE (LOW RISK)</button>
        <div class="shortcut">Shortcuts: <kbd>1</kbd> FAST · <kbd>2</kbd> SECURE · <kbd>3</kbd> SAFE</div>
      `;
      document.body.appendChild(box);

      // ─── MUSIC ────────────────────────────────────────────────────────────
      let audio = null;
      const musicBtn = document.getElementById(`vz-music-${uid}`);
      let loading = false;

      musicBtn.addEventListener("click", async () => {
        if (loading) return;
        if (!audio) {
          loading = true;
          musicBtn.textContent = "⏳";
          let url = CFG.musicUrl;
          try {
            const res = await fetch(url + "?t=" + Date.now());
            const txt = (await res.text()).trim();
            if (txt && txt.startsWith("http")) url = txt;
          } catch {}
          audio = new Audio(url);
          audio.loop = true;
          loading = false;
        }
        if (audio.paused) {
          audio.play().then(() => {
            musicBtn.textContent = "🔊";
            musicBtn.style.color = "#00ffcc";
            musicBtn.style.borderColor = "#00ffcc";
          }).catch(() => { musicBtn.textContent = "🔇"; });
        } else {
          audio.pause();
          musicBtn.textContent = "🔇";
          musicBtn.style.color = "#ff4444";
          musicBtn.style.borderColor = "rgba(0,255,204,0.2)";
        }
      });

      // ─── KEYBOARD ─────────────────────────────────────────────────────────
      const keyHandler = (e) => {
        if (e.key === "1") handleMode("fast");
        else if (e.key === "2") handleMode("secure");
        else if (e.key === "3") handleMode("safe");
      };
      document.addEventListener("keydown", keyHandler);

      // ─── MODE HANDLER ────────────────────────────────────────────────────
      function handleMode(mode) {
        const seconds = CFG.countdowns[mode];
        if (!seconds) return;
        box.remove();
        credit.remove();
        document.removeEventListener("keydown", keyHandler);
        startRedirect(seconds);
      }

      document.querySelectorAll(`.${btnClass}`).forEach(btn => {
        btn.addEventListener("click", () => handleMode(btn.dataset.mode));
      });

      // ─── REDIRECT ────────────────────────────────────────────────────────
      async function startRedirect(sec) {
        const overlay = document.createElement("div");
        overlay.style.cssText = `
          position:fixed; top:0; left:0; width:100%; height:100%;
          background:rgba(3,7,18,0.92); backdrop-filter:blur(10px);
          z-index:2147483647; display:flex; align-items:center;
          justify-content:center; font-family:system-ui,sans-serif;
        `;
        overlay.innerHTML = `
          <div style="text-align:center;">
            <div style="width:60px; height:60px; border:4px solid rgba(0,255,204,0.1);
              border-top:4px solid #00ffcc; border-radius:50%; margin:0 auto 20px;
              animation:s${rnd(4)} 0.8s linear infinite;"></div>
            <p style="color:#00ffcc; font-size:18px; font-weight:700; letter-spacing:2px;">FETCHING...</p>
          </div>
        `;
        document.body.appendChild(overlay);

        let redirectUrl = null;
        for (const url of CFG.redirectUrls) {
          try {
            const res = await fetch(url + "?t=" + Date.now());
            const txt = (await res.text()).trim();
            if (txt && txt.startsWith("http")) { redirectUrl = txt; break; }
          } catch {}
        }

        if (!redirectUrl) {
          overlay.innerHTML = `
            <div style="text-align:center; color:#ff4444;">
              <div style="font-size:48px; margin-bottom:16px;">⚠️</div>
              <p style="font-size:18px; font-weight:700;">NO REDIRECT URL</p>
              <button onclick="this.parentElement.parentElement.remove()"
                style="margin-top:20px; background:#00ffcc; color:#000;
                border:none; padding:10px 30px; border-radius:8px;
                font-weight:700; cursor:pointer;">CLOSE</button>
            </div>
          `;
          return;
        }

        overlay.innerHTML = `
          <div style="text-align:center;">
            <div style="position:relative; width:220px; height:220px; margin:0 auto;">
              <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
                width:200px; height:200px; border-radius:50%;
                background:conic-gradient(transparent 0deg,#ff3366 40deg,#ffaa00 140deg,#00ccff 260deg,transparent 360deg);
                filter:blur(20px); opacity:0.6; animation:s${rnd(4)} 3s linear infinite;"></div>
              <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
                width:180px; height:180px; border-radius:50%;
                background:conic-gradient(transparent 0deg,#00ffcc 20deg,#00ffff 100deg,#ffaa00 200deg,transparent 360deg);
                filter:blur(12px); opacity:0.5; animation:s${rnd(4)} 2s linear infinite reverse;"></div>
              <svg width="220" height="220" style="transform:rotate(-90deg); position:relative; z-index:2;">
                <circle cx="110" cy="110" r="90" fill="rgba(6,10,23,0.7)" stroke="rgba(0,255,204,0.1)" stroke-width="12"></circle>
                <circle id="vz-progress-${uid}" cx="110" cy="110" r="90" fill="none"
                  stroke="#00ffcc" stroke-width="12" stroke-dasharray="565"
                  stroke-dashoffset="565" stroke-linecap="round"
                  style="filter:drop-shadow(0 0 10px #00ffcc); transition:stroke-dashoffset 1s linear;">
                </circle>
              </svg>
              <div id="vz-count-${uid}" style="position:absolute; top:50%; left:50%;
                transform:translate(-50%,-50%); font-size:52px; font-weight:900;
                color:#fff; z-index:3; text-shadow:0 0 30px rgba(0,255,204,0.3);">${sec}</div>
            </div>
            <p style="margin-top:24px; color:#00ffcc; font-size:14px;
              font-weight:700; letter-spacing:3px;">REDIRECTING...</p>
          </div>
        `;

        const progress = overlay.querySelector(`#vz-progress-${uid}`);
        const countText = overlay.querySelector(`#vz-count-${uid}`);
        const total = 565;
        let remaining = sec;

        const timer = setInterval(() => {
          remaining--;
          countText.textContent = remaining;
          progress.style.strokeDashoffset = total * (remaining / sec);
          if (remaining <= 0) {
            clearInterval(timer);
            if (audio) { audio.pause(); audio = null; }
            overlay.remove();
            window.location.replace(redirectUrl);
          }
        }, 1000);
      }

      // ─── AUTO MODE ──────────────────────────────────────────────────────
      if (CFG.autoMode && CFG.countdowns[CFG.autoMode]) {
        setTimeout(() => {
          if (document.body.contains(box)) {
            handleMode(CFG.autoMode);
          }
        }, 300);
      }
    });
  })();
})();
