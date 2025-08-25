(function() {
  'use strict';

  const CONFIG = {
    searchIconSize: '24px',
    overlayZIndex: 10000,
    animationDuration: '0.3s',
    maxResults: 15,
    pollinationsApiUrl: 'https://text.pollinations.ai/',
    searchDelay: 300,
    assistantName: 'arai',
    assistantAvatar: 'https://arlabs07.github.io/Arhub07.github.io/Images/Arai.png'
  };

  let searchTimeout, idleTimer;
  let currentPageData = [];
  let isOverlayOpen = false;

  function init() {
    createSearchIcon();
    createSearchOverlay();
    extractPageContent();
    attachEventListeners();
    resetIconIdleTimer();
  }

  function createSearchIcon() {
    const searchIcon = document.createElement('div');
    searchIcon.id = 'site-search-icon';
    searchIcon.innerHTML = `
      <img src="${CONFIG.assistantAvatar}" alt="${CONFIG.assistantName}" class="arai-logo" style="display: none;">
      <svg class="search-svg" width="${CONFIG.searchIconSize}" height="${CONFIG.searchIconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    Object.assign(searchIcon.style, {
      position: 'fixed',
      bottom: '80px',
      right: '20px',
      width: '50px',
      height: '50px',
      backgroundColor: '#BB86FC',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(187, 134, 252, 0.3)',
      zIndex: CONFIG.overlayZIndex,
      color: '#000000',
      transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.5s ease',
      userSelect: 'none'
    });
    searchIcon.addEventListener('mouseenter', handleIconHover);
    searchIcon.addEventListener('mouseleave', handleIconMouseLeave);
    document.body.appendChild(searchIcon);
  }

  function createSearchOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'site-search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Search Overlay');
    overlay.innerHTML = `
      <div class="search-overlay-backdrop"></div>
      <div class="search-overlay-content">
        <div class="search-header">
          <div class="search-input-container">
            <svg class="search-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input type="text" id="search-input" placeholder="Ask anything or search..." autocomplete="off" aria-label="Search input">
            <button class="search-close-btn" aria-label="Close search">&times;</button>
          </div>
        </div>
        <div class="search-results-container">
          <div id="ai-response" class="ai-response-section" style="display: none;">
            <details open>
              <summary class="ai-response-header">
                <div class="header-left">
                  <img src="${CONFIG.assistantAvatar}" alt="${CONFIG.assistantName}" class="assistant-avatar">
                  <span>${CONFIG.assistantName}'s Answer</span>
                </div>
                <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </summary>
              <div id="ai-response-content" class="prose"></div>
            </details>
          </div>
          <div id="search-results"></div>
        </div>
      </div>
    `;
    const styles = `
      <style>
        #site-search-icon {
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.5s ease;
        }
        #site-search-icon.searching .search-svg {
          display: none;
        }
        #site-search-icon.searching .arai-logo {
          display: block;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          animation: spin 1.2s linear infinite;
        }
        #site-search-icon.minimized {
          width: 32px;
          height: 40px;
          right: 0;
          bottom: 100px;
          border-radius: 8px 0 0 8px;
          transform: translateX(4px);
          box-shadow: -2px 2px 8px rgba(0,0,0,0.2);
        }
        #site-search-icon.minimized .search-svg {
          width: 18px;
          height: 18px;
          opacity: 0.8;
        }
        #site-search-icon.minimized .arai-logo {
          width: 18px;
          height: 18px;
        }
        #site-search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: ${CONFIG.overlayZIndex + 1};
          opacity: 0;
          visibility: hidden;
          transition: opacity ${CONFIG.animationDuration} ease, visibility ${CONFIG.animationDuration} ease;
        }
        #site-search-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        .search-overlay-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(10,10,10,0.85);
          backdrop-filter: blur(6px);
          transition: background ${CONFIG.animationDuration} ease;
        }
        .search-overlay-content {
          position: relative;
          max-width: 900px;
          margin: 3% auto;
          background: #1a1a1a;
          border: 2px solid #BB86FC;
          border-radius: 16px;
          box-shadow: 0 25px 50px rgba(187,134,252,0.25);
          overflow: hidden;
          transform: translateY(-30px) scale(0.95);
          transition: transform ${CONFIG.animationDuration} cubic-bezier(0.4, 0, 0.2, 1), opacity ${CONFIG.animationDuration} ease;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          will-change: transform, opacity;
        }
        #site-search-overlay.active .search-overlay-content {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        .search-header {
          padding: 20px;
          border-bottom: 2px solid #333;
          flex-shrink: 0;
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          transition: background ${CONFIG.animationDuration} ease;
        }
        .search-input-container {
          position: relative;
          display: flex;
          align-items: center;
          background: #0a0a0a;
          border: 2px solid #555;
          border-radius: 12px;
          padding: 16px 20px;
          transition: all 0.3s ease;
        }
        .search-input-container:focus-within {
          border-color: #BB86FC;
          background: #2a2a2a;
          box-shadow: 0 0 0 3px rgba(187,134,252,0.1);
        }
        .search-input-icon {
          color: #BB86FC;
          margin-right: 15px;
          flex-shrink: 0;
          transition: color 0.2s ease;
        }
        #search-input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 16px;
          color: #fff;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        #search-input::placeholder {
          color: #888;
          transition: color 0.2s ease;
        }
        .search-close-btn {
          background: none;
          border: none;
          font-size: 28px;
          color: #BB86FC;
          cursor: pointer;
          padding: 0;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-weight: 300;
        }
        .search-close-btn:hover {
          background: #2a2a2a;
          color: #fff;
          transform: rotate(90deg);
        }
        .search-results-container {
          flex: 1;
          overflow-y: auto;
          background: #1a1a1a;
          padding: 12px 24px;
          scrollbar-width: thin;
          scrollbar-color: #BB86FC #333;
        }
        .search-results-container::-webkit-scrollbar {
          width: 8px;
        }
        .search-results-container::-webkit-scrollbar-track {
          background: #333;
          border-radius: 4px;
        }
        .search-results-container::-webkit-scrollbar-thumb {
          background: #BB86FC;
          border-radius: 4px;
        }
        .ai-response-section {
          background: rgba(187,134,252,0.05);
          border: 1px solid #333;
          border-radius: 12px;
          margin-bottom: 16px;
          transition: opacity 0.3s ease;
        }
        .ai-response-header {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-weight: 700;
          color: #fff;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .ai-response-header:hover {
          background: rgba(187,134,252,0.1);
        }
        .ai-response-header .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .assistant-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #BB86FC;
          transition: transform 0.3s ease;
        }
        .ai-response-header:hover .assistant-avatar {
          transform: scale(1.1);
        }
        .chevron-icon {
          color: #BB86FC;
          transition: transform 0.3s ease;
        }
        details[open] > summary .chevron-icon {
          transform: rotate(180deg);
        }
        summary {
          list-style: none;
        }
        summary::-webkit-details-marker {
          display: none;
        }
        #ai-response-content {
          padding: 0 24px 24px;
          color: #e5e5e5;
          line-height: 1.7;
          font-size: 15px;
          border-top: 1px solid #333;
          margin-top: 12px;
          padding-top: 20px;
        }
        #search-results .results-header {
          font-size: 14px;
          color: #9ca3af;
          margin-bottom: 12px;
          padding-left: 4px;
          font-weight: 600;
        }
        .search-result {
          background: rgba(255,255,255,0.05);
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .search-result:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          border-color: #555;
        }
        .search-result-title {
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
          font-size: 16px;
          transition: color 0.2s ease;
        }
        .search-result-snippet {
          color: #9ca3af;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .search-result-snippet strong {
          color: #BB86FC;
          background: rgba(187,134,252,0.15);
          padding: 1px 3px;
          border-radius: 3px;
        }
        .search-result-page {
          color: #BB86FC;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .search-result-page span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 250px;
        }
        .search-result-page svg {
          width: 14px;
          height: 14px;
          color: #BB86FC;
          transition: transform 0.2s ease;
        }
        .search-result:hover .search-result-page svg {
          transform: translateX(4px);
        }
        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px;
          color: #BB86FC;
          flex-direction: column;
          gap: 16px;
        }
        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #333;
          border-top: 3px solid #BB86FC;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .prose h1, .prose h2, .prose h3 {
          color: #BB86FC;
          margin: 20px 0 12px 0;
          font-weight: 600;
          border-bottom: 1px solid #333;
          padding-bottom: 8px;
          scroll-margin-top: 20px;
        }
        .prose p {
          margin-bottom: 16px;
        }
        .prose ul, .prose ol {
          margin: 12px 0 16px 24px;
          padding: 0;
        }
        .prose li {
          margin-bottom: 8px;
        }
        .prose strong {
          color: #BB86FC;
          font-weight: 600;
        }
        .prose a {
          color: #81D4FA;
          text-decoration: none;
          border-bottom: 1px solid #81D4FA;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .prose a:hover {
          color: #fff;
          border-color: #fff;
        }
        .prose code:not(pre > code) {
          background: rgba(187,134,252,0.1);
          color: #BB86FC;
          padding: 3px 8px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 14px;
        }
        .prose pre {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 16px;
          overflow-x: auto;
          font-family: monospace;
          font-size: 14px;
          margin: 16px 0;
          position: relative;
        }
        .prose pre code {
          background: transparent;
          color: #c9d1d9;
          padding: 0;
          border-radius: 0;
        }
        .prose blockquote {
          border-left: 4px solid #BB86FC;
          padding-left: 16px;
          margin: 16px 0;
          color: #9ca3af;
          font-style: italic;
        }
        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          display: block;
          overflow-x: auto;
          white-space: nowrap;
        }
        .prose table::-webkit-scrollbar {
          height: 8px;
        }
        .prose table::-webkit-scrollbar-track {
          background: #333;
          border-radius: 4px;
        }
        .prose table::-webkit-scrollbar-thumb {
          background: #BB86FC;
          border-radius: 4px;
        }
        .prose th, .prose td {
          border: 1px solid #444;
          padding: 8px 12px;
          text-align: left;
          vertical-align: top;
        }
        .prose th {
          background-color: #2a2a2a;
          color: #BB86FC;
          font-weight: 600;
        }
        .prose .katex-display {
          overflow-x: auto;
          overflow-y: hidden;
          padding: 8px 0;
          margin: 16px 0;
          border: 1px solid #333;
          border-radius: 6px;
        }
        .prose .katex {
          color: #e5e5e5;
        }
        @media (max-width: 768px) {
          .search-overlay-content {
            margin: 1rem;
            max-height: 95vh;
          }
          .search-header {
            padding: 12px;
          }
          .search-input-container {
            padding: 12px 16px;
          }
          .search-results-container {
            padding: 8px 16px;
          }
        }
        @media (max-width: 480px) {
          #site-search-icon {
            bottom: 60px;
            right: 12px;
            width: 40px;
            height: 40px;
          }
          #site-search-icon.minimized {
            width: 28px;
            height: 36px;
          }
          .search-overlay-content {
            margin: 0.5rem;
          }
          .search-input-container {
            padding: 10px 12px;
          }
          .search-input-icon {
            margin-right: 10px;
          }
          #search-input {
            font-size: 14px;
          }
          .search-close-btn {
            font-size: 24px;
            width: 24px;
            height: 24px;
          }
        }
      </style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous">
      <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" integrity="sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUbKyJZO8" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05" crossorigin="anonymous" onload="renderMathInElement(document.body, { delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}, {left: '\\[', right: '\\]', display: true}, {left: '\\(', right: '\\)', display: false}] });"></script>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.appendChild(overlay);
  }

  function extractPageContent() {
    currentPageData = [];
    if (typeof pagesDataIframe !== 'undefined' && Array.isArray(pagesDataIframe)) {
      pagesDataIframe.forEach(page => {
        if (page.content) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = page.content;
          const textContent = tempDiv.textContent || tempDiv.innerText || '';
          currentPageData.push({
            title: page.name || 'Untitled Page',
            content: textContent,
            rawContent: page.content,
            pageId: page.id,
            url: `#${page.id}`
          });
        }
      });
    } else {
      const pageTitle = document.title || 'Current Page';
      const mainContent = document.body.textContent || document.body.innerText || '';
      currentPageData.push({
        title: pageTitle,
        content: mainContent,
        rawContent: document.body.innerHTML,
        pageId: 'current',
        url: window.location.href
      });
    }
  }

  function attachEventListeners() {
    const searchIcon = document.getElementById('site-search-icon');
    const overlay = document.getElementById('site-search-overlay');
    const closeBtn = overlay.querySelector('.search-close-btn');
    const backdrop = overlay.querySelector('.search-overlay-backdrop');
    const searchInput = document.getElementById('search-input');

    searchIcon.addEventListener('click', openSearchOverlay);
    closeBtn.addEventListener('click', closeSearchOverlay);
    backdrop.addEventListener('click', closeSearchOverlay);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOverlayOpen) {
        closeSearchOverlay();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearchOverlay();
      }
    });
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performSearch(e.target.value);
      }, CONFIG.searchDelay);
    });
    overlay.addEventListener('transitionend', () => {
      if (isOverlayOpen) {
        searchInput.focus();
      }
    });
    ['mousemove', 'mousedown', 'scroll', 'keydown', 'touchstart'].forEach(evt =>
      document.addEventListener(evt, resetIconIdleTimer, { passive: true })
    );
  }

  function resetIconIdleTimer() {
    const icon = document.getElementById('site-search-icon');
    clearTimeout(idleTimer);
    icon.classList.remove('minimized');
    idleTimer = setTimeout(() => icon.classList.add('minimized'), 10000);
  }

  function handleIconHover() {
    const icon = document.getElementById('site-search-icon');
    if (icon.classList.contains('minimized')) {
      icon.classList.remove('minimized');
    } else {
      icon.style.transform = 'scale(1.1)';
      icon.style.boxShadow = '0 6px 20px rgba(187, 134, 252, 0.4)';
    }
  }

  function handleIconMouseLeave() {
    const icon = document.getElementById('site-search-icon');
    if (!icon.classList.contains('minimized')) {
      icon.style.transform = 'scale(1)';
      icon.style.boxShadow = '0 4px 12px rgba(187, 134, 252, 0.3)';
    }
  }

  function openSearchOverlay() {
    const overlay = document.getElementById('site-search-overlay');
    overlay.classList.add('active');
    isOverlayOpen = true;
    document.body.style.overflow = 'hidden';
    resetIconIdleTimer();
    setTimeout(() => {
      document.getElementById('search-input').focus();
    }, 100);
  }

  function closeSearchOverlay() {
    const overlay = document.getElementById('site-search-overlay');
    overlay.classList.remove('active');
    isOverlayOpen = false;
    document.body.style.overflow = '';
    document.getElementById('search-input').value = '';
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('ai-response').style.display = 'none';
  }

  function performSearch(query) {
    const resultsContainer = document.getElementById('search-results');
    const aiResponseContainer = document.getElementById('ai-response');
    const searchIcon = document.getElementById('site-search-icon');

    if (!query.trim()) {
      resultsContainer.innerHTML = '';
      aiResponseContainer.style.display = 'none';
      return;
    }

    searchIcon.classList.add('searching');
    aiResponseContainer.style.display = 'block';
    document.getElementById('ai-response-content').innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';
    resultsContainer.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';

    const searchResults = searchInContent(query.toLowerCase());
    displaySearchResults(searchResults, query);
    askAI(query, searchResults);
  }

  function searchInContent(query) {
    const results = [];
    const searchTerms = query.split(/\s+/).filter(term => term.length > 0);
    currentPageData.forEach(page => {
      const content = page.content.toLowerCase();
      let totalScore = 0;
      searchTerms.forEach(term => {
        const termRegex = new RegExp(escapeRegex(term), 'gi');
        const matches = content.match(termRegex) || [];
        totalScore += matches.length;
      });
      if (totalScore > 0) {
        const snippet = extractSnippet(page.content, searchTerms, 200);
        results.push({
          title: page.title,
          snippet: snippet,
          score: totalScore,
          pageId: page.pageId,
          url: page.url
        });
      }
    });
    return results.sort((a, b) => b.score - a.score).slice(0, CONFIG.maxResults);
  }

  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function extractSnippet(content, searchTerms, maxLength = 200) {
    const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    let bestSnippet = '';
    let maxScore = -1;
    for (let i = 0; i < text.length - maxLength; i += 50) {
      const snippet = text.substring(i, i + maxLength);
      let score = 0;
      searchTerms.forEach(term => {
        if (snippet.toLowerCase().includes(term)) score++;
      });
      if (score > maxScore) {
        maxScore = score;
        bestSnippet = snippet;
      }
    }
    if (bestSnippet) {
      searchTerms.forEach(term => {
        const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
        bestSnippet = bestSnippet.replace(regex, '<strong>$1</strong>');
      });
      return '...' + bestSnippet + '...';
    }
    return text.substring(0, maxLength) + '...';
  }

  function displaySearchResults(results, query) {
    const resultsContainer = document.getElementById('search-results');
    if (results.length === 0) {
      resultsContainer.innerHTML = '';
      return;
    }
    const resultsHTML = results.map(result => {
      const truncatedUrl = result.url.length > 50 ? result.url.substring(0, 25) + '...' + result.url.slice(-20) : result.url;
      return `
        <div class="search-result" onclick="goToPage('${result.pageId}', '${result.url}')" role="button" tabindex="0" aria-label="Go to ${result.title}">
          <div class="search-result-content">
            <div class="search-result-title">${result.title}</div>
            <div class="search-result-snippet">${result.snippet}</div>
            <div class="search-result-page">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <span>${truncatedUrl}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
    resultsContainer.innerHTML = `<div class="results-header">Page Matches</div>${resultsHTML}`;
  }

  async function askAI(question, searchResults = []) {
    const aiContentContainer = document.getElementById('ai-response-content');
    const searchIcon = document.getElementById('site-search-icon');
    try {
      let contextualInfo = 'The user did not find any relevant content on the page with their search. Please answer their question generally.';
      if (searchResults.length > 0) {
        const relevantContent = searchResults.slice(0, 5).map(r => `Title: ${r.title}\nSnippet: ${r.snippet.replace(/<strong>/g, '').replace(/<\/strong>/g, '')}`).join('\n---\n');
        contextualInfo = `Here is the most relevant content found on the page related to the user's query:\n${relevantContent}`;
      }
      const prompt = `
        You are an expert assistant named ${CONFIG.assistantName}. A user is searching a website and asked: "${question}".

        ${contextualInfo}

        Based on this, provide a comprehensive, well-formatted answer using markdown. Be educational and detailed. Use markdown for all formatting including:
        - Headings (#, ##, ###)
        - Bold (**text**), italic (*text*)
        - Lists (- or 1.)
        - Code blocks (\`\`\`language\ncode\n\`\`\`)
        - Inline code (\`code\`)
        - Links ([text](url))
        - Blockquotes (> text)
        - Tables (| header | header |\n|-------|-------|\n| cell | cell |)
        - KaTeX math formulas (inline with $...$, display with $$...$$ or \\[...\\])
      `;
      const response = await fetch(CONFIG.pollinationsApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a helpful expert assistant. Provide detailed, well-formatted responses using markdown, including KaTeX for math." },
            { role: "user", content: prompt }
          ],
          model: "openai"
        })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const aiResponse = await response.text();
      aiContentContainer.innerHTML = formatAIResponse(aiResponse);
      if (window.renderMathInElement) {
        window.renderMathInElement(aiContentContainer, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
          ]
        });
      }
    } catch (error) {
      console.error('AI API Error:', error);
      aiContentContainer.innerHTML = '<p>Sorry, I couldn\'t get an AI response right now. Please try again later.</p>';
    } finally {
      searchIcon.classList.remove('searching');
    }
  }

  function formatAIResponse(text) {
    let html = text
      .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
        const language = lang || 'plaintext';
        const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<pre><code class="language-${language}">${escapedCode}</code></pre>`;
      })
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^\s*[-*] (.*)/gm, '<ul><li>$1</li></ul>')
      .replace(/^\s*\d+\. (.*)/gm, '<ol><li>$1</li></ol>')
      .replace(/<\/ul>\s*<ul>/g, '')
      .replace(/<\/ol>\s*<ol>/g, '');

    let inTable = false;
    html = html.split('\n').map(line => {
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable) {
          inTable = true;
          return `<table><thead>${line.replace(/\|/g, '<th>')}</thead><tbody>`;
        } else {
          if (line.includes('---')) return '';
          return `<tr>${line.replace(/\|/g, '<td>')}</tr>`;
        }
      } else {
        if (inTable) {
          inTable = false;
          return '</tbody></table>' + line;
        }
        return line;
      }
    }).join('\n');

    html = html
      .replace(/<th>/g, '<td>')
      .replace(/<\/th>/g, '</td>')
      .replace(/<thead>\s*<\/thead>/g, '')
      .replace(/<td>/g, '<th>')
      .replace(/<\/td>/g, '</th>')
      .replace(/<\/tr><tr>/g, '</tr>\n<tr>')
      .replace(/<\/tbody>\s*<tbody>/g, '');

    return html.replace(/\n/g, '<br>').replace(/<br>\s*<br>/g, '<p>').replace(/<p><br>/g, '<p>');
  }

  window.goToPage = function(pageId, url) {
    closeSearchOverlay();
    if (pageId && pageId !== 'current') {
      window.location.hash = pageId;
      if (typeof displayPageContentIframe === 'function') {
        displayPageContentIframe(pageId);
      }
    } else {
      if (url && url !== window.location.href) {
        window.location.href = url;
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      extractPageContent();
    }
  }).observe(document, { subtree: true, childList: true });
})();
