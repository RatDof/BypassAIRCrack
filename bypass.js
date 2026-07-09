// ─── bypass-combo.js ──────────────────────────────────────────────────────
(function () {
  "use strict";

  // 1. Cookie Injection
  document.cookie = "verified=true; path=/; max-age=3600";
  document.cookie = "session=authenticated; path=/; max-age=3600";

  // 2. localStorage Override
  localStorage.setItem("isVerified", "true");
  localStorage.setItem("hasKey", "true");

  // 3. Hook fetch() to mock validation
  const originalFetch = window.fetch;
  window.fetch = function (url, options) {
    if (url.includes("validate") || url.includes("verify") || url.includes("key")) {
      return Promise.resolve(new Response(
        JSON.stringify({ success: true, key: "BYPASSED", data: { valid: true } }),
        { status: 200 }
      ));
    }
    return originalFetch.call(this, url, options);
  };

  // 4. Try to trigger redirect
  function triggerRedirect() {
    // Try various redirect methods
    const redirects = [
      () => {
        // Check for a success URL in the DOM
        const el = document.querySelector("[data-redirect]");
        if (el) window.location.replace(el.dataset.redirect);
      },
      () => {
        // Check for a redirect function
        if (typeof window.redirect === "function") window.redirect();
        if (typeof window.onSuccess === "function") window.onSuccess();
      },
      () => {
        // Check for URL parameters
        const params = new URLSearchParams(window.location.search);
        const redirectParam = params.get("redirect") || params.get("next");
        if (redirectParam && redirectParam.startsWith("http")) {
          window.location.replace(redirectParam);
        }
      },
      () => {
        // Check for a meta refresh
        const meta = document.querySelector("meta[http-equiv='refresh']");
        if (meta) {
          const content = meta.getAttribute("content");
          const match = content.match(/url=([^;]+)/);
          if (match) window.location.replace(match[1]);
        }
      }
    ];

    for (const fn of redirects) {
      try { fn(); } catch {}
    }

    // If nothing worked, reload
    setTimeout(() => window.location.reload(), 1000);
  }

  // Run after page is ready
  if (document.readyState === "complete") {
    setTimeout(triggerRedirect, 500);
  } else {
    window.addEventListener("load", () => setTimeout(triggerRedirect, 500));
  }

  console.log("[Bypass] Combined bypass active");
})();
