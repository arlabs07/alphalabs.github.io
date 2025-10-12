! function() {
  let t, e = !1,
    o = 16,
    a = !1,
    i = !0,
    r = !0,
    n, l = "default",
    s = !1,
    d = !0,
    p = !1,
    c = !1,
    g = !0,
    $ = !0,
    f = Date.now(),
    m = 0,
    b = 0,
    x = {
      background: "#1a1a1a",
      text: "#ffffff",
      accent: "#BB86FC",
      secondary: "#9C27B0",
      border: "#333333",
      cardBg: "#2a2a2a",
      headerBg: "#0a0a0a",
      sidebarBg: "#0a0a0a",
      buttonBg: "#BB86FC",
      linkColor: "#BB86FC",
      hoverBg: "#2a2a2a",
      activeBg: "#BB86FC",
      shadowColor: "rgba(187,134,252,0.4)"
    },
    u = [{
      title: "Welcome!",
      message: "All accessibility features are now active and ready to use.",
      duration: 4500,
      url: null
    }],
    h = [{
      type: "popup",
      text: "Discover amazing features and tools designed to enhance your experience!",
      duration: 9e3,
      imgSrc: "https://image.pollinations.ai/prompt/Modern%20technology%20banner%20with%20vibrant%20colors%20and%20dynamic%20design?width=400&height=300&nologo=true"
    },
    {
      type: "bottom",
      text: "Explore new possibilities with our latest updates!",
      duration: 5e3,
      imgSrc: "https://image.pollinations.ai/prompt/Professional%20banner%20with%20gradient%20colors?width=400&height=300&nologo=true"
    },
    {
      type: "banner",
      text: "Limited time offer: Enhanced features now available!",
      duration: 9e3,
      url: "https://example.com/features",
      imgSrc: "https://image.pollinations.ai/prompt/Promotional%20banner%20with%20bold%20text?width=400&height=300&nologo=true"
    }],
    y = [],
    speechQueue = [],
    currentSpeechIndex = 0,
    isSpeechPlaying = !1;
  
  function _() {
    return "light" === l ?
      {
        bg: "#ffffff",
        text: "#1a1a1a",
        accent: "#1976d2",
        border: "#e0e0e0",
        card: "#f8f9fa",
        shadow: "rgba(25,118,210,0.2)"
      } :
      "reading-comfort" === l ?
      {
        bg: "#f4f1ea",
        text: "#242424",
        accent: "#667c6a",
        border: "#d6d3ca",
        card: "#ffffff",
        shadow: "rgba(102,124,106,0.2)"
      } :
      "custom" === l ? {
        bg: x
          .background,
        text: x.text,
        accent: x.accent,
        border: x
          .border,
        card: x.cardBg,
        shadow: x.shadowColor
      } :
      {
        bg: "#1a1a1a",
        text: "#ffffff",
        accent: "#BB86FC",
        border: "#333333",
        card: "#2a2a2a",
        shadow: "rgba(187,134,252,0.2)"
      }
  }
  
  function v() {
    if (c) return;
    let t =
      document.createElement("script");
    t.onload = () => { c = !0 }, t
      .onerror = () => {
        console.error(
          "Failed to load html2canvas"
        )
      }, t.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      document.head.appendChild(t)
  }
  let
    k = document.createElement("div");
  k.innerHTML =
    '<i class="fas fa-universal-access"></i>',
    k.style.cssText =
    "position:fixed;right:15px;top:50%;transform:translateY(-50%);width:50px;height:50px;background:linear-gradient(135deg,#BB86FC,#9C27B0);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:9999;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);box-shadow:0 4px 15px rgba(187,134,252,0.4);color:#000;font-size:20px;will-change:transform;";
  let
    w = document.createElement("div");
  w.id = "notificationContainer", w
    .style.cssText =
    "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9998;display:flex;flex-direction:column-reverse;gap:8px;max-width:320px;width:80%;pointer-events:none;";
  let
    B = document.createElement("div");
  B.style.cssText =
    "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);z-index:10000;display:none;align-items:center;justify-content:center;opacity:0;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);will-change:opacity;";
  let
    C = document.createElement("div");
  C.style.cssText =
    "position:fixed;top:0;left:0;width:100vw;height:100vh;background:#1a1a1a;z-index:11000;display:none;opacity:0;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);overflow-y:auto;-webkit-overflow-scrolling:touch;";
  let
    E = document.createElement("div");
  
  function z(t, e, o = 5e3, a =
    null) {
    if (!g || s) return;
    b++;
    let i = document.createElement(
        "div"),
      r = "notif-" + Date.now() + "-" +
      b,
      n = _();
    i.id = r, i.style.cssText =
      `background:${n.card};border:1px solid ${n.border};border-radius:8px;padding:12px 16px;margin-bottom:8px;box-shadow:0 2px 12px ${n.shadow};backdrop-filter:blur(5px);color:${n.text};pointer-events:auto;transform:translateY(30px) scale(0.95);opacity:0;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);cursor:${a?"pointer":"default"};position:relative;overflow:hidden;max-width:100%;`,
      i.innerHTML =
      `<div style="display:flex;align-items:flex-start;gap:10px;"><div style="flex:1;min-width:0;"><div style="font-weight:600;font-size:12px;margin-bottom:2px;color:${n.text};">${t}</div><div style="font-size:11px;opacity:0.8;line-height:1.3;color:${n.text};">${e}</div></div><button onclick="removeNotification('${r}')" style="position:absolute;top:6px;right:6px;background:rgba(${"#ffffff"===n.text?"255,255,255":"0,0,0"},0.1);border:none;color:${n.text};width:20px;height:20px;border-radius:50%;cursor:pointer;font-size:10px;display:flex;align-items:center;justify-content:center;opacity:0.6;transition:all 0.2s ease;"><i class="fas fa-times"></i></button></div>`,
      a && i.addEventListener("click",
        t => {
          "BUTTON" === t.target
            .tagName || t.target
            .closest("button") || window
            .open(a, "_blank")
        }), w
      .appendChild(i),
      requestAnimationFrame(() => {
        i
          .style.transform =
          "translateY(0) scale(1)", i
          .style.opacity = "1"
      }),
      setTimeout(() =>
        removeNotification(r), o),
      window.removeNotification =
      function(t) {
        let e = document
          .getElementById(t);
        e && (e.style.transform =
          "translateY(30px) scale(0.95)",
          e.style.opacity = "0",
          setTimeout(() => e.remove(),
            300))
      }
  }
  
  function T() {
    if (!$ || s)
      return;
    let t = () => {
        if (y
          .length >= 2 || !$ || s)
          return;
        let t = h[Math.floor(
          Math.random() * h.length)];
        !
        function t(e) {
          if (!$ || s ||
            m >= 5e3) return;
          let o = (
            Date.now() - f) / 36e5;
          o > 1 && (f = Date.now(), m =
            0), m++;
          let a = document
            .createElement("div"),
            i = "ad-" + Date.now(),
            r = _();
          a.id = i;
          let n =
            `<div style="display:inline-flex;align-items:center;gap:4px;background:${r.accent};color:${r.bg};padding:2px 6px;border-radius:4px;font-size:9px;font-weight:700;letter-spacing:0.5px;"><i class="fas fa-bullhorn" style="font-size:8px;"></i>SPONSORED</div>`,
            l =
            `<i class="fas fa-bullhorn" style="color:${r.accent};font-size:12px;" title="Sponsored"></i>`;
          "popup" ===
          e.type ? (a.style.cssText =
              "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);z-index:9997;display:flex;align-items:center;justify-content:center;opacity:0;transition:all 0.4s ease;",
              a.innerHTML =
              `<div style="background:${r.card};border:1px solid ${r.border};border-radius:12px;max-width:500px;width:90%;max-height:80vh;overflow:hidden;position:relative;box-shadow:0 20px 60px ${r.shadow};"><div style="position:absolute;top:15px;left:15px;z-index:1;">${n}</div><button onclick="removeAd('${i}')" style="position:absolute;top:15px;right:15px;background:rgba(${"#ffffff"===r.text?"255,255,255":"0,0,0"},0.1);border:none;color:${r.text};width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:14px;z-index:1;transition:all 0.3s ease;"><i class="fas fa-times"></i></button><div style="padding:50px 25px 30px;">${e.imgSrc?`<img src="${e.imgSrc}" alt="Advertisement" style="width:100%;height:auto;border-radius:8px;margin-bottom:20px;" loading="lazy" onerror="this.style.display='none'">`:e.videoSrc?`<video src="${e.videoSrc}" style="width:100%;height:auto;border-radius:8px;margin-bottom:20px;" controls muted></video>`:`<div style="background:${r.bg};padding:40px 20px;text-align:center;border-radius:8px;margin-bottom:20px;color:${r.text};"><i class="fas fa-bullhorn" style="font-size:48px;margin-bottom:15px;color:${r.accent};"></i></div>`}<p style="color:${r.text};opacity:0.8;margin:0 0 20px 0;line-height:1.4;font-size:14px;">${e.text}</p>${e.url?`<button onclick="window.open('${e.url}','_blank');removeAd('${i}');" style="background:${r.accent};color:${r.bg};border:none;padding:12px 24px;border-radius:8px;cursor:pointer;font-weight:600;width:100%;transition:all 0.3s ease;font-size:14px;">Learn More</button>`:""}</div></div>`
            ) : "bottom" === e.type &&
            (a.style.cssText =
              `position:fixed;bottom:0;left:0;width:100%;background:${r.card};color:${r.text};padding:12px 20px;z-index:9996;transform:translateY(100%);transition:all 0.4s ease;box-shadow:0 -2px 15px ${r.shadow};border-top:1px solid ${r.border};`,
              a.innerHTML =
              `<div style="display:flex;align-items:center;justify-content:space-between;max-width:1200px;margin:0 auto;"><div style="display:flex;align-items:center;gap:12px;flex:1;"><div>${l}</div><div style="flex:1;"><div style="font-weight:600;font-size:13px;color:${r.text};">${e.text}</div></div></div><div style="display:flex;align-items:center;gap:12px;">${e.url?`<button onclick="window.open('${e.url}','_blank');" style="background:${r.accent};color:${r.bg};border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;transition:all 0.3s ease;">Learn More</button>`:""}<button onclick="removeAd('${i}')" style="background:none;border:none;color:${r.text};font-size:14px;cursor:pointer;padding:4px;opacity:0.7;transition:all 0.3s ease;"><i class="fas fa-times"></i></button></div></div>`
            ), document.body
            .appendChild(a), y.push(i),
            requestAnimationFrame(
              () => {
                "popup" === e.type ?
                  a.style.opacity =
                  "1" : "bottom" === e
                  .type && (a.style
                    .transform =
                    "translateY(0)")
              }), e
            .duration && setTimeout(
              () => removeAd(i), e
              .duration), window
            .removeAd = function(
              t) {
              let e = document
                .getElementById(t);
              e && ("fixed" === e.style
                .position && (e.style
                  .opacity = "0", e
                  .style.transform =
                  "translateY(100%)"),
                setTimeout(() => e
                  .remove(), 400), y =
                y.filter(e => e !== t)
              )
            }
        }(t)
      },
      e = () => 3e4 * Math.random() +
      15e3,
      o = () => {
        setTimeout(() => {
          t
            (), o()
        }, e())
      };
    o()
  }
  E.style.cssText =
    "background:linear-gradient(135deg,#1a1a1a,#2a2a2a);border:2px solid #BB86FC;border-radius:15px;padding:25px;max-width:500px;width:90%;max-height:85vh;overflow:hidden;box-shadow:0 20px 60px rgba(187,134,252,0.3);position:relative;will-change:transform;",
    E.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;"><h3 style="color:#BB86FC;margin:0;font-size:18px;"><i class="fas fa-cog" style="margin-right:8px;"></i>Accessibility Settings</h3><button id="closeOverlay" style="background:none;border:none;color:#BB86FC;font-size:20px;cursor:pointer;padding:5px;border-radius:50%;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);"><i class="fas fa-times"></i></button></div><div id="scrollableContent" style="overflow-y:auto;max-height:calc(85vh - 120px);padding-right:10px;"><div style="display:grid;gap:15px;"><div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(187,134,252,0.1);border-radius:8px;transition:all 0.3s ease;"><span style="color:#fff;font-size:14px;"><i class="fas fa-book-open" style="margin-right:8px;color:#BB86FC;"></i>Reading Mode</span><button id="readingModeBtn" style="background:#667c6a;color:#fff;padding:8px 16px;border:none;border-radius:6px;cursor:pointer;transition:all 0.3s ease;font-size:12px;font-weight:600;">Open</button></div><div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(187,134,252,0.1);border-radius:8px;transition:all 0.3s ease;"><span style="color:#fff;font-size:14px;"><i class="fas fa-bell" style="margin-right:8px;color:#BB86FC;"></i>Notifications</span><label style="position:relative;display:inline-block;width:52px;height:26px;"><input type="checkbox" id="notificationsToggle" checked style="opacity:0;width:0;height:0;"><span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#333;border-radius:26px;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);"><span style="position:absolute;content:\'\';height:22px;width:22px;left:2px;top:2px;background:#BB86FC;border-radius:50%;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);transform:translateX(24px);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></span></span></label></div><div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(187,134,252,0.1);border-radius:8px;transition:all 0.3s ease;"><span style="color:#fff;font-size:14px;"><i class="fas fa-ad" style="margin-right:8px;color:#BB86FC;"></i>Ads & Promotions</span><label style="position:relative;display:inline-block;width:52px;height:26px;"><input type="checkbox" id="adsToggle" checked style="opacity:0;width:0;height:0;"><span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#333;border-radius:26px;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);"><span style="position:absolute;content:\'\';height:22px;width:22px;left:2px;top:2px;background:#BB86FC;border-radius:50%;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);transform:translateX(24px);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></span></span></label></div><div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(187,134,252,0.1);border-radius:8px;transition:all 0.3s ease;"><span style="color:#fff;font-size:14px;"><i class="fas fa-text-height" style="margin-right:8px;color:#BB86FC;"></i>Font Size</span><div style="display:flex;gap:8px;align-items:center;"><button id="decreaseFont" style="width:32px;height:32px;border:1px solid #BB86FC;background:transparent;color:#BB86FC;border-radius:6px;cursor:pointer;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);font-size:14px;display:flex;align-items:center;justify-content:center;">-</button><span id="fontDisplay" style="color:#BB86FC;min-width:45px;text-align:center;font-size:14px;font-weight:500;">16px</span><button id="increaseFont" style="width:32px;height:32px;border:1px solid #BB86FC;background:transparent;color:#BB86FC;border-radius:6px;cursor:pointer;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);font-size:14px;display:flex;align-items:center;justify-content:center;">+</button></div></div><div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(187,134,252,0.1);border-radius:8px;transition:all 0.3s ease;"><span style="color:#fff;font-size:14px;"><i class="fas fa-palette" style="margin-right:8px;color:#BB86FC;"></i>Theme</span><select id="themeSelect" style="background:#0a0a0a;border:1px solid #BB86FC;color:#fff;padding:6px 12px;border-radius:6px;font-size:13px;transition:all 0.3s ease;"><option value="default">Default</option><option value="light">Light Mode</option><option value="reading-comfort">Reading Comfort</option><option value="custom">Custom Theme</option></select></div><div id="customThemePanel" style="display:none;padding:15px;background:rgba(187,134,252,0.05);border-radius:10px;margin:10px 0;border:1px solid rgba(187,134,252,0.2);"><h4 style="color:#BB86FC;margin:0 0 15px 0;font-size:15px;font-weight:600;"><i class="fas fa-paint-brush" style="margin-right:8px;"></i>Custom Theme Colors</h4><div style="overflow-x:auto;padding:5px 0;"><div style="display:flex;gap:15px;min-width:max-content;padding:5px;flex-wrap:wrap;justify-content:center;"><div style="text-align:center;margin-bottom:10px;"><label style="color:#fff;font-size:12px;display:block;margin-bottom:8px;font-weight:500;">Background</label><input type="color" id="bgColor" value="#1a1a1a" style="width:40px;height:40px;border:2px solid #BB86FC;border-radius:50%;cursor:pointer;padding:0;background:transparent;transition:all 0.3s ease;"></div><div style="text-align:center;margin-bottom:10px;"><label style="color:#fff;font-size:12px;display:block;margin-bottom:8px;font-weight:500;">Text</label><input type="color" id="textColor" value="#ffffff" style="width:40px;height:40px;border:2px solid #BB86FC;border-radius:50%;cursor:pointer;padding:0;background:transparent;transition:all 0.3s ease;"></div><div style="text-align:center;margin-bottom:10px;"><label style="color:#fff;font-size:12px;display:block;margin-bottom:8px;font-weight:500;">Accent</label><input type="color" id="accentColor" value="#BB86FC" style="width:40px;height:40px;border:2px solid #BB86FC;border-radius:50%;cursor:pointer;padding:0;background:transparent;transition:all 0.3s ease;"></div><div style="text-align:center;margin-bottom:10px;"><label style="color:#fff;font-size:12px;display:block;margin-bottom:8px;font-weight:500;">Secondary</label><input type="color" id="secondaryColor" value="#9C27B0" style="width:40px;height:40px;border:2px solid #BB86FC;border-radius:50%;cursor:pointer;padding:0;background:transparent;transition:all 0.3s ease;"></div><div style="text-align:center;margin-bottom:10px;"><label style="color:#fff;font-size:12px;display:block;margin-bottom:8px;font-weight:500;">Borders</label><input type="color" id="borderColor" value="#333333" style="width:40px;height:40px;border:2px solid #BB86FC;border-radius:50%;cursor:pointer;padding:0;background:transparent;transition:all 0.3s ease;"></div><div style="text-align:center;margin-bottom:10px;"><label style="color:#fff;font-size:12px;display:block;margin-bottom:8px;font-weight:500;">Cards</label><input type="color" id="cardBgColor" value="#2a2a2a" style="width:40px;height:40px;border:2px solid #BB86FC;border-radius:50%;cursor:pointer;padding:0;background:transparent;transition:all 0.3s ease;"></div></div></div></div><div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(187,134,252,0.1);border-radius:8px;transition:all 0.3s ease;"><span style="color:#fff;font-size:14px;"><i class="fas fa-mouse-pointer" style="margin-right:8px;color:#BB86FC;"></i>Smooth Scroll</span><label style="position:relative;display:inline-block;width:52px;height:26px;"><input type="checkbox" id="smoothScrollToggle" checked style="opacity:0;width:0;height:0;"><span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#333;border-radius:26px;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);"><span style="position:absolute;content:\'\';height:22px;width:22px;left:2px;top:2px;background:#BB86FC;border-radius:50%;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);transform:translateX(24px);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></span></span></label></div><div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(187,134,252,0.1);border-radius:8px;transition:all 0.3s ease;"><span style="color:#fff;font-size:14px;"><i class="fas fa-spinner" style="margin-right:8px;color:#BB86FC;"></i>Lazy Loading</span><label style="position:relative;display:inline-block;width:52px;height:26px;"><input type="checkbox" id="lazyLoadToggle" checked style="opacity:0;width:0;height:0;"><span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#333;border-radius:26px;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);"><span style="position:absolute;content:\'\';height:22px;width:22px;left:2px;top:2px;background:#BB86FC;border-radius:50%;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);transform:translateX(24px);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></span></span></label></div><div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(187,134,252,0.1);border-radius:8px;transition:all 0.3s ease;"><span style="color:#fff;font-size:14px;"><i class="fas fa-adjust" style="margin-right:8px;color:#BB86FC;"></i>High Contrast</span><label style="position:relative;display:inline-block;width:52px;height:26px;"><input type="checkbox" id="contrastToggle" style="opacity:0;width:0;height:0;"><span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#333;border-radius:26px;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);"><span style="position:absolute;content:\'\';height:22px;width:22px;left:2px;top:2px;background:#555;border-radius:50%;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></span></span></label></div><div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(187,134,252,0.1);border-radius:8px;transition:all 0.3s ease;"><span style="color:#fff;font-size:14px;"><i class="fas fa-eye" style="margin-right:8px;color:#BB86FC;"></i>Focus Highlight</span><label style="position:relative;display:inline-block;width:52px;height:26px;"><input type="checkbox" id="focusToggle" style="opacity:0;width:0;height:0;"><span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#333;border-radius:26px;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);"><span style="position:absolute;content:\'\';height:22px;width:22px;left:2px;top:2px;background:#555;border-radius:50%;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></span></span></label></div></div></div><button id="resetAll" style="width:100%;padding:14px;background:linear-gradient(135deg,#BB86FC,#9C27B0);border:none;color:#000;border-radius:10px;cursor:pointer;font-weight:600;font-size:14px;margin-top:20px;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);box-shadow:0 4px 15px rgba(187,134,252,0.3);"><i class="fas fa-undo" style="margin-right:8px;"></i>Reset All Settings</button>',
    C.innerHTML =
    '<div id="readingHeader" style="position:sticky;top:0;left:0;right:0;height:70px;z-index:12000;display:flex;align-items:center;justify-content:space-between;padding:0 20px;box-shadow:0 2px 10px rgba(0,0,0,0.1);"><h1 id="readingPageTitle" style="margin:0;font-size:20px;font-weight:600;flex:1;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;max-width:calc(100% - 200px);"></h1><div style="display:flex;align-items:center;gap:10px;flex-shrink:0;"><button id="speakButton" style="background:none;border:none;font-size:20px;cursor:pointer;padding:8px;border-radius:50%;transition:all 0.3s ease;width:40px;height:40px;display:flex;align-items:center;justify-content:center;" title="Read Aloud"><i class="fas fa-headphones"></i></button><button id="pngButton" style="background:none;border:none;font-size:18px;cursor:pointer;padding:8px;border-radius:50%;transition:all 0.3s ease;width:40px;height:40px;display:flex;align-items:center;justify-content:center;" title="Save as PNG"><i class="fas fa-image"></i></button><button id="readingThemeToggle" style="background:none;border:none;font-size:20px;cursor:pointer;padding:8px;border-radius:50%;transition:all 0.3s ease;width:40px;height:40px;display:flex;align-items:center;justify-content:center;" title="Toggle Theme"><i class="fas fa-moon"></i></button><button id="closeReading" style="background:none;border:none;font-size:22px;cursor:pointer;padding:8px;border-radius:50%;transition:all 0.3s ease;width:40px;height:40px;display:flex;align-items:center;justify-content:center;" title="Close Reading Mode"><i class="fas fa-times"></i></button></div></div><div id="readingContent" style="max-width:min(800px,calc(100vw - 40px));margin:0 auto;padding:30px 20px 60px;line-height:1.8;font-size:18px;word-wrap:break-word;"></div>';
  let
    S = console.log,
    L = console.error,
    F = console.warn;
  
  function splitTextIntoChunks(text,
    maxLength = 200) {
    if (!text || text
      .length === 0) return [];
    text = text.replace(/\s+/g, ' ')
      .trim();
    let sentences = text
      .match(
        /[^.!?]+[.!?]+|[^.!?]+$/g) || [
        text
      ],
      chunks = [],
      currentChunk = '';
    for (let
        sentence of
        sentences) {
      sentence = sentence
        .trim();
      if (!sentence)
        continue;
      if ((currentChunk + ' ' +
          sentence).length <=
        maxLength) {
        currentChunk =
          currentChunk ? (currentChunk +
            ' ' + sentence) :
          sentence
      } else {
        if (
          currentChunk) chunks.push(
          currentChunk);
        if (sentence
          .length > maxLength) {
          let
            words = sentence.split(' '),
            tempChunk = '';
          for (let
              word of words) {
            if ((
                tempChunk + ' ' + word)
              .length <= maxLength
            ) {
              tempChunk =
                tempChunk ? (tempChunk +
                  ' ' + word) :
                word
            } else {
              if (
                tempChunk) chunks.push(
                tempChunk);
              tempChunk = word
            }
          }
          if (
            tempChunk) currentChunk =
            tempChunk
        } else {
          currentChunk
            = sentence
        }
      }
    }
    if (
      currentChunk) chunks.push(
      currentChunk);
    return chunks
  }
  
  function speakTextQueue() {
    if (
      currentSpeechIndex >= speechQueue
      .length) {
      isSpeechPlaying = !1,
        p = !1, currentSpeechIndex = 0,
        speechQueue = [], document
        .getElementById('speakButton')
        .innerHTML =
        '<i class="fas fa-headphones"></i>',
        z("Reading Complete",
          "Finished reading all content",
          3e3);
      return
    }
    if (!
      isSpeechPlaying) return;
    let
      chunk = speechQueue[
        currentSpeechIndex],
      utterance =
      new SpeechSynthesisUtterance(
        chunk);
    utterance.rate = .9, utterance
      .pitch = 1, utterance.volume = .8,
      utterance.onend = () => {
        if (!
          isSpeechPlaying) return;
        currentSpeechIndex++,
        speakTextQueue()
      }, utterance
      .onerror = (err) => {
        console
          .error('Speech error:', err),
          currentSpeechIndex++,
          speakTextQueue()
      },
      speechSynthesis.speak(utterance)
  }
  
  function stopSpeech() {
    isSpeechPlaying
      = !1, p = !1, speechSynthesis
      .cancel(), currentSpeechIndex = 0,
      speechQueue = [], document
      .getElementById('speakButton')
      .innerHTML =
      '<i class="fas fa-headphones"></i>',
      z("Speech Stopped",
        "Text-to-speech has been stopped",
        3e3)
  }
  
  function I() {
    let t = document
      .getElementById("readingHeader"),
      e = document.getElementById(
        "readingContent"),
      o = document.getElementById(
        "readingThemeToggle"),
      a = document.getElementById(
        "closeReading"),
      i = document.getElementById(
        "speakButton"),
      r = document.getElementById(
        "pngButton"),
      n = document.getElementById(
        "readingPageTitle");
    t && e && o && a && n && (d ? (C
      .style.background = "#1a1a1a",
      t.style.background =
      "#0a0a0a", t.style
      .borderBottom =
      "1px solid #333333", e.style
      .background = "#1a1a1a", e
      .style.color = "#ffffff", n
      .style.color = "#BB86FC", a
      .style.color = "#BB86FC", o
      .style.color = "#BB86FC", i
      .style.color = "#BB86FC", r
      .style.color = "#BB86FC", o
      .innerHTML =
      '<i class="fas fa-sun"></i>'
    ) : (C.style.background =
      "#f4f1ea", t.style
      .background = "#ebebeb", t
      .style.borderBottom =
      "1px solid #d6d3ca", e.style
      .background = "#f4f1ea", e
      .style.color = "#242424", n
      .style.color = "#667c6a", a
      .style.color = "#667c6a", o
      .style.color = "#667c6a", i
      .style.color = "#667c6a", r
      .style.color = "#667c6a", o
      .innerHTML =
      '<i class="fas fa-moon"></i>'
    ))
  }
  
  function j(t, e) {
    if (!t) return;
    let
      o = document.getElementById(
        "readingModeStyles") || document
      .createElement("style");
    o.id = "readingModeStyles", e ? o
      .textContent =
      "#readingContent *{color:#ffffff !important;}#readingContent h1,#readingContent h2,#readingContent h3{color:#BB86FC !important;margin-top:30px !important;margin-bottom:15px !important;}#readingContent p{margin-bottom:20px !important;line-height:1.8 !important;}#readingContent a{color:#BB86FC !important;text-decoration:underline !important;}#readingContent pre{background:#0a0a0a !important;border:1px solid #333333 !important;border-radius:8px !important;padding:20px !important;overflow:auto !important;color:#ffffff !important;}#readingContent code{background:#0a0a0a !important;color:#ffffff !important;padding:2px 6px !important;border-radius:4px !important;border:1px solid #333333 !important;}#readingContent table{background:#2a2a2a !important;border:1px solid #333333 !important;border-radius:8px !important;width:100% !important;border-collapse:separate !important;border-spacing:0 !important;margin:15px 0 !important;display:table !important;}#readingContent th{background:#0a0a0a !important;color:#BB86FC !important;padding:12px !important;border:1px solid #333333 !important;font-weight:bold !important;}#readingContent td{color:#ffffff !important;padding:12px !important;border:1px solid #333333 !important;}#readingContent img{max-width:100% !important;height:auto !important;border-radius:8px !important;margin:10px 0 !important;display:block !important;}#readingContent iframe{width:100% !important;border-radius:8px !important;border:1px solid #333333 !important;margin:15px 0 !important;display:block !important;}#readingContent .formula-block-iframe{background:#0a0a0a !important;border:1px solid #BB86FC !important;color:#ffffff !important;padding:15px !important;border-radius:8px !important;margin:15px 0 !important;display:block !important;}#readingContent .qa-block{background:#0a0a0a !important;border:1px solid #BB86FC !important;color:#ffffff !important;padding:15px !important;border-radius:8px !important;margin:15px 0 !important;display:block !important;}#readingContent ul,#readingContent ol{margin:15px 0 !important;padding-left:30px !important;}#readingContent li{color:#ffffff !important;margin-bottom:8px !important;}" :
      o.textContent =
      "#readingContent *{color:#242424 !important;}#readingContent h1,#readingContent h2,#readingContent h3{color:#667c6a !important;margin-top:30px !important;margin-bottom:15px !important;}#readingContent p{margin-bottom:20px !important;line-height:1.8 !important;}#readingContent a{color:#667c6a !important;text-decoration:underline !important;}#readingContent pre{background:#ffffff !important;border:1px solid #d6d3ca !important;border-radius:8px !important;padding:20px !important;overflow:auto !important;color:#242424 !important;}#readingContent code{background:#ffffff !important;color:#242424 !important;padding:2px 6px !important;border-radius:4px !important;border:1px solid #d6d3ca !important;}#readingContent table{background:#ffffff !important;border:1px solid #d6d3ca !important;border-radius:8px !important;width:100% !important;border-collapse:separate !important;border-spacing:0 !important;margin:15px 0 !important;display:table !important;}#readingContent th{background:#ebebeb !important;color:#667c6a !important;padding:12px !important;border:1px solid #d6d3ca !important;font-weight:bold !important;}#readingContent td{color:#242424 !important;padding:12px !important;border:1px solid #d6d3ca !important;}#readingContent img{max-width:100% !important;height:auto !important;border-radius:8px !important;margin:10px 0 !important;display:block !important;}#readingContent iframe{width:100% !important;border-radius:8px !important;border:1px solid #d6d3ca !important;margin:15px 0 !important;display:block !important;}#readingContent .formula-block-iframe{background:#ffffff !important;border:1px solid #667c6a !important;color:#242424 !important;padding:15px !important;border-radius:8px !important;margin:15px 0 !important;display:block !important;}#readingContent .qa-block{background:#ffffff !important;border:1px solid #667c6a !important;color:#242424 !important;padding:15px !important;border-radius:8px !important;margin:15px 0 !important;display:block !important;}#readingContent ul,#readingContent ol{margin:15px 0 !important;padding-left:30px !important;}#readingContent li{color:#242424 !important;margin-bottom:8px !important;}",
      document.head.appendChild(o)
  }
  
  function H() {
    if (!c) {
      z(
        "PNG Generator",
        "Loading library, please wait...",
        3e3), v(), setTimeout(H,
        3e3);
      return
    }
    let t = document
      .getElementById(
        "readingContent");
    if (!t || !
      window.html2canvas) {
      z(
        "PNG Error",
        "Unable to capture PNG. Please try again.",
        4e3);
      return
    }
    let e = t
      .cloneNode(!0);
    e.querySelectorAll("iframe")
      .forEach(t => {
        let e = document
          .createElement("div");
        e.style.cssText =
          `width:${t.offsetWidth||100}px;height:${t.offsetHeight||300}px;background:linear-gradient(135deg, #f0f0f0, #e0e0e0);border:2px dashed #ccc;display:flex;align-items:center;justify-content:center;color:#666;font-size:14px;text-align:center;margin:${t.style.margin||"15px 0"};border-radius:8px;`,
          e.innerHTML =
          `<div><i class="fas fa-external-link-alt" style="font-size:24px; margin-bottom:10px;"></i><br>Interactive Content<br><small>${t.src?new URL(t.src).hostname:"External Content"}</small></div>`,
          t.parentNode.replaceChild(e,
            t)
      }), e.querySelectorAll(
        "img").forEach(
        t => {
          "anonymous" !== t
            .crossOrigin && (t
              .crossOrigin = "anonymous"
            )
        }), e.style.position =
      "absolute", e.style.left =
      "-9999px", e.style.top = "0",
      document.body.appendChild(e);
    let
      o = document.getElementById(
        "pngButton"),
      a = o.innerHTML;
    o.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i>',
      window.html2canvas(
        e, {
          backgroundColor: d ?
            "#1a1a1a" : "#f4f1ea",
          useCORS: !0,
          allowTaint: !1,
          scale: 2,
          width: t
            .scrollWidth,
          height: t
            .scrollHeight,
          onclone(
            t) {
            let e = t.getElementById(
              "readingContent");
            e && j(e, d)
          }
        }).then(
        t => {
          t.toBlob(t => {
              let e =
                URL.createObjectURL(
                  t),
                i = document
                .createElement("a");
              i.href = e, i.download =
                "reading-mode-" + Date
                .now() + ".png",
                document.body
                .appendChild(i), i
                .click(), i.remove(),
                URL.revokeObjectURL(
                  e), o.innerHTML = a,
                z("PNG Saved",
                  "Reading mode content saved successfully!",
                  4e3)
            }), document.body
            .removeChild(e)
        }).catch(
        t => {
          console.error(
              "PNG capture error:", t),
            z("PNG Error",
              "Error capturing PNG. Some content may be restricted.",
              5e3), o.innerHTML = a,
            document.body.removeChild(
              e)
        })
  }
  
  function M() {
    let t = window
      .innerWidth <= 768,
      e = window.innerWidth <= 1024 &&
      window.innerWidth > 768;
    if (
      t) {
      E.style.width = "95vw", E
        .style.padding = "20px", E.style
        .margin = "10px", k.style
        .width = "45px", k.style
        .height = "45px", k.style
        .fontSize = "18px", C.style
        .fontSize = "16px", w.style
        .maxWidth = "280px", w.style
        .width = "85%";
      let o = document
        .getElementById(
          "readingContent"),
        a = document.getElementById(
          "readingHeader");
      o && (o.style.padding =
        "20px 15px 50px", o.style
        .fontSize = "16px", o.style
        .lineHeight = "1.7"), a && (a
        .style.padding = "0 15px", a
        .querySelector("h1").style
        .fontSize = "18px", a
        .querySelector("div").style
        .gap = "8px")
    } else if (e) {
      E
        .style.width = "85vw", E.style
        .padding = "25px", k.style
        .width = "48px", k.style
        .height = "48px", k.style
        .fontSize = "19px", w.style
        .maxWidth = "300px";
      let i =
        document.getElementById(
          "readingContent");
      i && (i.style.padding =
        "25px 18px 55px", i.style
        .fontSize = "17px")
    } else {
      E
        .style.width = "500px", E.style
        .padding = "25px", k.style
        .width = "50px", k.style
        .height = "50px", k.style
        .fontSize = "20px", w.style
        .maxWidth = "320px";
      let r =
        document.getElementById(
          "readingContent");
      r && (r.style.padding =
        "30px 20px 60px", r.style
        .fontSize = "18px")
    }
  }
  
  function A() {
    k.style.transform =
      "translateY(-50%) translateX(25px)",
      k.style.borderRadius =
      "25px 0 0 25px", k.style
      .boxShadow =
      "0 2px 8px rgba(187,134,252,0.2)"
  }
  
  function P() {
    clearTimeout(n), k
      .style.transform =
      "translateY(-50%) translateX(0)",
      k.style.borderRadius = "50%", k
      .style.boxShadow =
      "0 4px 15px rgba(187,134,252,0.4)",
      n = setTimeout(A, 8e3)
  }
  
  function R() {
    e = !1, B.style
      .opacity = "0", k.style
      .pointerEvents = "auto",
      setTimeout(() => {
          B.style
            .display = "none", document
            .body.style.overflow = ""
        },
        400)
  }
  
  function N() {
    stopSpeech(), s = !1, C
      .style.opacity = "0";
    let t =
      document.getElementById(
        "readingModeStyles");
    t && t.remove(), setTimeout(
      () => {
        C.style.display = "none",
          document.body.style
          .overflow = "", z(
            "Reading Mode",
            "Reading mode deactivated",
            2e3)
      }, 400)
  }
  
  function D() {
    document
      .documentElement.style.fontSize =
      o + "px";
    let t = document
      .getElementById("fontDisplay");
    t && (t.textContent = o + "px")
  }
  
  function q(t) {
    document.body
      .classList.remove("light-theme",
        "reading-comfort", "custom"
      );
    let e = document
      .getElementById("themeStyles") ||
      document.createElement("style");
    e.id = "themeStyles", "light" ===
      t ? (document.body.classList.add(
          "light-theme"), e
        .textContent =
        ".light-theme{background:#ffffff!important;color:#1a1a1a!important;}.light-theme .preview-header-iframe{background:#f8f9fa!important;color:#1a1a1a!important;box-shadow:0 2px 10px rgba(0,0,0,0.1)!important;}.light-theme .preview-sidebar-iframe{background:#f1f3f4!important;border-right:2px solid #e0e0e0!important;}.light-theme .mobile-sidebar-iframe{background:#f1f3f4!important;}.light-theme .sidebar-page-item-iframe{color:#333333!important;}.light-theme .sidebar-page-item-iframe:hover{background:#e8f0fe!important;color:#1976d2!important;}.light-theme .sidebar-page-item-iframe.active{background:#1976d2!important;color:#ffffff!important;}.light-theme .main-content-iframe{background:#ffffff!important;color:#1a1a1a!important;}.light-theme h1,.light-theme h2,.light-theme h3{color:#1976d2!important;}.light-theme .arvia-text-iframe{color:#1976d2!important;}.light-theme .menu-button-iframe{color:#1976d2!important;}.light-theme .pagination-button-iframe{background:#1976d2!important;color:#ffffff!important;}.light-theme .pagination-button-iframe:hover:not(:disabled){background:#1565c0!important;}.light-theme .scroll-to-top-btn-iframe{background:#1976d2!important;color:#ffffff!important;}.light-theme .external-link-iframe{color:#1976d2!important;}.light-theme .external-link-iframe:hover{background:#1976d2!important;color:#ffffff!important;}.light-theme pre{background:#f5f5f5!important;border:1px solid #e0e0e0!important;}.light-theme th{background:#f1f3f4!important;color:#1976d2!important;}.light-theme td{border:1px solid #e0e0e0!important;}.light-theme .copy-code-btn-iframe{background:#1976d2!important;color:#ffffff!important;}.light-theme .formula-block-iframe{background:#f8f9fa!important;border:1px solid #1976d2!important;}.light-theme .qa-block{background:#f8f9fa!important;border:1px solid #1976d2!important;}"
      ) : "reading-comfort" === t ? (
        document.body.classList.add(
          "reading-comfort"), e
        .textContent =
        ".reading-comfort{background:#f4f1ea!important;color:#242424!important;}.reading-comfort .preview-header-iframe{background:#ebebeb!important;color:#242424!important;}.reading-comfort .preview-sidebar-iframe{background:#ebebeb!important;border-right:2px solid #d6d3ca!important;}.reading-comfort .mobile-sidebar-iframe{background:#ebebeb!important;}.reading-comfort .sidebar-page-item-iframe{color:#242424!important;}.reading-comfort .sidebar-page-item-iframe:hover{background:#e6e4dd!important;color:#667c6a!important;}.reading-comfort .sidebar-page-item-iframe.active{background:#667c6a!important;color:#ffffff!important;}.reading-comfort .main-content-iframe{background:#f4f1ea!important;color:#242424!important;}.reading-comfort h1,.reading-comfort h2,.reading-comfort h3{color:#667c6a!important;}.reading-comfort .arvia-text-iframe{color:#667c6a!important;}.reading-comfort .menu-button-iframe{color:#667c6a!important;}.reading-comfort .pagination-button-iframe{background:#a9b7a5!important;color:#ffffff!important;}.reading-comfort .pagination-button-iframe:hover:not(:disabled){background:#667c6a!important;}.reading-comfort .scroll-to-top-btn-iframe{background:#a9b7a5!important;color:#ffffff!important;}.reading-comfort .external-link-iframe{color:#667c6a!important;}.reading-comfort .external-link-iframe:hover{background:#667c6a!important;color:#ffffff!important;}.reading-comfort pre{background:#ffffff!important;border:1px solid #d6d3ca!important;}.reading-comfort th{background:#ebebeb!important;color:#667c6a!important;}.reading-comfort td{border:1px solid #d6d3ca!important;}.reading-comfort .copy-code-btn-iframe{background:#a9b7a5!important;color:#ffffff!important;}.reading-comfort .formula-block-iframe{background:#ffffff!important;border:1px solid #667c6a!important;}.reading-comfort .qa-block{background:#ffffff!important;border:1px solid #667c6a!important;}"
      ) : "custom" === t ? (document
        .body.classList.add("custom"),
        W()) : e.textContent = "",
      document.head.appendChild(e)
  }
  
  function W() {
    let t = document
      .getElementById(
        "customThemeStyles") || document
      .createElement("style");
    t.id = "customThemeStyles", t
      .textContent =
      `.custom{background:${x.background}!important;color:${x.text}!important;}.custom .preview-header-iframe{background:${x.headerBg}!important;color:${x.text}!important;}.custom .preview-sidebar-iframe{background:${x.sidebarBg}!important;border-right:2px solid ${x.border}!important;}.custom .mobile-sidebar-iframe{background:${x.sidebarBg}!important;}.custom .sidebar-page-item-iframe{color:${x.text}!important;}.custom .sidebar-page-item-iframe:hover{background:${x.hoverBg}!important;color:${x.accent}!important;}.custom .sidebar-page-item-iframe.active{background:${x.activeBg}!important;color:${x.background}!important;}.custom .main-content-iframe{background:${x.background}!important;color:${x.text}!important;}.custom h1,.custom h2,.custom h3{color:${x.accent}!important;}.custom .arvia-text-iframe{color:${x.accent}!important;}.custom .pagination-button-iframe{background:${x.buttonBg}!important;}.custom .scroll-to-top-btn-iframe{background:${x.buttonBg}!important;}.custom a{color:${x.linkColor}!important;}.custom .external-link-iframe{color:${x.linkColor}!important;}.custom .external-link-iframe:hover{background:${x.linkColor}!important;}.custom pre{background:${x.cardBg}!important;}.custom th{background:${x.cardBg}!important;color:${x.accent}!important;}.custom td{border-color:${x.border}!important;}.custom .copy-code-btn-iframe{background:${x.buttonBg}!important;}.custom .formula-block-iframe,.custom .qa-block{background:${x.cardBg}!important;border-color:${x.accent}!important;}`,
      document.head.appendChild(t)
  }
  
  function Y(t) {
    document
      .querySelectorAll("img, iframe")
      .forEach(e => {
        t ? e
          .hasAttribute("loading") ||
          e.setAttribute("loading",
            "lazy") : e
          .removeAttribute(
            "loading")
      })
  }
  
  function O(t) {
    document
      .documentElement.style
      .scrollBehavior = t ? "smooth" :
      "auto";
    let e = document
      .getElementById(
        "smoothScrollStyles") ||
      document.createElement("style");
    e.id = "smoothScrollStyles", e
      .textContent = t ?
      "*{scroll-behavior:smooth!important;}" :
      "*{scroll-behavior:auto!important;}",
      document.head.appendChild(
        e)
  }
  console.log = function(...
      t) {
      S.apply(console, t), z(
        "Console Log", t.join(" "),
        4e3)
    }, console.error =
    function(...t) {
      L.apply(console,
        t), z("Console Error", t.join(
        " "), 6e3)
    }, console.warn =
    function(...t) {
      F.apply(console,
        t), z("Console Warning", t
        .join(
          " "), 5e3)
    }, B.appendChild(
      E), document.body.appendChild(k),
    document.body.appendChild(w),
    document.body.appendChild(B),
    document.body.appendChild(C);
  let X,
    G = (t = W, function e(...o) {
      let
        a = () => {
          clearTimeout(X),
            t(...o)
        };
      clearTimeout(X), X = setTimeout(
        a, 100)
    });
  
  function U(t, e, o) {
    let a = document
      .getElementById(t);
    a && a.addEventListener("change",
      t => {
        window[e] = t.target
          .checked;
        let a = t.target
          .nextElementSibling
          ?.children[0];
        a && (a.style.transform = t
          .target.checked ?
          "translateX(24px)" :
          "translateX(0)", a.style
          .background = t.target
          .checked ? "#BB86FC" :
          "#555"), o && o(t.target
          .checked)
      })
  }
  k
    .addEventListener("click",
      function t() {
        e = !0, B.style
          .display = "flex",
          requestAnimationFrame(() => B
            .style.opacity = "1"),
          document.body.style.overflow =
          "hidden", k.style
          .pointerEvents = "none", M()
      }
    ), k.addEventListener(
      "mouseenter", P), k
    .addEventListener("mouseleave",
      () => n = setTimeout(A, 2e3)),
    document.addEventListener(
      "mousemove", P), document
    .addEventListener("scroll",
      P, { passive: !0 }), document
    .getElementById("closeOverlay")
    ?.addEventListener("click", R),
    document.getElementById(
      "closeReading")?.addEventListener(
      "click", N), document
    .getElementById("readingModeBtn")
    ?.addEventListener("click",
      function t() {
        y.forEach(t =>
          removeAd(t));
        let e = document
          .getElementById(
            "actualPageContentIframe"
          ) || document.querySelector(
            "main") || document.body,
          o = document.querySelector(
            ".arvia-text-iframe")
          ?.textContent || document
          .title || "Reading Mode";
        if (
          !e) return;
        let a = e
          .cloneNode(!0);
        a.querySelectorAll(
          '[id^="ad-"]').forEach(t =>
          t.remove());
        let i = document
          .getElementById(
            "readingPageTitle"),
          r = document.getElementById(
            "readingContent");
        i && (i.textContent = o), r && (
            r.innerHTML = "", r
            .appendChild(a)), j(r, d),
          I(), s = !0, C.style.display =
          "block",
          requestAnimationFrame(() => C
            .style.opacity = "1"),
          document.body.style.overflow =
          "hidden", R(), M(), v(), z(
            "Reading Mode",
            "Distraction-free reading mode activated",
            3e3)
      }), document
    .getElementById("speakButton")
    ?.addEventListener("click",
      function t() {
        if (!(
            "speechSynthesis" in window
          )) {
          z("Speech Error",
            "Text-to-speech not supported in this browser",
            4e3);
          return
        }
        let e =
          document.getElementById(
            "readingContent");
        if (!e)
          return;
        if (isSpeechPlaying ||
          p) {
          stopSpeech
            ();
          return
        }
        let o = e
          .textContent || "";
        if (0 ===
          o.length) {
          z("No Content",
            "No text content found to read",
            3e3);
          return
        }
        speechQueue =
          splitTextIntoChunks(o, 200),
          currentSpeechIndex = 0,
          isSpeechPlaying = !0, p = !0,
          document.getElementById(
            "speakButton").innerHTML =
          '<i class="fas fa-stop"></i>',
          z("Reading Started",
            `Reading ${speechQueue.length} segments. Click again to stop.`,
            4e3), speakTextQueue()
      }),
    document.getElementById("pngButton")
    ?.addEventListener("click", H),
    document.getElementById(
      "readingThemeToggle")
    ?.addEventListener("click",
      () => {
        d = !d, I(), j(document
          .getElementById(
            "readingContent"), d)
      }), [
      "readingModeBtn", "closeOverlay",
      "closeReading",
      "readingThemeToggle",
      "speakButton", "pngButton"
    ].forEach(t => {
      let e = document
        .getElementById(t);
      e?.addEventListener(
          "mouseenter", e => {
            let o =
              "readingModeBtn" === t ?
              "#a9b7a5" : d ?
              "rgba(187,134,252,0.2)" :
              "rgba(102,124,106,0.2)";
            e.target.style
              .background = o, e
              .target.style
              .transform =
              "scale(1.1)"
          }), e
        ?.addEventListener(
          "mouseleave", t => {
            t
              .target.style
              .background = "none", t
              .target.style
              .transform =
              "scale(1)"
          })
    }), B
    .addEventListener("click", t => {
      t
        .target === B && R()
    }), C
    .addEventListener("click", t => {
      t
        .target === C && N()
    }),
    document.getElementById(
      "increaseFont")?.addEventListener(
      "click", () => {
        o < 28 && (o++,
          D())
      }), document
    .getElementById("decreaseFont")
    ?.addEventListener("click",
      () => { o > 10 && (o--, D()) }), [
      "increaseFont", "decreaseFont"
    ].forEach(t => {
      let e = document
        .getElementById(t);
      e?.addEventListener(
          "mouseenter", () => {
            e
              .style.background =
              "#BB86FC", e.style
              .color = "#000", e.style
              .transform =
              "scale(1.05)"
          }), e
        ?.addEventListener(
          "mouseleave", () => {
            e
              .style.background =
              "transparent", e.style
              .color = "#BB86FC", e
              .style.transform =
              "scale(1)"
          })
    }), document
    .getElementById("themeSelect")
    ?.addEventListener("change",
      t => {
        l = t.target.value;
        let e =
          document.getElementById(
            "customThemePanel"
          );
        "custom" === l ? e && (e
            .style.display = "block", e
            .style.animation =
            "slideDown 0.3s ease") :
          e && (e.style.display =
            "none"), q(l), z(
            "Theme Changed",
            `Applied ${l} theme`, 3e3
          )
      }), ["bgColor",
      "textColor", "accentColor",
      "secondaryColor", "borderColor",
      "cardBgColor"
    ].forEach(t => {
      let e = document
        .getElementById(t);
      e && (e.addEventListener(
          "change", e => {
            let
              o = {
                bgColor: "background",
                textColor: "text",
                accentColor: "accent",
                secondaryColor: "secondary",
                borderColor: "border",
                cardBgColor: "cardBg"
              };
            x[o[t]] = e.target
              .value, "custom" ===
              l && G()
          }), e
        .addEventListener(
          "mouseenter", () => {
            e
              .style.transform =
              "scale(1.1)", e.style
              .boxShadow =
              "0 0 15px rgba(187,134,252,0.6)"
          }
        ), e.addEventListener(
          "mouseleave", () => {
            e
              .style.transform =
              "scale(1)", e.style
              .boxShadow = "none"
          })
      )
    }), U("notificationsToggle",
      "notificationsEnabled", t => {
        z(
          "Notifications", t ?
          "Notifications enabled" :
          "Notifications disabled",
          3e3)
      }), U("adsToggle",
      "adsEnabled", t => {
        t ? (T(), z(
          "Ads Enabled",
          "Promotional content will be shown periodically",
          4e3)) : (y.forEach(t =>
          removeAd(t)), z(
          "Ads Disabled",
          "All ads have been removed",
          3e3))
      }), U(
      "smoothScrollToggle",
      "isSmoothScrolling", O), U(
      "lazyLoadToggle", "isLazyLoading",
      Y), U("contrastToggle",
      "isHighContrast", t => {
        document
          .body.style.filter = t ?
          "contrast(150%) brightness(120%)" :
          ""
      }), U("focusToggle", "",
      t => {
        let e = document
          .getElementById(
            "focusStyles") || document
          .createElement("style");
        e.id = "focusStyles", e
          .textContent = t ?
          ".focus-highlight *:focus{outline:3px solid #FFD700!important;outline-offset:3px!important;box-shadow:0 0 10px rgba(255,215,0,0.5)!important;}" :
          "", document.head.appendChild(
            e), document.body.classList
          .toggle("focus-highlight",
            t)
      }), document
    .getElementById("resetAll")
    ?.addEventListener("click",
      () => {
        o = 16, l = "default", i = !
          0, r = !0, a = !1, d = !0,
          g = !0, $ = !0,
          x = {
            background: "#1a1a1a",
            text: "#ffffff",
            accent: "#BB86FC",
            secondary: "#9C27B0",
            border: "#333333",
            cardBg: "#2a2a2a",
            headerBg: "#0a0a0a",
            sidebarBg: "#0a0a0a",
            buttonBg: "#BB86FC",
            linkColor: "#BB86FC",
            hoverBg: "#2a2a2a",
            activeBg: "#BB86FC",
            shadowColor: "rgba(187,134,252,0.4)"
          },
          D(), q("default"), O(!0), Y(!
            0), y.forEach(t => removeAd(
            t)), stopSpeech();
        let t =
          document.getElementById(
            "themeSelect"),
          e = document.getElementById(
            "customThemePanel");
        t && (t.value = "default"), e &&
          (e.style.display = "none"), [
            "smoothScrollToggle",
            "lazyLoadToggle",
            "notificationsToggle",
            "adsToggle"
          ].forEach(t => {
            let e =
              document.getElementById(
                t);
            if (!e) return;
            e.checked = !0;
            let o = e
              .nextElementSibling
              ?.children[0];
            o && (o.style.transform =
              "translateX(24px)", o
              .style.background =
              "#BB86FC")
          }), [
            "contrastToggle",
            "focusToggle"
          ].forEach(t => {
            let e =
              document.getElementById(
                t);
            if (!e) return;
            e.checked = !1;
            let o = e
              .nextElementSibling
              ?.children[0];
            o && (o.style.transform =
              "translateX(0)", o
              .style.background =
              "#555")
          });
        let
          n = {
            bgColor: "#1a1a1a",
            textColor: "#ffffff",
            accentColor: "#BB86FC",
            secondaryColor: "#9C27B0",
            borderColor: "#333333",
            cardBgColor: "#2a2a2a"
          };
        Object.keys(n).forEach(
            t => {
              let e = document
                .getElementById(t);
              e && (e.value = n[t])
            }),
          document.body.style.filter =
          "", document.body.classList
          .remove("focus-highlight",
            "light-theme",
            "reading-comfort", "custom"
          );
        let s = document
          .getElementById("resetAll");
        s && (s.style.transform =
            "scale(0.95)", setTimeout(
              () => {
                s.style.transform =
                  "scale(1)"
              }, 150)),
          z("Settings Reset",
            "All accessibility settings have been reset to defaults",
            4e3), R()
      }), document
    .getElementById("resetAll")
    ?.addEventListener("mouseenter",
      t => {
        t.target.style.transform =
          "scale(1.05)", t.target.style
          .boxShadow =
          "0 6px 20px rgba(187,134,252,0.5)"
      }
    ), document.getElementById(
      "resetAll")?.addEventListener(
      "mouseleave", t => {
        t.target
          .style.transform = "scale(1)",
          t.target.style.boxShadow =
          "0 4px 15px rgba(187,134,252,0.3)"
      }
    ), document.addEventListener(
      "keydown", t => {
        if ("Escape" ===
          t.key && (e || s) && (s ?
            N() : R()), "Tab" === t
          .key &&
          e) {
          let o = B
            .querySelectorAll(
              "button, input, select"),
            a = o[0],
            i = o[o.length - 1];
          t.shiftKey ? document
            .activeElement === a && (t
              .preventDefault(), i
              .focus()) : document
            .activeElement === i && (t
              .preventDefault(), a
              .focus())
        }
      });
  let K;
  window.addEventListener("resize",
    () => {
      clearTimeout(K), K =
        setTimeout(M,
          150)
    }, { passive: !0 });
  let
    V = new IntersectionObserver(
      t => {
        t.forEach(t => {
          t
            .isIntersecting && (t
              .target.style
              .transform =
              "translateY(0)", t
              .target.style
              .opacity = "1"
            )
        })
      }, { threshold: .1 });
  E.querySelectorAll(
    'div[style*="background:rgba(187,134,252,0.1)"]'
  ).forEach(t => {
    t.style
      .transform =
      "translateY(20px)", t.style
      .opacity = "0", t.style
      .transition =
      "all 0.4s cubic-bezier(0.4,0,0.2,1)",
      V.observe(t)
  });
  let J = window
    .matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
  
  function Q(t) {
    let e = t.matches ?
      "none" :
      "all 0.4s cubic-bezier(0.4,0,0.2,1)";
    [k, B, E, C].forEach(t => {
      t && (t
        .style.transition = e)
    })
  }
  J
    .addListener(Q), Q(J),
    "serviceWorker" in navigator &&
    navigator.serviceWorker.register(
      "/sw.js").catch(() => {});
  let Z =
    document.createElement("style");
  Z.textContent =
    '@keyframes slideDown{from{opacity:0;transform:translateY(-20px);}to{opacity:1;transform:translateY(0);}}@keyframes pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.05);}}@media(max-width:768px){#customThemePanel div[style*="display:flex"]{flex-wrap:wrap;justify-content:center;gap:10px;}#customThemePanel div[style*="text-align:center"]{margin-bottom:10px;}#readingHeader{height:60px;}#readingHeader h1{font-size:16px;}#readingHeader div{gap:6px;}#readingHeader button{width:36px;height:36px;font-size:16px;}}@media(max-width:480px){#customThemePanel div[style*="display:flex"]{gap:8px;}#customThemePanel input[type="color"]{width:35px;height:35px;}}@media(prefers-color-scheme:dark){:root{color-scheme:dark;}}@media(prefers-color-scheme:light){:root{color-scheme:light;}}',
    document.head.appendChild(Z), P(),
    M(), setTimeout(() => {
      z(
        "Accessibility Loaded",
        "Welcome! All accessibility features are now active",
        4e3)
    }, 1e3), setTimeout(
      () => {
        u.forEach((t,
          e) => {
          setTimeout(() => z(t
              .title, t.message, t
              .duration, t.url),
            2e3 * e)
        })
      }, 3e3), T()
}();
!function(){function a(e){var t=e&&e.parentNode&&e.parentNode.querySelector("span>span");t&&(t.style.transform=e.checked?"translateX(24px)":"translateX(0)")}function n(){try{document.querySelectorAll('[id^="ad-"]').forEach(function(e){e.remove()})}catch(e){}}var o=!0,i=new MutationObserver(function(e){o||e.forEach(function(e){e.addedNodes&&e.addedNodes.forEach(function(e){1===e.nodeType&&e.id&&0===e.id.indexOf("ad-")&&e.remove()})})});i.observe(document.documentElement,{childList:!0,subtree:!0}),document.addEventListener("change",function(e){var t=e.target;if(t&&"INPUT"===t.tagName&&"checkbox"===t.type){if("adsToggle"===t.id)o=t.checked,a(t),t.checked||n();if("notificationsToggle"===t.id){a(t);try{t.checked||document.getElementById("notificationContainer")?.querySelectorAll('div[id^="notif-"]').forEach(function(e){e.remove()})}catch(e){}}}}),document.addEventListener("DOMContentLoaded",function(){var e=document.getElementById("adsToggle");e&&(o=!!e.checked,a(e),o||n());var t=document.getElementById("notificationsToggle");t&&(a(t),t.checked||document.getElementById("notificationContainer")?.querySelectorAll('div[id^="notif-"]').forEach(function(e){e.remove()}))})}();
