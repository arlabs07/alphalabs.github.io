(function() { if (window
    .analyzerOverlayLoaded) return;
  window.analyzerOverlayLoaded =
  true; const RAF =
    requestAnimationFrame,
    debounce = (fn, ms) => { let
        timeout; return (...
      args) => { clearTimeout(
          timeout);
        timeout = setTimeout(() =>
          fn.apply(this, args), ms
          ) } },
    throttle = (fn, ms) => { let
        lastRun = 0; return (...
        args) => { if (Date.now() -
            lastRun >= ms) { fn.apply(
              this, args);
            lastRun = Date
          .now() } } }; let
    speechVoicesLoaded = false; let
    availableVoices = [];
  
  function initializeSpeechSynthesis() { try { if (
        'speechSynthesis' in window
        ) { const loadVoices =
      () => { availableVoices =
            speechSynthesis
            .getVoices(); if (
            availableVoices.length >
            0) { speechVoicesLoaded
              = true;
            console.log(
              'Speech voices loaded:',
              availableVoices
              .length) } };
        loadVoices(); if (!
          speechVoicesLoaded
          ) { speechSynthesis
            .addEventListener(
              'voiceschanged',
              loadVoices) } if (!
          speechVoicesLoaded) { let
            attempts = 0; const
            checkVoices =
          () => { availableVoices =
                speechSynthesis
                .getVoices(); if (
                availableVoices
                .length > 0 ||
                attempts >= 10
                ) { speechVoicesLoaded
                  =
                  true; return } attempts++;
              setTimeout(checkVoices,
                200) };
          checkVoices() } } } catch (
      e) { console.warn(
        'Speech synthesis initialization error:',
        e) } }
  
  function injectCDN() { if (!document
      .querySelector(
        'script[src*="tailwindcss"]')
      ) { const script = document
        .createElement('script');
      script.src =
        'https://cdn.tailwindcss.com';
      script.loading = 'async';
      document.head.appendChild(
        script) } if (!document
      .querySelector(
        'link[href*="font-awesome"]')
      ) { const link = document
        .createElement('link');
      link.rel = 'stylesheet';
      link.href =
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(
      link) } } injectCDN(); let
    settings = { doubleClickEnabled: true,
      singleClickEnabled: false,
      mediaOverlayEnabled: true,
      mediaIconEnabled: true }; const
    savedSettings = localStorage
    .getItem('analyzerSettings'); if (
    savedSettings) { try { settings
      = { ...settings, ...JSON
        .parse(
        savedSettings) } } catch (
    e) { console.warn(
        'Settings parse error:', e
        ) } }
  
  function saveSettings() { try { localStorage
        .setItem('analyzerSettings',
          JSON.stringify(settings)
          ) } catch (e) { console
        .warn('Settings save error:',
          e) } } const isDesktop =
    window.innerWidth >= 1024; const
    languages = { en: 'en', hi: 'hi',
      es: 'es', fr: 'fr', de: 'de',
      it: 'it', pt: 'pt', ru: 'ru',
      ja: 'ja', ko: 'ko', zh: 'zh',
      ar: 'ar' }; const
    languageNames = { en: 'English',
      hi: 'हिंदी', es: 'Español',
      fr: 'Français', de: 'Deutsch',
      it: 'Italiano', pt: 'Português',
      ru: 'Русский', ja: '日本语',
      ko: '한국어', zh: '中文',
      ar: 'العربية' }; let
    currentLanguage = 'en'; const
    prefersReducedMotion = window
    .matchMedia(
      '(prefers-reduced-motion: reduce)'
      ).matches; let
    currentMediaItems = []; let
    currentMediaIndex = 0; let
    uniqueMediaSources = new Set();
  
  function speakWord(word, lang =
    'en') { try { if (
        'speechSynthesis' in window
        ) { speechSynthesis
      .cancel(); const utterance =
          new SpeechSynthesisUtterance(
            word); if (
          speechVoicesLoaded &&
          availableVoices.length > 0
          ) { const voice =
            availableVoices.find(v =>
              v.lang.startsWith(lang)
              ) || availableVoices
            .find(v => v.lang
              .startsWith('en')) ||
            availableVoices[0]; if (
            voice) utterance.voice =
            voice } utterance.lang =
          lang + '-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        speechSynthesis.speak(
          utterance) } } catch (
    e) { console.warn(
        'Speech synthesis error:', e
        ) } }
  
  function createCustomVideoPlayer(
    src, title = '') { const
      container = document
      .createElement('div');
    container.className =
      'custom-media-player';
    container.innerHTML =
      `<div class="media-display"><video class="media-element" src="${src}" preload="metadata"></video></div><div class="media-controls"><button class="control-btn play-pause" title="Play/Pause"><i class="fas fa-play"></i></button><div class="seek-container"><div class="seek-bar"><div class="seek-progress"></div><div class="seek-handle"></div></div><span class="time-display">0:00 / 0:00</span></div><div class="volume-container"><button class="control-btn volume-btn" title="Volume"><i class="fas fa-volume-up"></i></button><div class="volume-bar"><div class="volume-progress"></div><div class="volume-handle"></div></div></div><button class="control-btn fullscreen-btn" title="Maximize"><i class="fas fa-expand"></i></button></div>`; return container }
  
  function createCustomAudioPlayer(
    src, title = '') { const
      container = document
      .createElement('div');
    container.className =
      'custom-media-player audio-player';
    container.innerHTML =
      `<div class="media-display audio-display"><div class="music-icon-container"><i class="fas fa-music music-icon"></i><div class="music-title">${title||'Audio Player'}</div></div></div><div class="media-controls"><button class="control-btn play-pause" title="Play/Pause"><i class="fas fa-play"></i></button><div class="seek-container"><div class="seek-bar"><div class="seek-progress"></div><div class="seek-handle"></div></div><span class="time-display">0:00 / 0:00</span></div><div class="volume-container"><button class="control-btn volume-btn" title="Volume"><i class="fas fa-volume-up"></i></button><div class="volume-bar"><div class="volume-progress"></div><div class="volume-handle"></div></div></div><button class="control-btn fullscreen-btn" title="Maximize"><i class="fas fa-expand"></i></button></div><audio class="media-element" src="${src}" preload="metadata"></audio>`; return container } const
    styles =
    `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}*{font-family:'Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;scroll-behavior:${prefersReducedMotion?'auto':'smooth'};${prefersReducedMotion?'':'transition:color 0.3s cubic-bezier(0.4,0,0.2,1),background-color 0.3s cubic-bezier(0.4,0,0.2,1),border-color 0.3s cubic-bezier(0.4,0,0.2,1),transform 0.3s cubic-bezier(0.4,0,0.2,1),opacity 0.3s cubic-bezier(0.4,0,0.2,1),box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)'}}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important;scroll-behavior:auto!important}}#analyzer-floating-btn{position:fixed;right:0;top:50%;transform:translateY(-50%);width:60px;height:60px;background:linear-gradient(135deg,#000 0%,#8b5cf6 100%);border:none;border-radius:30px 0 0 30px;box-shadow:0 8px 25px rgba(139,92,246,0.4);cursor:pointer;z-index:999998;display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;outline:none;will-change:transform;contain:layout style paint}#analyzer-floating-btn:hover{transform:translateY(-50%) scale(1.05);box-shadow:0 12px 35px rgba(139,92,246,0.6)}#analyzer-floating-btn:focus-visible{outline:2px solid #8b5cf6;outline-offset:2px}#analyzer-floating-btn:active{transform:translateY(-50%) scale(0.98)}#analyzer-floating-btn.minimized{width:16px;height:32px;font-size:0;opacity:0.7;border-radius:50% 0 0 50%/100% 0 0 100%}#analyzer-floating-btn.minimized:hover{opacity:1;transform:translateY(-50%) scale(1.1)}#analyzer-progress{position:fixed;bottom:0;left:0;width:100%;height:3px;background:rgba(0,0,0,0.1);z-index:999997;backdrop-filter:blur(10px)}#progress-bar{height:100%;background:linear-gradient(90deg,#8b5cf6,#a855f7);width:0%;border-radius:0 2px 2px 0;will-change:width}#analyzer-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.87);backdrop-filter:blur(15px);z-index:999999;display:none;opacity:0;will-change:opacity;contain:strict}#analyzer-overlay.show{opacity:1}#analyzer-container{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.95);width:90%;max-width:700px;height:78vh;max-height:580px;background:linear-gradient(145deg,#0f0f23 0%,#1a1a2e 100%);border:1px solid rgba(139,92,246,0.3);border-radius:18px;box-shadow:0 25px 70px rgba(139,92,246,0.15);overflow:hidden;color:#fff;will-change:transform;contain:layout style paint}#analyzer-overlay.show #analyzer-container{transform:translate(-50%,-50%) scale(1)}#media-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.95);backdrop-filter:blur(20px);z-index:1000000;display:none;opacity:0;will-change:opacity;contain:strict}#media-overlay.show{opacity:1}#media-overlay-container{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:95vw;height:95vh;max-width:1200px;max-height:800px;display:flex;flex-direction:column;align-items:center;justify-content:center}#media-overlay-content{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center}#media-overlay-close{position:absolute;top:20px;right:20px;width:50px;height:50px;background:rgba(255,255,255,0.1);border:2px solid rgba(255,255,255,0.2);border-radius:50%;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;z-index:10;outline:none}#media-overlay-close:hover{background:rgba(255,255,255,0.2);transform:scale(1.1)}.media-nav-btn{position:absolute;top:50%;width:60px;height:60px;background:rgba(0,0,0,0.7);border:2px solid rgba(255,255,255,0.3);border-radius:50%;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:20px;z-index:10;outline:none;backdrop-filter:blur(10px)}.media-nav-btn:hover{background:rgba(0,0,0,0.8);transform:scale(1.1);border-color:rgba(139,92,246,0.5)}.media-nav-btn:active{transform:scale(0.95);animation:ripple 0.3s ease}#media-nav-prev{left:20px;transform:translateY(-50%)}#media-nav-next{right:20px;transform:translateY(-50%)}@keyframes ripple{0%{box-shadow:0 0 0 0 rgba(139,92,246,0.7)}70%{box-shadow:0 0 0 10px rgba(139,92,246,0)}100%{box-shadow:0 0 0 0 rgba(139,92,246,0)}}.media-expand-icon{position:absolute;top:8px;right:8px;width:28px;height:28px;background:rgba(0,0,0,0.8);border:none;border-radius:50%;color:#fff;cursor:pointer;display:none;align-items:center;justify-content:center;font-size:12px;z-index:999;backdrop-filter:blur(10px);opacity:0.8}.media-expand-icon:hover{opacity:1;transform:scale(1.1);background:rgba(0,0,0,0.9)}.media-container{position:relative}.media-container:hover .media-expand-icon{display:flex}.custom-media-player{width:100%;max-width:800px;background:linear-gradient(145deg,#1a1a2e 0%,#2d2d44 100%);border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.4)}.media-display{position:relative;width:100%;background:#000;display:flex;align-items:center;justify-content:center;min-height:200px}.media-display video{width:100%;height:100%;object-fit:contain}.audio-display{background:linear-gradient(135deg,#1a1a2e 0%,#2d2d44 100%);min-height:300px;flex-direction:column}.music-icon-container{display:flex;flex-direction:column;align-items:center;gap:20px}.music-icon{font-size:80px;color:#8b5cf6}.music-icon.playing{${prefersReducedMotion?'':'animation:musicBounce 0.8s ease-in-out infinite'}}.music-title{color:#fff;font-size:20px;font-weight:600;text-align:center;margin-top:10px}@keyframes musicBounce{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-10px) scale(1.05)}}.media-controls{display:flex;align-items:center;gap:15px;padding:15px 20px;background:rgba(0,0,0,0.9);backdrop-filter:blur(10px)}.control-btn{background:rgba(139,92,246,0.2);border:1px solid rgba(139,92,246,0.4);border-radius:8px;color:#fff;cursor:pointer;padding:10px;font-size:16px;outline:none;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center}.control-btn:hover{background:rgba(139,92,246,0.3);transform:scale(1.05)}.control-btn:active{transform:scale(0.95)}.seek-container{flex:1;display:flex;align-items:center;gap:15px}.seek-bar{position:relative;flex:1;height:6px;background:rgba(255,255,255,0.2);border-radius:3px;cursor:pointer}.seek-progress{height:100%;background:linear-gradient(90deg,#8b5cf6,#a855f7);border-radius:3px;width:0%;position:relative}.seek-handle{position:absolute;right:-8px;top:50%;transform:translateY(-50%);width:16px;height:16px;background:#fff;border-radius:50%;cursor:grab;box-shadow:0 2px 8px rgba(0,0,0,0.3)}.seek-handle:active{cursor:grabbing;transform:translateY(-50%) scale(1.2)}.time-display{color:rgba(255,255,255,0.8);font-size:13px;font-weight:500;min-width:80px;text-align:center}.volume-container{display:flex;align-items:center;gap:10px}.volume-bar{width:80px;height:4px;background:rgba(255,255,255,0.2);border-radius:2px;cursor:pointer;position:relative}.volume-progress{height:100%;background:linear-gradient(90deg,#8b5cf6,#a855f7);border-radius:2px;width:100%;position:relative}.volume-handle{position:absolute;right:-6px;top:50%;transform:translateY(-50%);width:12px;height:12px;background:#fff;border-radius:50%;cursor:grab;box-shadow:0 1px 4px rgba(0,0,0,0.3)}.volume-handle:active{cursor:grabbing;transform:translateY(-50%) scale(1.3)}#analyzer-header{background:linear-gradient(135deg,#1e1e3f 0%,#2a2a4a 100%);padding:20px 22px;border-bottom:1px solid rgba(139,92,246,0.2);display:flex;align-items:center;gap:10px;flex-wrap:wrap;contain:layout style}#analyzer-input{flex:1;min-width:150px;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.3);border-radius:12px;padding:14px 18px 14px 52px;color:#fff;font-size:15px;outline:none;font-weight:400;line-height:1.4}#analyzer-input::placeholder{color:rgba(255,255,255,0.45)}#analyzer-input:focus{border-color:#8b5cf6;box-shadow:0 0 0 4px rgba(139,92,246,0.15);background:rgba(139,92,246,0.12)}#input-icon{position:absolute;left:22px;top:50%;transform:translateY(-50%);color:#8b5cf6;font-size:16px;pointer-events:none;z-index:1}#language-select{background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.3);border-radius:8px;padding:8px 10px;color:#fff;font-size:12px;outline:none;min-width:65px;font-weight:500;cursor:pointer}#language-select:focus{border-color:#8b5cf6;box-shadow:0 0 0 3px rgba(139,92,246,0.15)}#language-label{color:rgba(255,255,255,0.65);font-size:11px;margin-right:5px;font-weight:500}#close-btn{width:38px;height:38px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);border-radius:10px;color:#ef4444;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;outline:none;flex-shrink:0}#close-btn:hover{background:rgba(239,68,68,0.18);transform:scale(1.05)}#close-btn:focus-visible{outline:2px solid #ef4444;outline-offset:2px}#close-btn:active{transform:scale(0.95)}#analyzer-nav{display:flex;background:rgba(16,16,35,0.7);border-bottom:1px solid rgba(139,92,246,0.15);position:relative;contain:layout style}#analyzer-nav::before{content:'';position:absolute;bottom:0;left:0;width:50%;height:4px;background:linear-gradient(90deg,#8b5cf6,#a855f7);border-radius:3px 3px 0 0;will-change:transform}#analyzer-nav.page-info::before{transform:translateX(0%)}#analyzer-nav.settings::before{transform:translateX(100%)}#analyzer-nav.dictionary::before{transform:translateX(0%)}#analyzer-nav.wikipedia::before{transform:translateX(100%)}#analyzer-nav button{flex:1;background:none;border:none;padding:16px 18px;color:rgba(255,255,255,0.6);cursor:pointer;font-size:14px;font-weight:500;display:flex;align-items:center;justify-content:center;gap:7px;outline:none;position:relative}#analyzer-nav button:hover{color:#fff;background:rgba(139,92,246,0.1);transform:translateY(-1px)}#analyzer-nav button:focus-visible{outline:2px solid #8b5cf6;outline-offset:-2px}#analyzer-nav button:active{transform:translateY(1px)}#analyzer-nav button.active{color:#8b5cf6;background:rgba(139,92,246,0.12)}#analyzer-content{padding:25px;height:calc(100% - 135px);overflow-y:auto;background:rgba(10,10,25,0.4);color:#fff;scrollbar-width:thin;scrollbar-color:#8b5cf6 transparent;contain:layout style paint}#analyzer-content::-webkit-scrollbar{width:7px}#analyzer-content::-webkit-scrollbar-track{background:rgba(139,92,246,0.08);border-radius:4px}#analyzer-content::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#8b5cf6,#a855f7);border-radius:4px}#analyzer-content::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,#a855f7,#8b5cf6)}#default-message{text-align:center;color:rgba(255,255,255,0.55);font-size:17px;margin-top:60px}#default-message i{font-size:45px;color:#8b5cf6;margin-bottom:15px;display:block;${prefersReducedMotion?'':'animation:pulse 2.5s infinite'}}@keyframes pulse{0%,100%{opacity:0.6}50%{opacity:1}}.loading{display:flex;align-items:center;justify-content:center;gap:12px;color:#8b5cf6;font-size:16px;margin-top:60px}.spinner{width:22px;height:22px;border:3px solid rgba(139,92,246,0.2);border-top:3px solid #8b5cf6;border-radius:50%;${prefersReducedMotion?'':'animation:spin 1.2s linear infinite'}}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.dict-entry{margin-bottom:25px;padding:20px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.18);border-radius:15px;border-left:4px solid #8b5cf6;${prefersReducedMotion?'':'animation:slideIn 0.4s ease'};contain:layout style}.dict-entry:hover{background:rgba(139,92,246,0.08);border-color:rgba(139,92,246,0.3);${prefersReducedMotion?'':'transform:translateY(-3px)'};box-shadow:0 8px 20px rgba(139,92,246,0.12)}@keyframes slideIn{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:translateY(0)}}.word-title{font-size:22px;font-weight:700;color:#8b5cf6;margin-bottom:12px;line-height:1.2}.pronunciation{color:rgba(255,255,255,0.65);font-style:italic;font-size:14px;margin-bottom:15px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.speak-btn{background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);border-radius:6px;color:#8b5cf6;cursor:pointer;padding:4px 8px;font-size:12px;display:flex;align-items:center;gap:4px;outline:none;font-weight:500}.speak-btn:hover{background:rgba(139,92,246,0.25);transform:scale(1.05)}.speak-btn:focus-visible{outline:2px solid #8b5cf6}.speak-btn:active{transform:scale(0.95)}.meaning{margin-bottom:15px}.part-of-speech{color:#a855f7;font-weight:600;font-size:13px;text-transform:uppercase;margin-bottom:8px;padding:3px 10px;background:rgba(168,85,247,0.15);border-radius:5px;display:inline-block}.definition{color:#fff;line-height:1.6;margin-bottom:8px;font-size:15px}.example{color:rgba(255,255,255,0.7);font-style:italic;margin-left:20px;margin-top:6px;font-size:14px}.wiki-content{line-height:1.7;${prefersReducedMotion?'':'animation:slideIn 0.4s ease'}}.wiki-title{font-size:24px;font-weight:700;color:#8b5cf6;margin-bottom:18px;line-height:1.2}.wiki-image{max-width:100%;height:auto;border-radius:12px;margin:15px 0}.wiki-image:hover{${prefersReducedMotion?'':'transform:scale(1.03)'}}.wiki-extract{color:#fff;margin-bottom:18px;font-size:16px;line-height:1.7}.wiki-link{display:inline-flex;align-items:center;gap:8px;color:#8b5cf6;text-decoration:none;font-weight:600;padding:12px 20px;background:rgba(139,92,246,0.12);border:1px solid rgba(139,92,246,0.3);border-radius:10px;margin-top:15px;outline:none}.wiki-link:hover{background:rgba(139,92,246,0.18);${prefersReducedMotion?'':'transform:translateY(-2px)'};box-shadow:0 8px 20px rgba(139,92,246,0.15)}.wiki-link:focus-visible{outline:2px solid #8b5cf6}.error-message{color:#ef4444;text-align:center;margin-top:60px;font-size:16px;${prefersReducedMotion?'':'animation:slideIn 0.4s ease'}}.settings-panel,.page-info-panel{color:#fff;${prefersReducedMotion?'':'animation:slideIn 0.4s ease'}}.settings-item{display:flex;align-items:center;justify-content:space-between;padding:20px 0;border-bottom:1px solid rgba(139,92,246,0.15)}.settings-item:hover{background:rgba(139,92,246,0.03)}.settings-item:last-child{border-bottom:none}.settings-label{font-size:16px;font-weight:500;color:rgba(255,255,255,0.9)}.toggle-switch{position:relative;width:55px;height:30px;background:rgba(139,92,246,0.25);border-radius:15px;cursor:pointer;outline:none;contain:layout style}.toggle-switch:focus-visible{outline:2px solid #8b5cf6;outline-offset:2px}.toggle-switch.active{background:#8b5cf6}.toggle-switch::before{content:'';position:absolute;top:3px;left:3px;width:24px;height:24px;background:#fff;border-radius:50%;box-shadow:0 3px 6px rgba(0,0,0,0.15);will-change:transform}.toggle-switch.active::before{transform:translateX(25px)}.page-stat{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(139,92,246,0.15)}.page-stat:hover{background:rgba(139,92,246,0.03)}.page-stat:last-child{border-bottom:none}.stat-label{font-size:14px;color:rgba(255,255,255,0.75);font-weight:500}.stat-value{font-size:16px;font-weight:700;color:#8b5cf6}.translation-result{margin-top:18px;padding:15px;background:rgba(168,85,247,0.12);border:1px solid rgba(168,85,247,0.25);border-radius:10px}.translation-text{color:#a855f7;font-weight:600;margin-bottom:6px;font-size:16px}.translation-lang{color:rgba(255,255,255,0.65);font-size:13px}@media(min-width:1024px){#analyzer-floating-btn{width:75px;height:75px;font-size:24px}#analyzer-floating-btn.minimized{display:none}}@media(max-width:768px){#analyzer-floating-btn{width:55px;height:55px;font-size:19px;border-radius:28px 0 0 28px}#analyzer-floating-btn.minimized{width:15px;height:30px;border-radius:50% 0 0 50%/100% 0 0 100%}#analyzer-container{width:92%;height:70vh;max-height:480px}#analyzer-header{padding:14px 16px;gap:6px}#analyzer-input{min-width:120px;font-size:14px;padding:12px 16px 12px 44px}#input-icon{left:18px;font-size:14px}#language-select{font-size:11px;padding:6px 8px;min-width:55px}#language-label{font-size:10px}#close-btn{width:32px;height:32px;font-size:13px}#analyzer-nav button{padding:12px 10px;font-size:11px;gap:4px}#analyzer-content{padding:18px}#analyzer-content .dict-entry{padding:16px;margin-bottom:20px}#analyzer-content .page-stat{padding:10px 0}.pronunciation{flex-direction:column;align-items:flex-start;gap:8px}#media-overlay-close{width:40px;height:40px;top:15px;right:15px;font-size:16px}.media-nav-btn{width:50px;height:50px;font-size:18px}#media-nav-prev{left:15px}#media-nav-next{right:15px}.custom-media-player{margin:10px}.media-controls{padding:12px 15px;gap:12px}.control-btn{padding:8px;font-size:14px;min-width:40px;min-height:40px}.seek-container{gap:10px}.volume-container{gap:8px}.volume-bar{width:60px}.music-icon{font-size:60px}.music-title{font-size:18px}}@media(max-width:480px){#analyzer-container{width:94%;height:65vh;max-height:450px}#analyzer-header{padding:12px 14px;gap:4px}#analyzer-input{font-size:13px;padding:10px 14px 10px 40px}#input-icon{left:16px}#language-select{font-size:10px;padding:4px 6px}#analyzer-content{padding:16px}#analyzer-nav button{padding:10px 8px;font-size:10px}#media-overlay-close{width:35px;height:35px;font-size:14px}.media-nav-btn{width:45px;height:45px;font-size:16px}.media-controls{padding:10px 12px;gap:8px}.control-btn{padding:6px;font-size:12px;min-width:36px;min-height:36px}.volume-container{display:none}.time-display{font-size:12px;min-width:70px}.music-icon{font-size:50px}.music-title{font-size:16px}}@media screen and (orientation:landscape){#media-overlay-container{width:98vw;height:88vh}#media-overlay-content{max-height:90vh}.custom-media-player{max-width:95vw;max-height:85vh}.media-display{max-height:calc(85vh - 80px)}.audio-display{min-height:250px}.music-icon{font-size:70px}.media-controls{padding:10px 15px;gap:10px}.control-btn{min-width:38px;min-height:38px;padding:8px}.seek-container{gap:12px}.volume-container{gap:8px}.time-display{font-size:12px;min-width:75px}}@media screen and (orientation:landscape) and (max-width:768px){.custom-media-player{max-height:75vh}.media-display{max-height:calc(75vh - 70px)}.audio-display{min-height:200px}.music-icon{font-size:50px}.media-controls{padding:8px 12px;gap:8px}.control-btn{min-width:35px;min-height:35px;padding:6px;font-size:13px}.volume-bar{width:50px}.time-display{font-size:11px;min-width:65px}}`; let
    scrollElements = []; let
    searchTimeout; let searchCache =
    new Map(); let isAnimating =
  false; const maxCacheSize =
  100; const REPLACED_FLAG =
    'data-analyzer-replaced';
  
  function findScrollableElements() { scrollElements
      = []; try { const walker =
        document.createTreeWalker(
          document.body, NodeFilter
          .SHOW_ELEMENT, { acceptNode: node => { if (
                node.closest(
                  '#analyzer-overlay,#media-overlay'
                  ))
              return NodeFilter
                .FILTER_REJECT; const
                style =
                getComputedStyle(
                  node); return ((
                    style
                    .overflow ===
                    'scroll' ||
                    style
                    .overflow ===
                    'auto' || style
                    .overflowY ===
                    'scroll' ||
                    style
                    .overflowY ===
                    'auto') && node
                  .scrollHeight >
                  node.clientHeight
                  ) ? NodeFilter
                .FILTER_ACCEPT :
                NodeFilter
                .FILTER_SKIP } }); let
        node; while (node = walker
        .nextNode()) scrollElements
        .push(node) } catch (
    e) { console.warn(
        'Scroll element detection error:',
        e) } }
  
  function getMediaType(
  element) { const tagName = element
      .tagName.toLowerCase(); const
      src = element.src || element
      .getAttribute('data-src') ||
      ''; if (tagName === 'img' ||
      /\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i
      .test(src)) { if (/\.svg(\?|$)/i
        .test(src))
    return null; return 'image' } if (
      tagName === 'video' ||
      /\.(mp4|webm|ogg|avi|mov)(\?|$)/i
      .test(src)) return 'video'; if (
      tagName === 'audio' ||
      /\.(mp3|wav|ogg|aac|flac)(\?|$)/i
      .test(src)) return 'audio'; if (
      tagName === 'iframe') { if (src
        .includes(
        'youtube.com/embed') || src
        .includes('youtu.be') || src
        .includes(
          'youtube-nocookie.com'))
        return 'youtube'; return 'iframe' } return null }
  
  function preloadMediaMetadata(
    mediaElement) { try { if (!
        mediaElement || mediaElement
        .dataset.metadataLoaded)
        return;
      mediaElement.dataset
        .metadataLoaded = 'true';
      mediaElement.preload =
        'metadata'; if (mediaElement
        .readyState < 1
        ) { mediaElement
      .load() } const handleLoad =
      () => { mediaElement
            .removeEventListener(
              'loadedmetadata',
              handleLoad);
          mediaElement
            .removeEventListener(
              'canplay', handleLoad
              ) };
      mediaElement.addEventListener(
        'loadedmetadata', handleLoad
        );
      mediaElement.addEventListener(
        'canplay', handleLoad); if (
        mediaElement.readyState >= 1)
        handleLoad() } catch (
    e) { console.warn(
        'Preload error:', e) } }
  
  function collectUniqueMediaItems() { uniqueMediaSources
      .clear();
    currentMediaItems
  = []; try { const mediaElements =
        document.querySelectorAll(
          'img, video, audio, iframe, .custom-media-player'
          ); let globalIndex = 0;
      mediaElements.forEach(
      element => { let src =
        ''; let mediaType; if (
          element.classList
          .contains(
            'custom-media-player')
          ) { const video =
            element.querySelector(
              'video'); const
            audio = element
            .querySelector(
              'audio');
          src = video?.src ||
            audio?.src || '';
          mediaType = video ?
            'video' : audio ?
            'audio' : null; if (
            video)
            preloadMediaMetadata(
              video); if (audio)
            preloadMediaMetadata(
              audio) } else { src
            = element.src ||
            element.getAttribute(
              'data-src') || '';
          mediaType =
            getMediaType(
            element); if ((
              mediaType ===
              'video' ||
              mediaType ===
              'audio') && element
            .tagName
          .toLowerCase() ===
            mediaType
            ) { preloadMediaMetadata
              (element) } } if (
          mediaType && src && !
          uniqueMediaSources.has(
            src)
          ) { uniqueMediaSources
            .add(src);
          currentMediaItems
        .push({ element,
            type: mediaType,
            index: globalIndex });
          globalIndex++ } }) } catch (
      e) { console.warn(
        'Media collection error:', e
        ) } }
  
  function replaceNativeMediaPlayers() { try { const
        nativeElements = document
        .querySelectorAll(
          'video:not([' +
          REPLACED_FLAG +
          ']), audio:not([' +
          REPLACED_FLAG + '])');
      nativeElements.forEach(
        element => { if (element
            .hasAttribute(
              REPLACED_FLAG) ||
            element.closest(
              '.custom-media-player'
              )) return;
          element.setAttribute(
            REPLACED_FLAG, 'true'
            ); const src = element
            .src || element
            .querySelector('source')
            ?.src || ''; const
            title = element.title ||
            element.getAttribute(
              'aria-label') ||
            'Media'; const
            mediaType = element
            .tagName
          .toLowerCase(); let
            customPlayer; if (
            mediaType === 'video'
            ) { customPlayer =
              createCustomVideoPlayer(
                src, title
                ) } else if (
            mediaType === 'audio'
            ) { customPlayer =
              createCustomAudioPlayer(
                src, title) } if (
            customPlayer) { element
              .parentNode
              .replaceChild(
                customPlayer,
                element); const
              newMediaElement =
              customPlayer
              .querySelector(
                '.media-element');
            preloadMediaMetadata(
              newMediaElement);
            setupCustomPlayerEvents(
              customPlayer) } }
        ) } catch (e) { console.warn(
        'Media replacement error:',
        e) } }
  
  function setupMediaElements() { try { replaceNativeMediaPlayers
        ();
      collectUniqueMediaItems(); const
        mediaElements = document
        .querySelectorAll(
          'img, iframe, .custom-media-player'
          );
      mediaElements.forEach((element,
        globalIndex) => { if (
          element.dataset
          .analyzerMediaListener)
          return; let
        mediaType; if (element
          .classList.contains(
            'custom-media-player')
          ) { const video =
            element.querySelector(
              'video'); const
            audio = element
            .querySelector(
              'audio');
          mediaType = video ?
            'video' : audio ?
            'audio' :
            null } else { mediaType
            = getMediaType(
              element) } if (!
          mediaType) return;
        element.dataset
          .analyzerMediaListener =
          'true';
        element.dataset
          .mediaIndex =
          globalIndex; if (element
          .classList.contains(
            'custom-media-player')
          ) { if (settings
            .mediaOverlayEnabled
            ) { element.style
              .cursor =
              'pointer'; const
              clickHandler =
              function(e) { if (e
                  .target.closest(
                    '.media-controls,.control-btn'
                    )) { e
                    .stopImmediatePropagation(); return } e
                  .preventDefault();
                e
              .stopPropagation();
                currentMediaIndex
                  = parseInt(
                    element
                    .dataset
                    .mediaIndex
                    ) || 0; const
                  mediaElement =
                  element
                  .querySelector(
                    '.media-element'
                    );
                showMediaOverlay(
                  mediaElement,
                  mediaType) };
            element
              .removeEventListener(
                'click',
                clickHandler);
            element
              .addEventListener(
                'click',
                clickHandler, { passive: false }
                ) } } else { let
            container = element
            .closest(
              '.media-container'
              ); if (!
            container) { container
              = document
              .createElement(
                'div');
            container.className =
              'media-container';
            element.parentNode
              .insertBefore(
                container, element
                );
            container.appendChild(
              element) } if (!
            container
            .querySelector(
              '.media-expand-icon'
              )) { const
              expandIcon =
              document
              .createElement(
                'button');
            expandIcon.className =
              'media-expand-icon';
            expandIcon.innerHTML =
              '<i class="fas fa-expand" aria-hidden="true"></i>';
            expandIcon.title =
              'Open in overlay';
            container.appendChild(
              expandIcon);
            expandIcon
              .addEventListener(
                'click',
                function(e) { e
                    .preventDefault();
                  e
                .stopPropagation(); if (
                    settings
                    .mediaOverlayEnabled
                    ) { currentMediaIndex
                      = parseInt(
                        element
                        .dataset
                        .mediaIndex
                        ) || 0;
                    showMediaOverlay
                      (element,
                        mediaType
                        ) } }
                ); if (!settings
              .mediaIconEnabled)
              expandIcon.style
              .display =
              'none' } if (
            settings
            .mediaOverlayEnabled
            ) { element.style
              .cursor =
              'pointer'; const
              clickHandler =
              function(e) { if (e
                  .target.closest(
                    '.media-expand-icon'
                    )) return;
                e
              .preventDefault();
                e
              .stopPropagation();
                currentMediaIndex
                  = parseInt(
                    element
                    .dataset
                    .mediaIndex
                    ) || 0;
                showMediaOverlay(
                  element,
                  mediaType) };
            element
              .removeEventListener(
                'click',
                clickHandler);
            element
              .addEventListener(
                'click',
                clickHandler, { passive: false }
                ) } } }) } catch (
    e) { console.warn(
        'Media setup error:', e) } }
  
  function setupCustomPlayerEvents(
    player) { try { const
        mediaElement = player
        .querySelector(
          '.media-element'); const
        playPauseBtn = player
        .querySelector(
        '.play-pause'); const
        seekBar = player
        .querySelector(
        '.seek-bar'); const
        seekProgress = player
        .querySelector(
          '.seek-progress'); const
        seekHandle = player
        .querySelector(
        '.seek-handle'); const
        volumeBtn = player
        .querySelector(
        '.volume-btn'); const
        volumeBar = player
        .querySelector(
        '.volume-bar'); const
        volumeProgress = player
        .querySelector(
          '.volume-progress'); const
        volumeHandle = player
        .querySelector(
          '.volume-handle'); const
        timeDisplay = player
        .querySelector(
          '.time-display'); const
        fullscreenBtn = player
        .querySelector(
          '.fullscreen-btn'); const
        musicIcon = player
        .querySelector(
        '.music-icon'); let
        isDragging = false; let
        isVolumeDragging = false;
      
      function updateTime() { const
          currentTime = mediaElement
          .currentTime || 0; const
          duration = mediaElement
          .duration || 0; const
          progress = (currentTime /
            duration) * 100 || 0;
        seekProgress.style.width =
          progress + '%';
        timeDisplay.textContent =
          `${formatTime(currentTime)} / ${formatTime(duration)}` }
      
      function formatTime(
      seconds) { const mins = Math
          .floor(seconds / 60); const
          secs = Math.floor(seconds %
            60
            ); return `${mins}:${secs.toString().padStart(2,'0')}` }
      
      function updateMusicIconAnimation() { if (
          musicIcon) { const
            isPlaying = !mediaElement
            .paused && !mediaElement
            .ended && mediaElement
            .readyState > 2; if (
            isPlaying) { musicIcon
              .classList.add(
                'playing') } else { musicIcon
              .classList.remove(
                'playing'
                ) } } } playPauseBtn
        .addEventListener('click',
          e => { e
              .stopImmediatePropagation(); if (
              mediaElement.paused
              ) { mediaElement.play();
              playPauseBtn.innerHTML =
                '<i class="fas fa-pause"></i>' } else { mediaElement
                .pause();
              playPauseBtn.innerHTML =
                '<i class="fas fa-play"></i>' } updateMusicIconAnimation
              () });
      seekBar.addEventListener(
        'mousedown', e => { e
            .stopImmediatePropagation();
          isDragging = true; const
            rect = seekBar
            .getBoundingClientRect(); const
            percentage = (e
              .clientX - rect.left
              ) / rect.width;
          mediaElement.currentTime =
            (percentage *
              mediaElement.duration
              ) || 0 });
      document.addEventListener(
        'mousemove', e => { if (
            isDragging) { const
              rect = seekBar
              .getBoundingClientRect(); const
              percentage = Math.max(
                0, Math.min(1, (e
                    .clientX - rect
                    .left) / rect
                  .width));
            mediaElement
              .currentTime = (
                percentage *
                mediaElement
                .duration) ||
              0 } if (
            isVolumeDragging
            ) { const rect =
              volumeBar
              .getBoundingClientRect(); const
              percentage = Math.max(
                0, Math.min(1, (e
                    .clientX - rect
                    .left) / rect
                  .width));
            mediaElement.volume =
              percentage;
            volumeProgress.style
              .width = (percentage *
                100) + '%';
            volumeBtn.innerHTML =
              percentage === 0 ?
              '<i class="fas fa-volume-mute"></i>' :
              percentage < 0.5 ?
              '<i class="fas fa-volume-down"></i>' :
              '<i class="fas fa-volume-up"></i>' } }
        );
      document.addEventListener(
        'mouseup',
      () => { isDragging = false;
          isVolumeDragging = false }
        );
      volumeBar.addEventListener(
        'mousedown', e => { e
            .stopImmediatePropagation();
          isVolumeDragging =
          true; const rect =
            volumeBar
            .getBoundingClientRect(); const
            percentage = (e
              .clientX - rect.left
              ) / rect.width;
          mediaElement.volume = Math
            .max(0, Math.min(1,
              percentage));
          volumeProgress.style
            .width = (percentage *
              100) + '%' });
      volumeBtn.addEventListener(
        'click', e => { e
            .stopImmediatePropagation(); if (
            mediaElement.volume > 0
            ) { mediaElement.dataset
              .prevVolume =
              mediaElement.volume;
            mediaElement.volume = 0;
            volumeProgress.style
              .width = '0%';
            volumeBtn.innerHTML =
              '<i class="fas fa-volume-mute"></i>' } else { const
              prevVolume =
              parseFloat(
                mediaElement.dataset
                .prevVolume) || 0.5;
            mediaElement.volume =
              prevVolume;
            volumeProgress.style
              .width = (prevVolume *
                100) + '%';
            volumeBtn.innerHTML =
              prevVolume < 0.5 ?
              '<i class="fas fa-volume-down"></i>' :
              '<i class="fas fa-volume-up"></i>' } }
        );
      fullscreenBtn.addEventListener(
        'click', e => { e
            .stopImmediatePropagation();
          currentMediaIndex =
            currentMediaItems
            .findIndex(item => item
              .element
              .querySelector && item
              .element
              .querySelector(
                '.media-element')
              ?.src === mediaElement
              .src) || 0;
          showMediaOverlay(
            mediaElement,
            mediaElement.tagName
            .toLowerCase()) });
      mediaElement.addEventListener(
        'timeupdate',
      () => { updateTime();
          updateMusicIconAnimation
        () });
      mediaElement.addEventListener(
        'loadedmetadata', updateTime
        );
      mediaElement.addEventListener(
        'play',
        updateMusicIconAnimation);
      mediaElement.addEventListener(
        'pause',
        updateMusicIconAnimation);
      mediaElement.addEventListener(
        'ended',
      () => { playPauseBtn
            .innerHTML =
            '<i class="fas fa-play"></i>';
          updateMusicIconAnimation
        () }) } catch (e) { console
        .warn('Player events error:',
          e) } }
  
  function navigateMedia(
  direction) { try { if (
        currentMediaItems.length === 0
        ) return; if (direction ===
        'next') { currentMediaIndex =
          (currentMediaIndex + 1) %
          currentMediaItems
          .length } else { currentMediaIndex
          = currentMediaIndex <= 0 ?
          currentMediaItems.length -
          1 : currentMediaIndex -
          1 } const mediaItem =
        currentMediaItems[
          currentMediaIndex]; if (
        mediaItem) { showMediaOverlay(
          mediaItem.element,
          mediaItem.type, false
          ) } } catch (e) { console
        .warn(
          'Media navigation error:', e
          ) } }
  
  function showMediaOverlay(element,
    type, updateIndex = true
    ) { try { if (
        updateIndex) { currentMediaIndex
          = currentMediaItems
          .findIndex(item => item
            .element === element) ||
          0 } const mediaOverlayEl =
        document.getElementById(
          'media-overlay'); const
        mediaOverlayContent = document
        .getElementById(
          'media-overlay-content');
      mediaOverlayContent.innerHTML =
        ''; let content = ''; switch (
        type) {
        case 'image':
          const imgSrc = element
            .src || element
            .getAttribute(
            'data-src') || element
            .getAttribute(
              'data-lazy-src'); const
            altText = element.alt ||
            element.title || '';
          content =
            `<img src="${imgSrc}" alt="${altText}" style="max-width:100%;max-height:85vh;object-fit:contain;border-radius:12px;">`; break;
        case 'video':
          const videoSrc = element
            .src || element
            .querySelector('source')
            ?.src || ''; const
            videoTitle = element
            .title || 'Video';
          content =
            createCustomVideoPlayer(
              videoSrc, videoTitle)
            .outerHTML; break;
        case 'audio':
          const audioSrc = element
            .src || element
            .querySelector('source')
            ?.src || ''; const
            audioTitle = element
            .title || element
            .getAttribute(
              'aria-label') ||
            'Audio File';
          content =
            createCustomAudioPlayer(
              audioSrc, audioTitle)
            .outerHTML; break;
        case 'youtube':
        case 'iframe':
          const iframeSrc = element
            .src || ''; const
            iframeTitle = element
            .title ||
            'Embedded content'; const
            aspectRatio = element
            .width && element.height ?
            (element.height / element
              .width * 100) + '%' :
            '56.25%';
          content =
            `<div style="position:relative;width:100%;max-width:800px;padding-bottom:${aspectRatio};height:0;overflow:hidden;border-radius:12px;"><iframe src="${iframeSrc}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;border-radius:12px;" allowfullscreen></iframe></div>`; break } mediaOverlayContent
        .innerHTML = content; if (
        type === 'video' || type ===
        'audio') { const
          customPlayer =
          mediaOverlayContent
          .querySelector(
            '.custom-media-player'
            ); if (
          customPlayer) { const
            newMediaElement =
            customPlayer
            .querySelector(
              '.media-element');
          preloadMediaMetadata(
            newMediaElement);
          setupCustomPlayerEvents(
            customPlayer
            ) } } mediaOverlayEl.style
        .display = 'block';
      setTimeout(() => mediaOverlayEl
        .classList.add('show'), 10
        ); const elementSrc = element
        .src || element.getAttribute(
          'data-src') || 'Unknown';
      history.replaceState(null, null,
        location.href.split('#')[
        0] + '#mediaoverlay_' +
        encodeURIComponent(
          elementSrc));
      document.body.style.overflow =
        'hidden' } catch (e) { console
        .warn('Media overlay error:',
          e) } }
  
  function hideMediaOverlay() { try { const
        mediaOverlayEl = document
        .getElementById(
          'media-overlay');
      mediaOverlayEl.classList.remove(
        'show');
      document.body.style.overflow =
        '';
      setTimeout(
    () => { mediaOverlayEl.style
          .display = 'none'; const
          mediaOverlayContent =
          document.getElementById(
            'media-overlay-content'
            ); if (
          mediaOverlayContent)
          mediaOverlayContent
          .innerHTML = '' }, 300);
      history.replaceState(null, null,
        location.href.split('#')[0]
        ) } catch (e) { console.warn(
        'Hide media overlay error:',
        e) } } const deferredInit =
    debounce(() => { const
          styleSheet = document
          .createElement('style');
        styleSheet.textContent =
          styles;
        document.head.appendChild(
          styleSheet);
        findScrollableElements();
        setupMediaElements();
        initializeSpeechSynthesis() },
      50);
  setTimeout(deferredInit, 100); const
    floatingBtn = document
    .createElement('button');
  floatingBtn.id =
    'analyzer-floating-btn';
  floatingBtn.innerHTML =
    '<i class="fas fa-search" aria-hidden="true"></i>';
  floatingBtn.setAttribute(
    'aria-label',
    'Open Smart Page Analyzer');
  floatingBtn.setAttribute('role',
    'button');
  floatingBtn.setAttribute('tabindex',
    '0');
  document.body.appendChild(
    floatingBtn); const progressBar =
    document.createElement('div');
  progressBar.id =
  'analyzer-progress';
  progressBar.innerHTML =
    '<div id="progress-bar" role="progressbar" aria-label="Page scroll progress"></div>';
  progressBar.setAttribute(
    'aria-hidden', 'true');
  document.body.appendChild(
    progressBar); const overlay =
    document.createElement('div');
  overlay.id = 'analyzer-overlay';
  overlay.setAttribute('role',
    'dialog');
  overlay.setAttribute('aria-modal',
    'true');
  overlay.setAttribute(
    'aria-labelledby',
    'analyzer-title');
  overlay.innerHTML =
    `<div id="analyzer-container" role="main"><div id="analyzer-header"><div style="position:relative;flex:1;min-width:0"><i id="input-icon" class="fas fa-search" aria-hidden="true"></i><input type="text" id="analyzer-input" placeholder="Enter word to analyze..." aria-label="Search word or phrase" autocomplete="off" spellcheck="false" aria-describedby="search-help"></div><div style="display:flex;align-items:center;gap:6px;flex-shrink:0"><span id="language-label" aria-hidden="true">${isDesktop?'Lang:':''}${currentLanguage.toUpperCase()}</span><select id="language-select" aria-label="Select analysis language">${Object.entries(languageNames).map(([code,name])=>`<option value="${code}" ${code===currentLanguage?'selected':''}>${name}</option>`).join('')}</select></div><button id="close-btn" aria-label="Close analyzer" type="button"><i class="fas fa-times" aria-hidden="true"></i></button></div><nav id="analyzer-nav" role="tablist" aria-label="Analysis tools"><button class="nav-btn" data-type="page-info" role="tab" aria-selected="false" aria-controls="analyzer-content" id="tab-page-info"><i class="fas fa-chart-line" aria-hidden="true"></i><span>Page Info</span></button><button class="nav-btn" data-type="settings" role="tab" aria-selected="false" aria-controls="analyzer-content" id="tab-settings"><i class="fas fa-cog" aria-hidden="true"></i><span>Settings</span></button><button class="nav-btn" data-type="dictionary" role="tab" aria-selected="false" aria-controls="analyzer-content" id="tab-dictionary"><i class="fas fa-book" aria-hidden="true"></i><span>Dictionary</span></button><button class="nav-btn" data-type="wikipedia" role="tab" aria-selected="false" aria-controls="analyzer-content" id="tab-wikipedia"><i class="fab fa-wikipedia-w" aria-hidden="true"></i><span>Wikipedia</span></button></nav><div id="analyzer-content" role="tabpanel" aria-live="polite" aria-atomic="false"><div id="default-message"><i class="fas fa-mouse-pointer" aria-hidden="true"></i>Double-click any word or use the floating button<div id="search-help" style="font-size:12px;margin-top:10px;opacity:0.7;">Tip: Start typing to search dictionary and Wikipedia</div></div></div></div>`;
  document.body.appendChild(
  overlay); const mediaOverlay =
    document.createElement('div');
  mediaOverlay.id = 'media-overlay';
  mediaOverlay.innerHTML =
    `<div id="media-overlay-container"><button id="media-nav-prev" class="media-nav-btn" title="Previous media" aria-label="Previous media"><i class="fas fa-chevron-left" aria-hidden="true"></i></button><div id="media-overlay-content"></div><button id="media-nav-next" class="media-nav-btn" title="Next media" aria-label="Next media"><i class="fas fa-chevron-right" aria-hidden="true"></i></button></div><button id="media-overlay-close" aria-label="Close media overlay"><i class="fas fa-times" aria-hidden="true"></i></button>`;
  document.body.appendChild(
    mediaOverlay); let selectedWord =
    ''; let minimizeTimeout; let
    currentMode = 'default'; const
    input = document.getElementById(
      'analyzer-input'); const
    content = document.getElementById(
      'analyzer-content'); const
    navButtons = document
    .querySelectorAll(
    '.nav-btn'); const closeBtn =
    document.getElementById(
      'close-btn'); const nav =
    document.getElementById(
      'analyzer-nav'); const
    progressBarEl = document
    .getElementById(
    'progress-bar'); const
    languageSelect = document
    .getElementById(
    'language-select'); const
    languageLabel = document
    .getElementById(
    'language-label'); const
    mediaOverlayEl = document
    .getElementById(
    'media-overlay'); const
    mediaOverlayClose = document
    .getElementById(
      'media-overlay-close'); const
    mediaPrevBtn = document
    .getElementById(
    'media-nav-prev'); const
    mediaNextBtn = document
    .getElementById(
    'media-nav-next'); const
    updateProgress = throttle(
    () => { let totalProgress = 0; let
          maxProgress = 0; const
          windowProgress = window
          .pageYOffset / (Math.max(
            document.documentElement
            .scrollHeight - window
            .innerHeight, 1)); if (!
          isNaN(windowProgress) &&
          windowProgress >= 0
          ) { totalProgress +=
            windowProgress;
          maxProgress++ } scrollElements
          .forEach(el => { try { if (
                el.scrollHeight > el
                .clientHeight
                ) { const
                  elementProgress =
                  el.scrollTop / (el
                    .scrollHeight -
                    el.clientHeight
                    ); if (!isNaN(
                    elementProgress
                    ) &&
                  elementProgress >=
                  0) { totalProgress
                    +=
                    elementProgress;
                  maxProgress++ } } } catch (
              e) {} }); const
          finalProgress =
          maxProgress > 0 ? Math.min(
            100, Math.max(0, (
              totalProgress /
              maxProgress) * 100)) :
          0;
        progressBarEl.style.width =
          finalProgress + '%';
        progressBarEl.setAttribute(
          'aria-valuenow', Math
          .round(finalProgress)) },
      16);
  
  function minimizeButton() { if (
      isDesktop) return;
    floatingBtn.classList.add(
      'minimized');
    floatingBtn.innerHTML = '';
    floatingBtn.setAttribute(
      'aria-label',
      'Restore page analyzer') }
  
  function restoreButton() { if (
      isDesktop) return;
    floatingBtn.classList.remove(
      'minimized');
    floatingBtn.innerHTML =
      '<i class="fas fa-search" aria-hidden="true"></i>';
    floatingBtn.setAttribute(
      'aria-label',
      'Open page analyzer') } const
    startMinimizeTimer = debounce(
    () => { if (!isDesktop)
          minimizeButton() }, 5000);
  
  function resetMinimizeTimer() { if (
      isDesktop) return;
    restoreButton();
    startMinimizeTimer() }
  
  function updateLanguageLabel() { languageLabel
      .textContent =
      `${isDesktop?'Lang:':''}${currentLanguage.toUpperCase()}` }
  
  function updateURLFragment(type,
    word = '') { try { const baseUrl =
        location.href.split('#')[
        0]; let fragment =
      ''; switch (type) {
        case 'page-info':
          fragment =
          '#pageinfo'; break;
        case 'settings':
          fragment =
          '#settings'; break;
        case 'dictionary':
          fragment =
            '#searchwithdictionary'; break;
        case 'wikipedia':
          fragment =
          '#searchwithwiki'; break } if (
        word?.trim()) fragment +=
        '_' + encodeURIComponent(word
          .trim().toLowerCase());
      history.replaceState(null, null,
        baseUrl + fragment) } catch (
      e) { console.warn(
        'URL fragment error:', e) } }
  
  function parseURLFragment() { try { const
        fragment = location.hash
        .slice(1); if (!fragment)
        return { type: 'page-info',
          word: '' }; if (fragment
        .startsWith('mediaoverlay_')
        ) { return { type: 'media',
          url: decodeURIComponent(
            fragment.substring(13)
            ) } } const parts = fragment
        .split('_'); let type =
        'page-info'; if (parts[0] ===
        'pageinfo') type =
      'page-info';
      else if (parts[0] ===
        'settings') type = 'settings';
      else if (parts[0] ===
        'searchwithdictionary') type =
        'dictionary';
      else if (parts[0] ===
        'searchwithwiki') type =
        'wikipedia'; return { type,
        word: parts[1] ?
          decodeURIComponent(parts[
          1]) : '' } } catch (
    e) { return { type: 'page-info',
        word: '' } } } const
    performSearch = debounce(
  () => { const word = input.value
        .trim(); if (!word)
    return; const activeBtn =
        document.querySelector(
          '.nav-btn.active'); if (!
        activeBtn) return; const
        cacheKey =
        `${activeBtn.dataset.type}_${word}_${currentLanguage}`; if (
        searchCache.has(cacheKey)
        ) { content.innerHTML =
          searchCache.get(
          cacheKey); return } switch (
        activeBtn.dataset.type) {
        case 'dictionary':
          fetchDictionary(
          word); break;
        case 'wikipedia':
          fetchWikipedia(
          word); break } }, 300);
  
  function calculateAdvancedPageStats() { const
      overlayEls = document
      .querySelectorAll(
        '#analyzer-overlay,#media-overlay'
        ); const originalDisplays =
      Array.from(overlayEls).map(el =>
        el.style.display);
    overlayEls.forEach(el => el.style
      .display = 'none'); let
      pageText = ''; try { const
        textNodes = []; const walker =
        document.createTreeWalker(
          document.body, NodeFilter
          .SHOW_TEXT, { acceptNode: node => { const
                parent = node
                .parentNode; if (!
                parent || parent
                .closest(
                  '#analyzer-overlay,#media-overlay,#analyzer-floating-btn,#analyzer-progress'
                  ))
              return NodeFilter
                .FILTER_REJECT; if (
                ['SCRIPT', 'STYLE',
                  'NOSCRIPT', 'META'
                ].includes(parent
                  .tagName))
              return NodeFilter
                .FILTER_REJECT; const
                style =
                getComputedStyle(
                  parent); return (
                  style.display ===
                  'none' || style
                  .visibility ===
                  'hidden' || style
                  .opacity === '0'
                  ) ? NodeFilter
                .FILTER_REJECT :
                NodeFilter
                .FILTER_ACCEPT } }
          ); let node; while (node =
        walker.nextNode()) textNodes
        .push(node.textContent);
      pageText = textNodes.join(
      ' ') } catch (e) { pageText =
        document.body.innerText ||
        '' } overlayEls.forEach((el,
        i) => el.style.display =
      originalDisplays[i]); const
      words = pageText.trim().split(
        /\s+/).filter(w => w.length >
        0 && !/^[^\w]*$/.test(w))
      .length; const characters =
      pageText.replace(/\s+/g, ' ')
      .length; const sentences =
      pageText.split(/[.!?]+/).filter(
        s => s.trim().length > 0)
      .length; const paragraphs =
      pageText.split(/\n\s*\n/)
      .filter(p => p.trim().length >
        0).length; const links =
      document.querySelectorAll(
        'a[href]').length; const
      externalLinks = Array.from(
        document.querySelectorAll(
          'a[href]')).filter(a => a
        .href.includes('://') && !a
        .href.includes(location
          .hostname)).length; const
      images = document
      .querySelectorAll('img')
      .length; const videos = document
      .querySelectorAll(
        'video, .custom-media-player video'
        ).length; const forms =
      document.querySelectorAll(
        'form').length; const
      headings = document
      .querySelectorAll(
        'h1,h2,h3,h4,h5,h6')
      .length; const socialLinks =
      Array.from(document
        .querySelectorAll('a[href]'))
      .filter(a =>
        /(facebook|twitter|instagram|linkedin|youtube|tiktok|pinterest)/i
        .test(a.href)).length; const
      metaDescription = document
      .querySelector(
        'meta[name="description"]')
      ?.content ||
      'Not available'; const
      pageLanguage = document
      .documentElement.lang ||
      document.querySelector(
        'meta[http-equiv="content-language"]'
        )?.content ||
      'Not detected'; const pageSize =
      Math.round((document
        .documentElement.outerHTML
        .length / 1024) * 100) /
      100; const readingTime = Math
      .max(1, Math.ceil(words /
      225)); const writingTime = Math
      .max(1, Math.ceil(words /
      45)); return { words,
      characters, sentences,
      paragraphs, readingTime,
      writingTime, links,
      externalLinks, images, videos,
      forms, headings, socialLinks,
      metaDescription, pageLanguage,
      pageSize } }
  
  function showPageInfo() { const
      stats =
      calculateAdvancedPageStats();
    content.innerHTML =
      `<div class="page-info-panel"><h3 id="analyzer-title" style="color:#8b5cf6;font-size:20px;font-weight:700;margin-bottom:25px;display:flex;align-items:center;gap:10px;"><i class="fas fa-chart-line" aria-hidden="true"></i>Page Analytics</h3><div class="page-stat"><span class="stat-label">Total Words</span><span class="stat-value">${stats.words.toLocaleString()}</span></div><div class="page-stat"><span class="stat-label">Characters</span><span class="stat-value">${stats.characters.toLocaleString()}</span></div><div class="page-stat"><span class="stat-label">Sentences</span><span class="stat-value">${stats.sentences.toLocaleString()}</span></div><div class="page-stat"><span class="stat-label">Paragraphs</span><span class="stat-value">${stats.paragraphs.toLocaleString()}</span></div><div class="page-stat"><span class="stat-label">Headings</span><span class="stat-value">${stats.headings.toLocaleString()}</span></div><div class="page-stat"><span class="stat-label">Total Links</span><span class="stat-value">${stats.links.toLocaleString()}</span></div><div class="page-stat"><span class="stat-label">External Links</span><span class="stat-value">${stats.externalLinks.toLocaleString()}</span></div><div class="page-stat"><span class="stat-label">Images</span><span class="stat-value">${stats.images.toLocaleString()}</span></div><div class="page-stat"><span class="stat-label">Videos</span><span class="stat-value">${stats.videos.toLocaleString()}</span></div><div class="page-stat"><span class="stat-label">Forms</span><span class="stat-value">${stats.forms.toLocaleString()}</span></div><div class="page-stat"><span class="stat-label">Social Media Links</span><span class="stat-value">${stats.socialLinks.toLocaleString()}</span></div><div class="page-stat"><span class="stat-label">Reading Time</span><span class="stat-value">${stats.readingTime} min</span></div><div class="page-stat"><span class="stat-label">Writing Time</span><span class="stat-value">${stats.writingTime} min</span></div><div class="page-stat"><span class="stat-label">Page Size</span><span class="stat-value">${stats.pageSize} KB</span></div><div class="page-stat"><span class="stat-label">Page Language</span><span class="stat-value">${stats.pageLanguage}</span></div><div class="page-stat"><span class="stat-label">Page Title</span><span class="stat-value">${document.title||'Untitled'}</span></div><div class="page-stat"><span class="stat-label">Domain</span><span class="stat-value">${location.hostname}</span></div><div class="page-stat"><span class="stat-label">Meta Description</span><span class="stat-value" style="font-size:13px;line-height:1.4;max-width:300px;">${stats.metaDescription}</span></div></div>` }
  
  function showSettings() { content
      .innerHTML =
      `<div class="settings-panel"><h3 style="color:#8b5cf6;font-size:20px;font-weight:700;margin-bottom:25px;display:flex;align-items:center;gap:10px;"><i class="fas fa-cog" aria-hidden="true"></i>Settings</h3><div class="settings-item"><label class="settings-label" for="toggle-double-click">Double-click to Analyze</label><button class="toggle-switch ${settings.doubleClickEnabled?'active':''}" data-setting="doubleClickEnabled" id="toggle-double-click" type="button" role="switch" aria-checked="${settings.doubleClickEnabled}"></button></div><div class="settings-item"><label class="settings-label" for="toggle-single-click">Single-click to Analyze</label><button class="toggle-switch ${settings.singleClickEnabled?'active':''}" data-setting="singleClickEnabled" id="toggle-single-click" type="button" role="switch" aria-checked="${settings.singleClickEnabled}"></button></div><div class="settings-item"><label class="settings-label" for="toggle-media-overlay">Media Overlay</label><button class="toggle-switch ${settings.mediaOverlayEnabled?'active':''}" data-setting="mediaOverlayEnabled" id="toggle-media-overlay" type="button" role="switch" aria-checked="${settings.mediaOverlayEnabled}"></button></div><div class="settings-item"><label class="settings-label" for="toggle-media-icons">Media Icons</label><button class="toggle-switch ${settings.mediaIconEnabled?'active':''}" data-setting="mediaIconEnabled" id="toggle-media-icons" type="button" role="switch" aria-checked="${settings.mediaIconEnabled}"></button></div></div>`;
    document.querySelectorAll(
      '.toggle-switch').forEach(
      toggle => { toggle
          .addEventListener('click',
            function(e) { e
                .stopPropagation(); const
                setting = this
                .dataset
                .setting; const
                newValue = !
                settings[setting];
              settings[setting] =
                newValue;
              this.classList.toggle(
                'active', newValue
                );
              this.setAttribute(
                'aria-checked',
                newValue);
              saveSettings(); if (
                setting ===
                'mediaIconEnabled'
                ) { document
                  .querySelectorAll(
                    '.media-expand-icon'
                    ).forEach(
                    icon => { icon
                        .style
                        .display =
                        settings
                        .mediaIconEnabled ?
                        'flex' :
                        'none' }
                    ) } if (
                setting ===
                'mediaOverlayEnabled' ||
                setting ===
                'mediaIconEnabled'
                ) { setupMediaElements
                  () } });
        toggle.addEventListener(
          'keydown',
          function(e) { if (e
              .key === 'Enter' ||
              e.key === ' ') { e
                .preventDefault();
              this.click() } }) }) }
  
  function updateNavVisibility(
  mode) { navButtons.forEach(
    btn => { const isVisible =
        mode === 'default' ? (btn
          .dataset.type ===
          'page-info' || btn
          .dataset.type ===
          'settings') : (btn
          .dataset.type ===
          'dictionary' || btn
          .dataset.type ===
          'wikipedia');
      btn.style.display =
        isVisible ? 'flex' :
        'none';
      btn.style.opacity =
        isVisible ? '1' : '0';
      btn.setAttribute(
        'aria-hidden', !
        isVisible) }) }
  
  function showOverlay(word = '',
    type = 'page-info') { if (
      isAnimating) return;
    isAnimating = true;
    selectedWord = word;
    input.value = word;
    currentMode = word ? 'search' :
      'default';
    overlay.style.display = 'block';
    RAF(() => { overlay.classList.add(
        'show');
      isAnimating = false });
    navButtons.forEach(btn => { btn
        .classList.remove(
          'active');
      btn.setAttribute(
        'aria-selected', 'false'
        ) });
    updateNavVisibility(
    currentMode); const activeBtn =
      document.querySelector(
        `[data-type="${type}"]`); if (
      activeBtn && activeBtn.style
      .display !== 'none') { activeBtn
        .classList.add('active');
      activeBtn.setAttribute(
        'aria-selected', 'true');
      nav.className = 'analyzer-nav';
      nav.classList.add(type);
      updateURLFragment(type,
      word); switch (type) {
        case 'page-info':
          showPageInfo(); break;
        case 'settings':
          showSettings(); break;
        case 'dictionary':
          word ? fetchDictionary(
            word) : content
            .innerHTML =
            '<div id="default-message"><i class="fas fa-book" aria-hidden="true"></i>Enter a word to see dictionary results</div>'; break;
        case 'wikipedia':
          word ? fetchWikipedia(
            word) : content
            .innerHTML =
            '<div id="default-message"><i class="fab fa-wikipedia-w" aria-hidden="true"></i>Enter a word to see Wikipedia results</div>'; break } } else { const
        defaultBtn = currentMode ===
        'default' ? document
        .querySelector(
          '[data-type="page-info"]') :
        document.querySelector(
          '[data-type="dictionary"]'
          ); if (
        defaultBtn) { defaultBtn
          .classList.add('active');
        defaultBtn.setAttribute(
          'aria-selected', 'true');
        updateURLFragment(defaultBtn
          .dataset.type, word); if (
          defaultBtn.dataset.type ===
          'page-info') showPageInfo();
        else if (word)
          fetchDictionary(
          word) } } document.body
      .style.overflow = 'hidden';
    RAF(() => input.focus()) }
  
  function hideOverlay() { if (
      isAnimating) return;
    isAnimating = true;
    overlay.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => { overlay.style
        .display = 'none';
      isAnimating = false }, 300);
    history.replaceState(null, null,
      location.href.split('#')[0]) }
  
  function showLoading() { content
      .innerHTML =
      '<div class="loading"><div class="spinner" role="status" aria-label="Loading content"></div>Loading...</div>' }
  
  function showError(
  message) { content.innerHTML =
      `<div class="error-message" role="alert"><i class="fas fa-exclamation-triangle" aria-hidden="true"></i> ${message}</div>` } async function fetchTranslation(
    word, targetLang) { if (
      targetLang === 'en')
    return null; try { const
        controller =
        new AbortController();
      setTimeout(() => controller
        .abort(), 6000); const
        response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(word)}`, { signal: controller
              .signal }); if (!
        response.ok)
    return null; const data =
        await response
      .json(); return data?.[0]?.[0]
        ?.[0] || null } catch (
    e) { return null } } async function fetchDictionary(
    word) { showLoading
  (); try { const controller =
        new AbortController();
      setTimeout(() => controller
        .abort(), 8000); let
        html = ''; if (
        currentLanguage !== 'en'
        ) { const translation =
          await fetchTranslation(
            word, currentLanguage
            ); if (translation)
          html +=
          `<div class="dict-entry"><div class="word-title">${word}</div><div class="translation-result"><div class="translation-text">${translation}</div><div class="translation-lang">Translated to ${languageNames[currentLanguage]}</div></div></div>` } const
        response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, { signal: controller
              .signal }); if (
        response.ok) { const
          data = await response
          .json();
        data.forEach(
        entry => { html +=
            `<div class="dict-entry"><div class="word-title">${entry.word}</div>`; if (
            entry.phonetic)
            html +=
            `<div class="pronunciation"><span><i class="fas fa-volume-up" aria-hidden="true"></i> ${entry.phonetic}</span><button class="speak-btn" onclick="speakWord('${entry.word}','en')" type="button" title="Listen to pronunciation" aria-label="Play pronunciation of ${entry.word}"><i class="fas fa-play" aria-hidden="true"></i>Listen</button></div>`;
          entry.meanings
            .forEach(
              meaning => { html
                  +=
                  `<div class="meaning"><div class="part-of-speech">${meaning.partOfSpeech}</div>`;
                meaning
                  .definitions
                  .forEach(
                    def => { html
                        +=
                        `<div class="definition">• ${def.definition}</div>`; if (
                        def
                        .example
                        )
                        html +=
                        `<div class="example">"${def.example}"</div>` }
                    );
                html +=
                  '</div>' });
          html +=
          '</div>' }) } if (!html)
        html =
        '<div class="error-message" role="alert"><i class="fas fa-exclamation-triangle" aria-hidden="true"></i> Dictionary: Word not found</div>'; const
        cacheKey =
        `dictionary_${word}_${currentLanguage}`;
      searchCache.set(cacheKey,
        html); if (searchCache
        .size > maxCacheSize)
        searchCache.delete(
          searchCache.keys()
          .next().value);
      content.innerHTML = html;
      window.speakWord =
      speakWord } catch (
    error) { if (
        currentLanguage !== 'en'
        ) { try { const
            translation =
            await fetchTranslation(
              word,
              currentLanguage
              ); if (
            translation) { content
              .innerHTML =
              `<div class="dict-entry"><div class="word-title">${word}</div><div class="translation-result"><div class="translation-text">${translation}</div><div class="translation-lang">Translated to ${languageNames[currentLanguage]}</div></div></div>`; return } } catch (
          e) {} } showError(
        'Dictionary: Word not found or service unavailable'
        ) } } async function fetchWikipedia(
    word) { showLoading
  (); try { const controller =
        new AbortController();
      setTimeout(() =>
        controller.abort(),
        8000); const
        langPrefix =
        currentLanguage ===
        'en' ? 'en' :
        currentLanguage; let
        response = await fetch(
          `https://${langPrefix}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(word)}`, { signal: controller
              .signal }); let
        data; if (!response
        .ok) { const
          searchQuery =
          await fetch(
            `https://${langPrefix}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(word)}&origin=*`, { signal: controller
                .signal }
            ); const
          searchData =
          await searchQuery
          .json(); if (!
          searchData.query
          ?.search?.length)
          throw new Error(
            'Not found'); const
          firstResult =
          searchData.query
          .search[0].title;
        response = await fetch(
          `https://${langPrefix}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstResult)}`, { signal: controller
              .signal }); if (!
          response.ok)
        throw new Error(
            'Not found');
        data = await response
          .json() } else data =
        await response
      .json(); let html =
        `<div class="wiki-content"><div class="wiki-title">${data.title}</div>`; if (
        data.thumbnail) html +=
        `<img class="wiki-image" src="${data.thumbnail.source}" alt="${data.title}" loading="lazy">`;
      html +=
        `<div class="wiki-extract">${data.extract}</div>`; if (
        data.content_urls)
        html +=
        `<a class="wiki-link" href="${data.content_urls.desktop.page}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt" aria-hidden="true"></i>Read full article</a>`;
      html += '</div>'; const
        cacheKey =
        `wikipedia_${word}_${currentLanguage}`;
      searchCache.set(cacheKey,
        html); if (searchCache
        .size > maxCacheSize)
        searchCache.delete(
          searchCache.keys()
          .next().value);
      content.innerHTML =
      html } catch (
    error) { showError(
        'Wikipedia: Article not found or service unavailable'
        ) } }
  const eventListeners = new Map();
  
  function addEventListenerWithCleanup(
    element, event, handler, options
    ) { if (!element)
  return; try { element
        .addEventListener(event,
          handler, options); if (!
        eventListeners.has(element))
        eventListeners.set(element,
        []);
      eventListeners.get(element)
        .push({ event, handler,
          options }) } catch (
    e) { console.warn(
        'Event listener error:', e
        ) } } const
    setupScrollListeners = debounce(
    () => { window.addEventListener(
          'scroll',
          updateProgress, { passive: true }
          );
        window.addEventListener(
          'resize',
        () => { findScrollableElements
              ();
            updateProgress
          () }, { passive: true });
        scrollElements.forEach(el =>
          el.addEventListener(
            'scroll',
            updateProgress, { passive: true }
            )) }, 100);
  
  function extractTextFromElement(
    element) { try { if (!element ||
        element.closest(
          '#analyzer-overlay,#media-overlay'
          )) return ''; if (['SCRIPT',
          'STYLE', 'NOSCRIPT', 'META'
        ].includes(element.tagName))
        return ''; const
        computedStyle =
        getComputedStyle(
        element); if (computedStyle
        .display === 'none' ||
        computedStyle.visibility ===
        'hidden' || computedStyle
        .opacity === '0')
    return ''; if (element
        .nodeType === Node.TEXT_NODE)
        return element.textContent
          .trim(); const walker =
        document.createTreeWalker(
          element, NodeFilter
          .SHOW_TEXT, { acceptNode: node => { const
                parent = node
                .parentNode; if (!
                parent || parent
                .closest(
                  '#analyzer-overlay,#media-overlay'
                  ))
              return NodeFilter
                .FILTER_REJECT; if (
                ['SCRIPT', 'STYLE',
                  'NOSCRIPT', 'META'
                ].includes(parent
                  .tagName))
              return NodeFilter
                .FILTER_REJECT; const
                style =
                getComputedStyle(
                  parent); return (
                  style.display ===
                  'none' || style
                  .visibility ===
                  'hidden' || style
                  .opacity === '0'
                  ) ? NodeFilter
                .FILTER_REJECT :
                NodeFilter
                .FILTER_ACCEPT } }
          ); let text = ''; let
      node; while (node = walker
        .nextNode()) text += node
        .textContent +
        ' '; return text
      .trim() } catch (
  e) { return '' } } setupScrollListeners
    ();
  updateProgress();
  startMinimizeTimer();
  addEventListenerWithCleanup(
    floatingBtn, 'click',
  () => { overlay.style.display =
        'block';
      showOverlay('', 'page-info');
      resetMinimizeTimer() });
  addEventListenerWithCleanup(
    floatingBtn, 'mouseenter',
    resetMinimizeTimer);
  addEventListenerWithCleanup(
    floatingBtn, 'keydown',
    e => { if (e.key === 'Enter' ||
        e.key === ' ') { e
          .preventDefault();
        floatingBtn.click() } }
    ); const handleTextClick = debounce(
    (e, isDouble) => { const
        settingKey = isDouble ?
        'doubleClickEnabled' :
        'singleClickEnabled'; if (!
        settings[settingKey] || e
        .target.closest(
          '#analyzer-overlay,#media-overlay'
          )) return; try { const
          selection = window
          .getSelection(); let
          text = isDouble ?
          selection.toString()
          .trim() : ''; if (!
          text) { let element = e
            .target; let attempts =
            0; while (element &&
            element !== document
            .body && attempts < 4
            ) { text =
              extractTextFromElement(
                element); if (
              text) { const words =
                text.split(
                /\s+/); if (words
                .length === 1 && !
                /^[0-9\s\W]*$/.test(
                  text))
              break } element =
              element.parentNode;
            attempts++ } } if (
          text && text.length <
          60 && !/^[0-9\s\W]*$/
          .test(text)) { e
            .preventDefault();
          overlay.style.display =
            'block';
          showOverlay(text,
            'dictionary');
          resetMinimizeTimer
        () } } catch (e) { console
          .warn(
            'Text extraction error:',
            e) } }, 50);
  addEventListenerWithCleanup(
    document, 'click', e =>
    handleTextClick(e, false));
  addEventListenerWithCleanup(
    document, 'dblclick', e =>
    handleTextClick(e, true));
  addEventListenerWithCleanup(
    languageSelect, 'change',
    e => { currentLanguage = e
        .target.value;
      updateLanguageLabel();
      searchCache.clear(); const
        word = input.value
      .trim(); if (word) { const
          activeBtn = document
          .querySelector(
            '.nav-btn.active'); if (
          activeBtn) { activeBtn
            .dataset.type ===
            'dictionary' ?
            fetchDictionary(word) :
            activeBtn.dataset
            .type === 'wikipedia' &&
            fetchWikipedia(
            word) } } });
  addEventListenerWithCleanup(
    mediaOverlayClose, 'click',
    e => { e.stopPropagation();
      hideMediaOverlay() });
  addEventListenerWithCleanup(
    mediaOverlayEl, 'click',
    e => { if (e.target ===
        mediaOverlayEl)
        hideMediaOverlay() });
  addEventListenerWithCleanup(
    mediaPrevBtn, 'click', e => { e
        .stopPropagation();
      navigateMedia('prev') });
  addEventListenerWithCleanup(
    mediaNextBtn, 'click', e => { e
        .stopPropagation();
      navigateMedia('next') });
  navButtons.forEach(
  btn => { addEventListenerWithCleanup
      (btn, 'click', function(
      e) { e
      .preventDefault(); if (
          this.style.display ===
          'none') return;
        navButtons.forEach(
        b => { b.classList
            .remove(
              'active');
          b.setAttribute(
            'aria-selected',
            'false') });
        this.classList.add(
          'active');
        this.setAttribute(
          'aria-selected',
          'true');
        nav.className =
          'analyzer-nav';
        nav.classList.add(this
          .dataset.type); const
          word = input.value
          .trim();
        updateURLFragment(this
          .dataset.type, word
          ); switch (this.dataset
          .type) {
          case 'page-info':
            showPageInfo
          (); break;
          case 'settings':
            showSettings
          (); break;
          case 'dictionary':
            word ?
              fetchDictionary(
                word) : content
              .innerHTML =
              '<div id="default-message"><i class="fas fa-book" aria-hidden="true"></i>Enter a word to see dictionary results</div>'; break;
          case 'wikipedia':
            word ?
              fetchWikipedia(
                word) : content
              .innerHTML =
              '<div id="default-message"><i class="fab fa-wikipedia-w" aria-hidden="true"></i>Enter a word to see Wikipedia results</div>'; break } });
    addEventListenerWithCleanup(
      btn, 'keydown',
      e => { if (e.key ===
          'Enter' || e.key ===
          ' ') { e
            .preventDefault();
          btn.click() } }) });
  addEventListenerWithCleanup(input,
    'input', e => { const word = e
        .target.value.trim();
      currentMode = word ?
        'search' : 'default';
      updateNavVisibility(
        currentMode); if (word &&
        word.length > 1)
        performSearch() });
  addEventListenerWithCleanup(input,
    'keydown', e => { if (e.key ===
        'Enter') { e
        .preventDefault();
        performSearch() } if (e
        .key === 'Escape')
        hideOverlay() });
  addEventListenerWithCleanup(
    closeBtn, 'click', hideOverlay);
  addEventListenerWithCleanup(
    closeBtn, 'keydown', e => { if (
        e.key === 'Enter' || e
        .key === ' ') { e
          .preventDefault();
        hideOverlay() } });
  addEventListenerWithCleanup(
    document, 'keydown', e => { if (
        e.key === 'Escape') { if (
          mediaOverlayEl.classList
          .contains('show')) { e
            .preventDefault();
          hideMediaOverlay
        () } else if (overlay
          .classList.contains(
            'show')) { e
            .preventDefault();
          hideOverlay() } } if (e
        .key === 'ArrowLeft' &&
        mediaOverlayEl.classList
        .contains('show')) { e
          .preventDefault();
        navigateMedia('prev') } if (
        e.key === 'ArrowRight' &&
        mediaOverlayEl.classList
        .contains('show')) { e
          .preventDefault();
        navigateMedia('next') } });
  addEventListenerWithCleanup(overlay,
    'click', e => { if (e.target ===
        overlay) hideOverlay() });
  addEventListenerWithCleanup(window,
    'hashchange', () => { const
        parsed =
      parseURLFragment(); if (parsed
        .type === 'media') { const
          mediaElements = document
          .querySelectorAll(
            'img, video, audio, iframe, .custom-media-player'
            ); const targetMedia =
          Array.from(mediaElements)
          .find(el => { const src =
              el.src || el
              .getAttribute(
                'data-src') || el
              .querySelector?.(
                '.media-element')
              ?.src ||
              ''; return src &&
              encodeURIComponent(
                src) === parsed
              .url }); if (
          targetMedia) { let
            mediaType =
            getMediaType(
              targetMedia); if (
            targetMedia.classList
            .contains(
              'custom-media-player')
            ) { const video =
              targetMedia
              .querySelector(
                'video'); const
              audio = targetMedia
              .querySelector(
                'audio');
            mediaType = video ?
              'video' : audio ?
              'audio' : null } if (
            mediaType)
            showMediaOverlay(
              targetMedia, mediaType
              ) } } else if (overlay
        .classList.contains('show')
        ) { const { type, word } =
        parsed;
        showOverlay(word, type) } });
  addEventListenerWithCleanup(window,
    'load', () => { const parsed =
        parseURLFragment(); if (
        parsed.type === 'media'
        ) { setTimeout(() => { const
              mediaElements =
              document
              .querySelectorAll(
                'img, video, audio, iframe, .custom-media-player'
                ); const
              targetMedia = Array
              .from(mediaElements)
              .find(el => { const
                  src = el
                  .src || el
                  .getAttribute(
                    'data-src'
                    ) || el
                  .querySelector
                  ?.(
                    '.media-element'
                    )?.src ||
                  ''; return src &&
                  encodeURIComponent(
                    src) ===
                  parsed
                  .url }); if (
              targetMedia) { let
                mediaType =
                getMediaType(
                  targetMedia
                  ); if (
                targetMedia
                .classList
                .contains(
                  'custom-media-player'
                  )) { const
                  video =
                  targetMedia
                  .querySelector(
                    'video'
                    ); const
                  audio =
                  targetMedia
                  .querySelector(
                    'audio');
                mediaType =
                  video ?
                  'video' :
                  audio ?
                  'audio' :
                  null } if (
                mediaType)
                showMediaOverlay(
                  targetMedia,
                  mediaType) } },
          1000) } else if (parsed
        .type !== 'page-info' ||
        parsed.word) { overlay.style
          .display = 'block';
        showOverlay(parsed.word,
          parsed.type) } });
  addEventListenerWithCleanup(window,
    'beforeunload',
  () => { eventListeners.forEach((
        listeners, element
        ) => { listeners
          .forEach(({ event,
              handler,
              options }
            ) => { try { element
                .removeEventListener(
                  event,
                  handler,
                  options
                  ) } catch (
              e) {} }) });
      eventListeners.clear() }); const
    observer = new MutationObserver(
      debounce(
    () => { findScrollableElements
      ();
        setupScrollListeners();
        replaceNativeMediaPlayers();
        setupMediaElements() }, 500));
  observer.observe(document
  .body, { childList: true,
    subtree: true,
    attributes: false,
    characterData: false });
  console.log(
    '🚀 Complete Smart Page Analyzer v4.0 - All Issues Fixed!'
    ) })();
