(function() { let isOverlayOpen = false,
      fontSize = 16,
      isHighContrast = false,
      isSmoothScrolling = true,
      isLazyLoading = true,
      hideTimeout, currentTheme =
      'default',
      customColors = { background: '#1a1a1a',
        text: '#ffffff',
        accent: '#BB86FC',
        secondary: '#9C27B0',
        border: '#333333',
        cardBg: '#2a2a2a',
        headerBg: '#0a0a0a',
        sidebarBg: '#0a0a0a',
        buttonBg: '#BB86FC',
        linkColor: '#BB86FC',
        hoverBg: '#2a2a2a',
        activeBg: '#BB86FC',
        shadowColor: 'rgba(187,134,252,0.4)' }; const
      floatingBtn = document
      .createElement('div');
    floatingBtn.innerHTML =
      '<i class="fas fa-universal-access"></i>';
    floatingBtn.style.cssText =
      'position:fixed;right:15px;top:50%;transform:translateY(-50%);width:50px;height:50px;background:linear-gradient(135deg,#BB86FC,#9C27B0);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:9999;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);box-shadow:0 4px 15px rgba(187,134,252,0.4);color:#000;font-size:20px;will-change:transform;'; const
      overlay = document.createElement(
        'div');
    overlay.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);z-index:10000;display:none;align-items:center;justify-content:center;opacity:0;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);will-change:opacity;'; const
      modal = document.createElement(
        'div');
    modal.style.cssText =
      'background:linear-gradient(135deg,#1a1a1a,#2a2a2a);border:2px solid #BB86FC;border-radius:15px;padding:25px;max-width:500px;width:90%;max-height:85vh;overflow:hidden;box-shadow:0 20px 60px rgba(187,134,252,0.3);position:relative;will-change:transform;';
    modal.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;"><h3 style="color:#BB86FC;margin:0;font-size:18px;"><i class="fas fa-cog" style="margin-right:8px;"></i>Accessibility Settings</h3><button id="closeOverlay" style="background:none;border:none;color:#BB86FC;font-size:20px;cursor:pointer;padding:5px;border-radius:50%;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);"><i class="fas fa-times"></i></button></div><div id="scrollableContent" style="overflow-y:auto;max-height:calc(85vh - 120px);padding-right:10px;"><div style="display:grid;gap:15px;"><div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(187,134,252,0.1);border-radius:8px;transition:all 0.3s ease;"><span style="color:#fff;font-size:14px;"><i class="fas fa-text-height" style="margin-right:8px;color:#BB86FC;"></i>Font Size</span><div style="display:flex;gap:8px;align-items:center;"><button id="decreaseFont" style="width:32px;height:32px;border:1px solid #BB86FC;background:transparent;color:#BB86FC;border-radius:6px;cursor:pointer;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);font-size:14px;display:flex;align-items:center;justify-content:center;">-</button><span id="fontDisplay" style="color:#BB86FC;min-width:45px;text-align:center;font-size:14px;font-weight:500;">16px</span><button id="increaseFont" style="width:32px;height:32px;border:1px solid #BB86FC;background:transparent;color:#BB86FC;border-radius:6px;cursor:pointer;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);font-size:14px;display:flex;align-items:center;justify-content:center;">+</button></div></div><div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(187,134,252,0.1);border-radius:8px;transition:all 0.3s ease;"><span style="color:#fff;font-size:14px;"><i class="fas fa-palette" style="margin-right:8px;color:#BB86FC;"></i>Theme</span><select id="themeSelect" style="background:#0a0a0a;border:1px solid #BB86FC;color:#fff;padding:6px 12px;border-radius:6px;font-size:13px;transition:all 0.3s ease;"><option value="default">Default</option><option value="light">Light Mode</option><option value="sepia">Sepia</option><option value="dark-blue">Dark Blue</option><option value="custom">Custom Theme</option></select></div><div id="customThemePanel" style="display:none;padding:15px;background:rgba(187,134,252,0.05);border-radius:10px;margin:10px 0;border:1px solid rgba(187,134,252,0.2);"><h4 style="color:#BB86FC;margin:0 0 15px 0;font-size:15px;font-weight:600;"><i class="fas fa-paint-brush" style="margin-right:8px;"></i>Custom Theme Colors</h4><div style="overflow-x:auto;padding:5px 0;"><div style="display:flex;gap:20px;min-width:max-content;padding:5px;"><div style="text-align:center;"><label style="color:#fff;font-size:12px;display:block;margin-bottom:10px;font-weight:500;">Background</label><input type="color" id="bgColor" value="#1a1a1a" style="width:45px;height:45px;border:2px solid #BB86FC;border-radius:50%;cursor:pointer;padding:0;background:transparent;transition:all 0.3s ease;"><style>#bgColor::-webkit-color-swatch{border-radius:50%;border:none;}</style></div><div style="text-align:center;"><label style="color:#fff;font-size:12px;display:block;margin-bottom:10px;font-weight:500;">Text</label><input type="color" id="textColor" value="#ffffff" style="width:45px;height:45px;border:2px solid #BB86FC;border-radius:50%;cursor:pointer;padding:0;background:transparent;transition:all 0.3s ease;"><style>#textColor::-webkit-color-swatch{border-radius:50%;border:none;}</style></div><div style="text-align:center;"><label style="color:#fff;font-size:12px;display:block;margin-bottom:10px;font-weight:500;">Accent</label><input type="color" id="accentColor" value="#BB86FC" style="width:45px;height:45px;border:2px solid #BB86FC;border-radius:50%;cursor:pointer;padding:0;background:transparent;transition:all 0.3s ease;"><style>#accentColor::-webkit-color-swatch{border-radius:50%;border:none;}</style></div><div style="text-align:center;"><label style="color:#fff;font-size:12px;display:block;margin-bottom:10px;font-weight:500;">Secondary</label><input type="color" id="secondaryColor" value="#9C27B0" style="width:45px;height:45px;border:2px solid #BB86FC;border-radius:50%;cursor:pointer;padding:0;background:transparent;transition:all 0.3s ease;"><style>#secondaryColor::-webkit-color-swatch{border-radius:50%;border:none;}</style></div><div style="text-align:center;"><label style="color:#fff;font-size:12px;display:block;margin-bottom:10px;font-weight:500;">Borders</label><input type="color" id="borderColor" value="#333333" style="width:45px;height:45px;border:2px solid #BB86FC;border-radius:50%;cursor:pointer;padding:0;background:transparent;transition:all 0.3s ease;"><style>#borderColor::-webkit-color-swatch{border-radius:50%;border:none;}</style></div><div style="text-align:center;"><label style="color:#fff;font-size:12px;display:block;margin-bottom:10px;font-weight:500;">Cards</label><input type="color" id="cardBgColor" value="#2a2a2a" style="width:45px;height:45px;border:2px solid #BB86FC;border-radius:50%;cursor:pointer;padding:0;background:transparent;transition:all 0.3s ease;"><style>#cardBgColor::-webkit-color-swatch{border-radius:50%;border:none;}</style></div><div style="text-align:center;"><label style="color:#fff;font-size:12px;display:block;margin-bottom:10px;font-weight:500;">Header</label><input type="color" id="headerBgColor" value="#0a0a0a" style="width:45px;height:45px;border:2px solid #BB86FC;border-radius:50%;cursor:pointer;padding:0;background:transparent;transition:all 0.3s ease;"><style>#headerBgColor::-webkit-color-swatch{border-radius:50%;border:none;}</style></div><div style="text-align:center;"><label style="color:#fff;font-size:12px;display:block;margin-bottom:10px;font-weight:500;">Sidebar</label><input type="color" id="sidebarBgColor" value="#0a0a0a" style="width:45px;height:45px;border:2px solid #BB86FC;border-radius:50%;cursor:pointer;padding:0;background:transparent;transition:all 0.3s ease;"><style>#sidebarBgColor::-webkit-color-swatch{border-radius:50%;border:none;}</style></div><div style="text-align:center;"><label style="color:#fff;font-size:12px;display:block;margin-bottom:10px;font-weight:500;">Buttons</label><input type="color" id="buttonBgColor" value="#BB86FC" style="width:45px;height:45px;border:2px solid #BB86FC;border-radius:50%;cursor:pointer;padding:0;background:transparent;transition:all 0.3s ease;"><style>#buttonBgColor::-webkit-color-swatch{border-radius:50%;border:none;}</style></div><div style="text-align:center;"><label style="color:#fff;font-size:12px;display:block;margin-bottom:10px;font-weight:500;">Links</label><input type="color" id="linkColor" value="#BB86FC" style="width:45px;height:45px;border:2px solid #BB86FC;border-radius:50%;cursor:pointer;padding:0;background:transparent;transition:all 0.3s ease;"><style>#linkColor::-webkit-color-swatch{border-radius:50%;border:none;}</style></div></div></div></div><div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(187,134,252,0.1);border-radius:8px;transition:all 0.3s ease;"><span style="color:#fff;font-size:14px;"><i class="fas fa-mouse-pointer" style="margin-right:8px;color:#BB86FC;"></i>Smooth Scroll</span><label style="position:relative;display:inline-block;width:52px;height:26px;"><input type="checkbox" id="smoothScrollToggle" checked style="opacity:0;width:0;height:0;"><span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#333;border-radius:26px;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);"><span style="position:absolute;content:\'\';height:22px;width:22px;left:2px;top:2px;background:#BB86FC;border-radius:50%;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);transform:translateX(24px);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></span></span></label></div><div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(187,134,252,0.1);border-radius:8px;transition:all 0.3s ease;"><span style="color:#fff;font-size:14px;"><i class="fas fa-spinner" style="margin-right:8px;color:#BB86FC;"></i>Lazy Loading</span><label style="position:relative;display:inline-block;width:52px;height:26px;"><input type="checkbox" id="lazyLoadToggle" checked style="opacity:0;width:0;height:0;"><span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#333;border-radius:26px;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);"><span style="position:absolute;content:\'\';height:22px;width:22px;left:2px;top:2px;background:#BB86FC;border-radius:50%;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);transform:translateX(24px);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></span></span></label></div><div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(187,134,252,0.1);border-radius:8px;transition:all 0.3s ease;"><span style="color:#fff;font-size:14px;"><i class="fas fa-adjust" style="margin-right:8px;color:#BB86FC;"></i>High Contrast</span><label style="position:relative;display:inline-block;width:52px;height:26px;"><input type="checkbox" id="contrastToggle" style="opacity:0;width:0;height:0;"><span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#333;border-radius:26px;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);"><span style="position:absolute;content:\'\';height:22px;width:22px;left:2px;top:2px;background:#555;border-radius:50%;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></span></span></label></div><div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(187,134,252,0.1);border-radius:8px;transition:all 0.3s ease;"><span style="color:#fff;font-size:14px;"><i class="fas fa-eye" style="margin-right:8px;color:#BB86FC;"></i>Focus Highlight</span><label style="position:relative;display:inline-block;width:52px;height:26px;"><input type="checkbox" id="focusToggle" style="opacity:0;width:0;height:0;"><span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#333;border-radius:26px;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);"><span style="position:absolute;content:\'\';height:22px;width:22px;left:2px;top:2px;background:#555;border-radius:50%;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></span></span></label></div></div></div><button id="resetAll" style="width:100%;padding:14px;background:linear-gradient(135deg,#BB86FC,#9C27B0);border:none;color:#000;border-radius:10px;cursor:pointer;font-weight:600;font-size:14px;margin-top:20px;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);box-shadow:0 4px 15px rgba(187,134,252,0.3);"><i class="fas fa-undo" style="margin-right:8px;"></i>Reset All Settings</button>';
    overlay.appendChild(modal);
    document.body.appendChild(
      floatingBtn);
    document.body.appendChild(overlay);
    
    function showFloatingBtn() { floatingBtn
        .style.transform =
        'translateY(-50%) translateX(0)';
      floatingBtn.style.borderRadius =
        '50%';
      floatingBtn.style.width = '50px';
      floatingBtn.style.boxShadow =
        '0 4px 15px rgba(187,134,252,0.4)'; }
    
    function hideFloatingBtn() { floatingBtn
        .style.transform =
        'translateY(-50%) translateX(25px)';
      floatingBtn.style.borderRadius =
        '25px 0 0 25px';
      floatingBtn.style.width = '25px';
      floatingBtn.style.boxShadow =
        '0 2px 8px rgba(187,134,252,0.2)'; }
    
    function resetHideTimeout() { clearTimeout
        (hideTimeout);
      showFloatingBtn();
      hideTimeout = setTimeout(
        hideFloatingBtn, 10000); }
    
    function openOverlay() { isOverlayOpen
        = true;
      overlay.style.display = 'flex';
      requestAnimationFrame(() =>
        overlay.style.opacity = '1');
      document.body.style.overflow =
        'hidden';
      floatingBtn.style.pointerEvents =
        'none'; }
    
    function closeOverlay() { isOverlayOpen
        = false;
      overlay.style.opacity = '0';
      floatingBtn.style.pointerEvents =
        'auto';
      setTimeout(() => { overlay.style
          .display = 'none';
        document.body.style
          .overflow = ''; }, 400); }
    
    function updateFontSize() { document
        .documentElement.style
        .fontSize = fontSize + 'px';
      document.getElementById(
          'fontDisplay').textContent =
        fontSize + 'px'; }
    
    function debounce(func, wait) { let
        timeout; return function executedFunction(
        ...args) { const later =
      () => { clearTimeout(timeout);
          func(...args); };
        clearTimeout(timeout);
        timeout = setTimeout(later,
          wait); }; }
    
    function applyTheme(
    theme) { document.body.classList
        .remove('light-theme', 'sepia',
          'dark-blue', 'custom'); const
        style = document.getElementById(
          'themeStyles') || document
        .createElement('style');
      style.id = 'themeStyles'; if (
        theme === 'light') { document
          .body.classList.add(
            'light-theme');
        style.textContent =
          `.light-theme{background:#ffffff!important;color:#1a1a1a!important;}.light-theme .preview-header-iframe{background:#f8f9fa!important;color:#1a1a1a!important;box-shadow:0 2px 10px rgba(0,0,0,0.1)!important;}.light-theme .preview-sidebar-iframe{background:#f1f3f4!important;border-right:2px solid #e0e0e0!important;}.light-theme .sidebar-page-item-iframe{color:#333333!important;}.light-theme .sidebar-page-item-iframe:hover{background:#e8f0fe!important;color:#1976d2!important;}.light-theme .sidebar-page-item-iframe.active{background:#1976d2!important;color:#ffffff!important;}.light-theme .main-content-iframe{background:#ffffff!important;color:#1a1a1a!important;}.light-theme h1,.light-theme h2,.light-theme h3{color:#1976d2!important;}.light-theme .arvia-text-iframe{color:#1976d2!important;}.light-theme .menu-button-iframe{color:#1976d2!important;}.light-theme .pagination-button-iframe{background:#1976d2!important;color:#ffffff!important;}.light-theme .pagination-button-iframe:hover:not(:disabled){background:#1565c0!important;}.light-theme .scroll-to-top-btn-iframe{background:#1976d2!important;color:#ffffff!important;}.light-theme .external-link-iframe{color:#1976d2!important;}.light-theme .external-link-iframe:hover{background:#1976d2!important;color:#ffffff!important;}.light-theme pre{background:#f5f5f5!important;border:1px solid #e0e0e0!important;}.light-theme th{background:#f1f3f4!important;color:#1976d2!important;}.light-theme td{border:1px solid #e0e0e0!important;}.light-theme .copy-code-btn-iframe{background:#1976d2!important;color:#ffffff!important;}.light-theme .formula-block-iframe{background:#f8f9fa!important;border:1px solid #1976d2!important;}.light-theme .qa-block{background:#f8f9fa!important;border:1px solid #1976d2!important;}`; } else if (
        theme === 'sepia') { style
          .textContent =
          '.sepia{filter:sepia(90%) hue-rotate(15deg) saturate(120%)!important;}'; } else if (
        theme === 'dark-blue') { style
          .textContent =
          '.dark-blue{filter:hue-rotate(220deg) saturate(110%) brightness(95%)!important;}'; } else if (
        theme === 'custom') { document
          .body.classList.add('custom');
        applyCustomTheme
      (); } else { style.textContent =
          ''; } document.head
        .appendChild(style); }
    
    function applyCustomTheme() { const
        style = document.getElementById(
          'customThemeStyles') ||
        document.createElement('style');
      style.id = 'customThemeStyles';
      style.textContent =
        `.custom{background:${customColors.background}!important;color:${customColors.text}!important;}.custom .preview-header-iframe{background:${customColors.headerBg}!important;color:${customColors.text}!important;}.custom .preview-sidebar-iframe{background:${customColors.sidebarBg}!important;border-right:2px solid ${customColors.border}!important;}.custom .sidebar-page-item-iframe{color:${customColors.text}!important;}.custom .sidebar-page-item-iframe:hover{background:${customColors.hoverBg}!important;color:${customColors.accent}!important;}.custom .sidebar-page-item-iframe.active{background:${customColors.activeBg}!important;color:${customColors.background}!important;}.custom .main-content-iframe{background:${customColors.background}!important;color:${customColors.text}!important;}.custom h1,.custom h2,.custom h3{color:${customColors.accent}!important;}.custom .arvia-text-iframe{color:${customColors.accent}!important;}.custom .pagination-button-iframe{background:${customColors.buttonBg}!important;}.custom .scroll-to-top-btn-iframe{background:${customColors.buttonBg}!important;}.custom a{color:${customColors.linkColor}!important;}.custom .external-link-iframe{color:${customColors.linkColor}!important;}.custom .external-link-iframe:hover{background:${customColors.linkColor}!important;}.custom pre{background:${customColors.cardBg}!important;}.custom th{background:${customColors.cardBg}!important;color:${customColors.accent}!important;}.custom td{border-color:${customColors.border}!important;}.custom .copy-code-btn-iframe{background:${customColors.buttonBg}!important;}.custom .formula-block-iframe,.custom .qa-block{background:${customColors.cardBg}!important;border-color:${customColors.accent}!important;}`;
      document.head.appendChild(
      style); }
    
    function toggleLazyLoading(
    enabled) { document
        .querySelectorAll('img, iframe')
        .forEach(el => { if (
            enabled) { if (!el
              .hasAttribute('loading')
              ) { el.setAttribute(
                'loading', 'lazy'
                ); } } else { el
              .removeAttribute(
                'loading'); } }); }
    
    function toggleSmoothScroll(
    enabled) { const behavior =
        enabled ? 'smooth' : 'auto';
      document.documentElement.style
        .scrollBehavior =
        behavior; const style = document
        .getElementById(
          'smoothScrollStyles') ||
        document.createElement('style');
      style.id = 'smoothScrollStyles';
      style.textContent = enabled ?
        '*{scroll-behavior:smooth!important;}' :
        '*{scroll-behavior:auto!important;}';
      document.head.appendChild(
      style); } const
      debouncedApplyCustomTheme =
      debounce(applyCustomTheme, 100);
    floatingBtn.addEventListener(
      'click', openOverlay);
    floatingBtn.addEventListener(
      'mouseenter', resetHideTimeout);
    floatingBtn.addEventListener(
      'mouseleave', () =>
      hideTimeout = setTimeout(
        hideFloatingBtn, 2000));
    document.addEventListener(
      'mousemove', resetHideTimeout);
    document.addEventListener('scroll',
      resetHideTimeout, { passive: true }
      );
    document.getElementById(
        'closeOverlay')
      .addEventListener('click',
        closeOverlay);
    document.getElementById(
        'closeOverlay')
      .addEventListener('mouseenter',
        e => { e.target.style
            .background =
            'rgba(187,134,252,0.2)';
          e.target.style.transform =
            'scale(1.1)'; });
    document.getElementById(
        'closeOverlay')
      .addEventListener('mouseleave',
        e => { e.target.style
            .background = 'none';
          e.target.style.transform =
            'scale(1)'; });
    overlay.addEventListener('click',
      e => { if (e.target === overlay)
          closeOverlay(); });
    document.getElementById(
        'increaseFont')
      .addEventListener('click',
    () => { if (fontSize <
          28) { fontSize++;
          updateFontSize(); } });
    document.getElementById(
        'decreaseFont')
      .addEventListener('click',
    () => { if (fontSize >
          10) { fontSize--;
          updateFontSize(); } });
    ['increaseFont', 'decreaseFont']
    .forEach(id => { const btn =
        document.getElementById(id);
      btn.addEventListener(
        'mouseenter', () => { btn
            .style.background =
            '#BB86FC';
          btn.style.color =
          '#000';
          btn.style.transform =
            'scale(1.05)'; });
      btn.addEventListener(
        'mouseleave', () => { btn
            .style.background =
            'transparent';
          btn.style.color =
            '#BB86FC';
          btn.style.transform =
            'scale(1)'; }); });
    document.getElementById(
      'themeSelect').addEventListener(
      'change', e => { currentTheme =
          e.target.value; const
          customPanel = document
          .getElementById(
            'customThemePanel'); if (
          currentTheme === 'custom'
          ) { customPanel.style
            .display = 'block';
          customPanel.style
            .animation =
            'slideDown 0.3s ease'; } else { customPanel
            .style.display =
            'none'; } applyTheme(
          currentTheme); });
    ['bgColor', 'textColor',
      'accentColor', 'secondaryColor',
      'borderColor', 'cardBgColor',
      'headerBgColor', 'sidebarBgColor',
      'buttonBgColor', 'linkColor'
    ].forEach(id => { const colorInput =
        document.getElementById(
        id); if (
        colorInput) { colorInput
          .addEventListener(
            'change', e => { const
                colorMap = { bgColor: 'background',
                  textColor: 'text',
                  accentColor: 'accent',
                  secondaryColor: 'secondary',
                  borderColor: 'border',
                  cardBgColor: 'cardBg',
                  headerBgColor: 'headerBg',
                  sidebarBgColor: 'sidebarBg',
                  buttonBgColor: 'buttonBg',
                  linkColor: 'linkColor' };
              customColors[colorMap[
                  id]] = e.target
                .value; if (
                currentTheme ===
                'custom'
                ) { debouncedApplyCustomTheme
                  (); } });
        colorInput.addEventListener(
          'mouseenter',
        () => { colorInput.style
              .transform =
              'scale(1.1)';
            colorInput.style
              .boxShadow =
              '0 0 15px rgba(187,134,252,0.6)'; }
          );
        colorInput.addEventListener(
          'mouseleave',
        () => { colorInput.style
              .transform =
              'scale(1)';
            colorInput.style
              .boxShadow =
              'none'; }); } });
    
    function createToggleHandler(
      toggleId, propertyName, callback
      ) { const toggle = document
        .getElementById(toggleId);
      toggle.addEventListener('change',
        e => { window[propertyName] =
            e.target.checked; const
            slider = e.target
            .nextElementSibling
            .children[0];
          slider.style.transform = e
            .target.checked ?
            'translateX(24px)' :
            'translateX(0)';
          slider.style.background = e
            .target.checked ?
            '#BB86FC' : '#555'; if (
            callback) callback(e
            .target.checked); }
        ); } createToggleHandler(
      'smoothScrollToggle',
      'isSmoothScrolling',
      toggleSmoothScroll);
    createToggleHandler(
      'lazyLoadToggle',
      'isLazyLoading',
      toggleLazyLoading);
    createToggleHandler(
      'contrastToggle',
      'isHighContrast',
      enabled => { document.body.style
          .filter = enabled ?
          'contrast(150%) brightness(120%)' :
          ''; });
    createToggleHandler('focusToggle',
      '', enabled => { const
          focusStyle = document
          .getElementById(
            'focusStyles') || document
          .createElement('style');
        focusStyle.id = 'focusStyles';
        focusStyle.textContent =
          enabled ?
          '.focus-highlight *:focus{outline:3px solid #FFD700!important;outline-offset:3px!important;box-shadow:0 0 10px rgba(255,215,0,0.5)!important;}' :
          '';
        document.head.appendChild(
          focusStyle);
        document.body.classList
          .toggle('focus-highlight',
            enabled); });
    document.getElementById('resetAll')
      .addEventListener('click',
      () => { fontSize = 16;
          currentTheme = 'default';
          isSmoothScrolling = true;
          isLazyLoading = true;
          isHighContrast = false;
          customColors
          = { background: '#1a1a1a',
            text: '#ffffff',
            accent: '#BB86FC',
            secondary: '#9C27B0',
            border: '#333333',
            cardBg: '#2a2a2a',
            headerBg: '#0a0a0a',
            sidebarBg: '#0a0a0a',
            buttonBg: '#BB86FC',
            linkColor: '#BB86FC',
            hoverBg: '#2a2a2a',
            activeBg: '#BB86FC',
            shadowColor: 'rgba(187,134,252,0.4)' };
          updateFontSize();
          applyTheme('default');
          toggleSmoothScroll(true);
          toggleLazyLoading(true);
          document.getElementById(
              'themeSelect').value =
            'default';
          document.getElementById(
              'customThemePanel').style
            .display = 'none';
          ['smoothScrollToggle',
            'lazyLoadToggle'
          ].forEach(id => { const cb =
              document
              .getElementById(id);
            cb.checked = true; const
              slider = cb
              .nextElementSibling
              .children[0];
            slider.style.transform =
              'translateX(24px)';
            slider.style
              .background =
              '#BB86FC'; });
          ['contrastToggle',
            'focusToggle'
          ].forEach(id => { const cb =
                document
                .getElementById(id);
              cb.checked =
              false; const slider = cb
                .nextElementSibling
                .children[0];
              slider.style.transform =
                'translateX(0)';
              slider.style
                .background =
                '#555'; }); const
            colorDefaults = { bgColor: '#1a1a1a',
              textColor: '#ffffff',
              accentColor: '#BB86FC',
              secondaryColor: '#9C27B0',
              borderColor: '#333333',
              cardBgColor: '#2a2a2a',
              headerBgColor: '#0a0a0a',
              sidebarBgColor: '#0a0a0a',
              buttonBgColor: '#BB86FC',
              linkColor: '#BB86FC' };
          Object.keys(colorDefaults)
            .forEach(id => { const input=document.getElementById(id);if(input)input.value=colorDefaults[id];});document.body.style.filter='';document.body.classList.remove('focus-highlight','light-theme','sepia','dark-blue','custom');document.getElementById('resetAll').style.transform='scale(0.95)';setTimeout(()=>{document.getElementById('resetAll').style.transform='scale(1)';},150);closeOverlay();});document.getElementById('resetAll').addEventListener('mouseenter',e=>{e.target.style.transform='scale(1.05)';e.target.style.boxShadow='0 6px 20px rgba(187,134,252,0.5)';});document.getElementById('resetAll').addEventListener('mouseleave',e=>{e.target.style.transform='scale(1)';e.target.style.boxShadow='0 4px 15px rgba(187,134,252,0.3)';});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&isOverlayOpen){closeOverlay();}if(e.key==='Tab'&&isOverlayOpen){const focusableElements=overlay.querySelectorAll('button, input, select');const firstElement=focusableElements[0];const lastElement=focusableElements[focusableElements.length-1];if(e.shiftKey){if(document.activeElement===firstElement){e.preventDefault();lastElement.focus();}}else{if(document.activeElement===lastElement){e.preventDefault();firstElement.focus();}}}});let resizeTimeout;window.addEventListener('resize',()=>{clearTimeout(resizeTimeout);resizeTimeout=setTimeout(()=>{if(window.innerWidth<=768){modal.style.width='95%';modal.style.padding='20px';}else{modal.style.width='90%';modal.style.padding='25px';}},150);},{passive:true});const performanceObserver=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.transform='translateY(0)';entry.target.style.opacity='1';}});},{threshold:0.1});modal.querySelectorAll('div[style*="background:rgba(187,134,252,0.1)"]').forEach(el=>{el.style.transform='translateY(20px)';el.style.opacity='0';el.style.transition='all 0.4s cubic-bezier(0.4,0,0.2,1)';performanceObserver.observe(el);});const mediaQuery=window.matchMedia('(prefers-reduced-motion: reduce)');function handleMotionPreference(e){const transitions=e.matches?'none':'all 0.4s cubic-bezier(0.4,0,0.2,1)';[floatingBtn,overlay,modal].forEach(el=>{el.style.transition=transitions;});}mediaQuery.addListener(handleMotionPreference);handleMotionPreference(mediaQuery);if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{});}const style=document.createElement('style');style.textContent='@keyframes slideDown{from{opacity:0;transform:translateY(-20px);}to{opacity:1;transform:translateY(0);}}@keyframes pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.05);}}@media(max-width:768px){#customThemePanel div[style*="display:flex"]{flex-wrap:wrap;justify-content:center;}#customThemePanel div[style*="text-align:center"]{margin-bottom:15px;}}@media(prefers-color-scheme:dark){:root{color-scheme:dark;}}@media(prefers-color-scheme:light){:root{color-scheme:light;}}';document.head.appendChild(style);resetHideTimeout();})();
