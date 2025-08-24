const PresentationMode = {
init() {
this.createPresentationButton();
this.isActive = false;
this.currentElementIndex = 0;
this.elements = [];
this.isPlaying = false;
this.playInterval = null;
this.canvas = null;
this.ctx = null;
this.isDrawing = false;
this.autoScroll = true;
this.currentPageId = currentPageIdIframe;
this.currentColor = '#BB86FC';
this.typingSpeed = 50;
this.currentTypingIndex = 0;
this.isTyping = false;
this.eraserMode = false;
this.lastInteraction = Date.now();
this.uiTimeout = null;
this.isUIHidden = false;
this.mainButtonTimeout = null;
this.isMainButtonHidden = false;
},
createPresentationButton() {
const button = document.createElement('button');
button.id = 'presentationModeBtn';
button.innerHTML = '<i class="fas fa-play-circle"></i>';
button.setAttribute('aria-label', 'Start Presentation Mode (P)');
button.style.cssText = `
position: fixed;
top: 5rem;
right: 1.5rem;
background-color: #BB86FC;
color: #000000;
width: 3rem;
height: 3rem;
border-radius: 50%;
display: flex;
justify-content: center;
align-items: center;
font-size: 1.5rem;
cursor: pointer;
box-shadow: 0 2px 10px rgba(0,0,0,0.3);
border: none;
z-index: 1000;
transition: all 0.3s ease;
opacity: 1;
`;
button.addEventListener('mouseenter', () => {
this.resetMainButtonTimer();
button.style.transform = 'scale(1.1)';
});
button.addEventListener('mouseleave', () => button.style.transform = 'scale(1)');
button.addEventListener('click', () => {
this.resetMainButtonTimer();
this.togglePresentationMode();
});
button.addEventListener('keydown', (e) => {
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
this.resetMainButtonTimer();
this.togglePresentationMode();
}
});
document.body.appendChild(button);
this.setupMainButtonAutoHide();
this.setupGlobalKeyboardShortcuts();
},
togglePresentationMode() {
if (this.isActive) {
this.exitPresentationMode();
} else {
this.enterPresentationMode();
}
},
enterPresentationMode() {
this.isActive = true;
this.currentPageId = currentPageIdIframe;
document.body.style.overflow = 'hidden';
document.body.setAttribute('aria-hidden', 'true');
this.createPresentationContainer();
this.setupCanvas();
this.extractElements();
this.createBottomBar();
this.startPresentation();
this.setupPresentationKeyboardShortcuts();
document.getElementById('presentationModeBtn').style.display = 'none';
document.getElementById('presentationContainer').focus();
},
exitPresentationMode() {
this.isActive = false;
this.isPlaying = false;
this.isTyping = false;
if (this.playInterval) clearInterval(this.playInterval);
if (this.uiTimeout) clearTimeout(this.uiTimeout);
document.body.style.overflow = '';
document.body.removeAttribute('aria-hidden');
const container = document.getElementById('presentationContainer');
if (container) container.remove();
const minimizedBtn = document.getElementById('minimizedControlBtn');
if (minimizedBtn) minimizedBtn.remove();
document.getElementById('presentationModeBtn').style.display = 'flex';
document.getElementById('presentationModeBtn').focus();
this.resetMainButtonTimer();
},
createPresentationContainer() {
const container = document.createElement('div');
container.id = 'presentationContainer';
container.setAttribute('role', 'dialog');
container.setAttribute('aria-label', 'Presentation Mode');
container.setAttribute('tabindex', '-1');
container.style.cssText = `
position: fixed;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
background-color: #1a1a1a;
z-index: 10000;
display: flex;
flex-direction: column;
`;
const contentArea = document.createElement('div');
contentArea.id = 'presentationContent';
contentArea.setAttribute('role', 'main');
contentArea.style.cssText = `
flex: 1;
overflow-y: auto;
overflow-x: hidden;
padding: 2rem;
position: relative;
max-height: calc(100vh - 4rem);
`;
const canvasContainer = document.createElement('div');
canvasContainer.id = 'canvasContainer';
canvasContainer.style.cssText = `
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
pointer-events: none;
z-index: 1;
`;
contentArea.appendChild(canvasContainer);
container.appendChild(contentArea);
document.body.appendChild(container);
container.addEventListener('keydown', (e) => {
if (e.key === 'Escape') {
this.exitPresentationMode();
}
});
},
setupCanvas() {
this.canvas = document.createElement('canvas');
this.canvas.setAttribute('aria-label', 'Drawing Canvas');
this.canvas.style.cssText = `
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
pointer-events: none;
z-index: 2;
`;
this.ctx = this.canvas.getContext('2d');
this.ctx.strokeStyle = this.currentColor;
this.ctx.lineWidth = 3;
this.ctx.lineCap = 'round';
this.resizeCanvas();
window.addEventListener('resize', () => this.resizeCanvas());
this.setupDrawingEvents();
this.setupUIAutoHide();
document.getElementById('canvasContainer').appendChild(this.canvas);
},
resizeCanvas() {
const container = document.getElementById('presentationContent');
this.canvas.width = container.offsetWidth;
this.canvas.height = container.scrollHeight;
this.canvas.style.width = container.offsetWidth + 'px';
this.canvas.style.height = container.scrollHeight + 'px';
},
setupDrawingEvents() {
let lastX = 0, lastY = 0;
const getImageData = (x, y, radius = 20) => {
return this.ctx.getImageData(x - radius, y - radius, radius * 2, radius * 2);
};
const clearArea = (x, y, radius = 20) => {
this.ctx.clearRect(x - radius, y - radius, radius * 2, radius * 2);
};
this.canvas.addEventListener('mousedown', (e) => {
this.resetUITimer();
if (this.eraserMode) {
clearArea(e.offsetX, e.offsetY);
} else {
this.isDrawing = true;
}
[lastX, lastY] = [e.offsetX, e.offsetY];
});
this.canvas.addEventListener('mousemove', (e) => {
this.resetUITimer();
if (this.eraserMode) {
clearArea(e.offsetX, e.offsetY);
} else if (this.isDrawing) {
this.ctx.strokeStyle = this.currentColor;
this.ctx.beginPath();
this.ctx.moveTo(lastX, lastY);
this.ctx.lineTo(e.offsetX, e.offsetY);
this.ctx.stroke();
[lastX, lastY] = [e.offsetX, e.offsetY];
}
});
this.canvas.addEventListener('mouseup', () => this.isDrawing = false);
this.canvas.addEventListener('mouseout', () => this.isDrawing = false);
this.canvas.addEventListener('touchstart', (e) => {
this.resetUITimer();
const touch = e.touches[0];
const rect = this.canvas.getBoundingClientRect();
const touchX = touch.clientX - rect.left;
const touchY = touch.clientY - rect.top;
if (this.eraserMode) {
clearArea(touchX, touchY);
} else {
this.isDrawing = true;
}
[lastX, lastY] = [touchX, touchY];
e.preventDefault();
});
this.canvas.addEventListener('touchmove', (e) => {
this.resetUITimer();
const touch = e.touches[0];
const rect = this.canvas.getBoundingClientRect();
const touchX = touch.clientX - rect.left;
const touchY = touch.clientY - rect.top;
if (this.eraserMode) {
clearArea(touchX, touchY);
} else if (this.isDrawing) {
this.ctx.strokeStyle = this.currentColor;
this.ctx.beginPath();
this.ctx.moveTo(lastX, lastY);
this.ctx.lineTo(touchX, touchY);
this.ctx.stroke();
[lastX, lastY] = [touchX, touchY];
}
e.preventDefault();
});
this.canvas.addEventListener('touchend', () => this.isDrawing = false);
},
extractElements() {
const page = pagesDataIframe.find(p => p.id === this.currentPageId);
if (!page) return;
const tempDiv = document.createElement('div');
tempDiv.innerHTML = page.content;
const qaBlocks = tempDiv.querySelectorAll('.qa-block');
qaBlocks.forEach(block => {
const parent = block.parentNode;
if (parent && parent !== tempDiv) {
tempDiv.appendChild(block.cloneNode(true));
block.remove();
}
});
this.elements = Array.from(tempDiv.children).filter(el => {
const tagName = el.tagName.toLowerCase();
return ['h1', 'h2', 'h3', 'p', 'ul', 'ol', 'table', 'pre', 'img', 'iframe', 'strong', 'em', 'a', 'div', 'blockquote', 'code'].includes(tagName);
}).map(el => {
if (el.tagName === 'A') {
const href = el.getAttribute('href');
if (href && href.length > 50) {
el.textContent = href.substring(0, 47) + '...';
}
}
if (el.tagName === 'IMG') {
el.style.maxWidth = '80%';
el.style.height = 'auto';
el.style.maxHeight = '400px';
el.style.objectFit = 'contain';
el.style.display = 'block';
el.style.margin = '0 auto 1rem auto';
}
if (el.tagName === 'IFRAME') {
el.style.width = '80%';
el.style.height = '300px';
el.style.maxHeight = '400px';
el.style.display = 'block';
el.style.margin = '0 auto 1rem auto';
}
if (el.tagName === 'UL' || el.tagName === 'OL') {
el.style.margin = '0 0 1rem 1.25rem';
el.style.padding = '0';
Array.from(el.children).forEach(li => {
li.style.marginBottom = '0.5rem';
li.style.paddingLeft = '0.5rem';
});
}
return el.outerHTML;
});
this.currentElementIndex = 0;
},
createBottomBar() {
const bottomBar = document.createElement('div');
bottomBar.id = 'presentationBottomBar';
bottomBar.setAttribute('role', 'toolbar');
bottomBar.style.cssText = `
height: 4rem;
background-color: #0a0a0a;
border-top: 2px solid #BB86FC;
display: flex;
align-items: center;
padding: 0 1rem;
flex-shrink: 0;
overflow-x: auto;
overflow-y: hidden;
gap: 1rem;
`;
const scrollContainer = document.createElement('div');
scrollContainer.style.cssText = `
display: flex;
align-items: center;
gap: 1rem;
min-width: max-content;
padding: 0 1rem;
`;
const prevBtn = this.createControlButton('fas fa-chevron-left', () => this.previousPage(), 'Previous Page');
const nextBtn = this.createControlButton('fas fa-chevron-right', () => this.nextPage(), 'Next Page');
const pageInfo = document.createElement('span');
pageInfo.id = 'pageInfo';
pageInfo.style.cssText = 'color: #FFFFFF; font-weight: bold; white-space: nowrap; min-width: max-content;';
pageInfo.textContent = this.getCurrentPageName();
const playBtn = this.createControlButton('fas fa-play', () => this.togglePlay(), 'Play/Pause');
playBtn.id = 'playButton';
const autoScrollBtn = this.createControlButton('fas fa-scroll', () => this.toggleAutoScroll(), 'Toggle Auto Scroll');
autoScrollBtn.id = 'autoScrollBtn';
autoScrollBtn.style.backgroundColor = this.autoScroll ? '#BB86FC' : '#555555';
const pencilContainer = document.createElement('div');
pencilContainer.style.cssText = 'position: relative;';
const pencilBtn = this.createControlButton('fas fa-pencil-alt', () => this.toggleDrawing(), 'Drawing Tool');
pencilBtn.id = 'pencilBtn';
this.createColorPalette(pencilContainer, pencilBtn);
pencilContainer.appendChild(pencilBtn);
const eraserBtn = this.createControlButton('fas fa-eraser', () => this.toggleEraser(), 'Toggle Eraser');
eraserBtn.id = 'eraserBtn';
const exitBtn = this.createControlButton('fas fa-times', () => this.exitPresentationMode(), 'Exit Presentation');
exitBtn.style.backgroundColor = '#f44336';
scrollContainer.appendChild(prevBtn);
scrollContainer.appendChild(pageInfo);
scrollContainer.appendChild(nextBtn);
scrollContainer.appendChild(playBtn);
scrollContainer.appendChild(autoScrollBtn);
scrollContainer.appendChild(pencilContainer);
scrollContainer.appendChild(eraserBtn);
scrollContainer.appendChild(exitBtn);
bottomBar.appendChild(scrollContainer);
document.getElementById('presentationContainer').appendChild(bottomBar);
},
createColorPalette(container, pencilBtn) {
const palette = document.createElement('div');
palette.id = 'colorPalette';
palette.style.cssText = `
position: absolute;
bottom: 140%;
left: 50%;
transform: translateX(-50%);
background-color: #0a0a0a;
border: 2px solid #BB86FC;
border-radius: 0.5rem;
padding: 0.5rem;
display: none;
flex-wrap: wrap;
gap: 0.25rem;
width: 200px;
z-index: 10001;
box-shadow: 0 4px 12px rgba(0,0,0,0.5);
`;
const colors = ['#BB86FC', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9F43', '#EE5A24', '#5F27CD', '#00D2D3'];
colors.forEach(color => {
const colorBtn = document.createElement('button');
colorBtn.style.cssText = `
width: 1.5rem;
height: 1.5rem;
border-radius: 50%;
border: 2px solid ${color === this.currentColor ? '#FFFFFF' : 'transparent'};
background-color: ${color};
cursor: pointer;
transition: transform 0.2s ease;
`;
colorBtn.setAttribute('aria-label', `Select ${color} color`);
colorBtn.addEventListener('click', () => {
this.resetUITimer();
this.currentColor = color;
this.eraserMode = false;
const eraserBtn = document.getElementById('eraserBtn');
if (eraserBtn) eraserBtn.style.backgroundColor = '#BB86FC';
palette.querySelectorAll('button').forEach(btn => btn.style.border = '2px solid transparent');
colorBtn.style.border = '2px solid #FFFFFF';
palette.style.display = 'none';
});
colorBtn.addEventListener('mouseenter', () => colorBtn.style.transform = 'scale(1.2)');
colorBtn.addEventListener('mouseleave', () => colorBtn.style.transform = 'scale(1)');
palette.appendChild(colorBtn);
});
pencilBtn.addEventListener('mouseenter', () => {
this.resetUITimer();
palette.style.display = 'flex';
});
container.addEventListener('mouseleave', () => {
setTimeout(() => palette.style.display = 'none', 500);
});
container.appendChild(palette);
},
createControlButton(iconClass, clickHandler, ariaLabel) {
const button = document.createElement('button');
button.innerHTML = `<i class="${iconClass}"></i>`;
button.setAttribute('aria-label', ariaLabel);
button.style.cssText = `
background-color: #BB86FC;
color: #000000;
border: none;
width: 2.5rem;
height: 2.5rem;
border-radius: 0.3125rem;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
font-size: 1rem;
transition: all 0.3s ease;
flex-shrink: 0;
`;
button.addEventListener('click', () => {
this.resetUITimer();
clickHandler();
});
button.addEventListener('keydown', (e) => {
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
this.resetUITimer();
clickHandler();
}
});
button.addEventListener('mouseenter', () => {
this.resetUITimer();
if (button.style.backgroundColor !== '#f44336') {
button.style.backgroundColor = '#9C27B0';
}
});
button.addEventListener('mouseleave', () => {
if (button.style.backgroundColor !== '#f44336') {
button.style.backgroundColor = '#BB86FC';
}
});
return button;
},
getCurrentPageName() {
const page = pagesDataIframe.find(p => p.id === this.currentPageId);
return page ? page.name : 'Unknown';
},
startPresentation() {
const contentArea = document.getElementById('presentationContent');
contentArea.innerHTML = '<div id="canvasContainer" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;"></div>';
document.getElementById('canvasContainer').appendChild(this.canvas);
this.currentElementIndex = 0;
this.displayCurrentElements();
},
displayCurrentElements() {
const contentArea = document.getElementById('presentationContent');
const existingContent = contentArea.querySelector('#presentationElements');
if (existingContent) existingContent.remove();
const elementsContainer = document.createElement('div');
elementsContainer.id = 'presentationElements';
elementsContainer.style.cssText = `
position: relative;
z-index: 0;
color: #FFFFFF;
line-height: 1.6;
word-wrap: break-word;
overflow-wrap: break-word;
`;
elementsContainer.innerHTML = `
<style>
#presentationElements * { max-width: 100% !important; box-sizing: border-box; }
#presentationElements h1, #presentationElements h2, #presentationElements h3 { color: #BB86FC; margin-bottom: 1rem; }
#presentationElements p { margin-bottom: 1rem; }
#presentationElements pre { background-color: #0a0a0a; padding: 1rem; border-radius: 0.3125rem; margin-bottom: 1rem; overflow-x: auto; max-width: 100%; }
#presentationElements table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; table-layout: fixed; }
#presentationElements th, #presentationElements td { border: 1px solid #555555; padding: 0.5rem; text-align: left; word-wrap: break-word; }
#presentationElements th { background-color: #2a2a2a; color: #BB86FC; }
#presentationElements ul, #presentationElements ol { margin: 0 0 1rem 1.25rem; padding: 0; }
#presentationElements li { margin-bottom: 0.5rem; padding-left: 0.5rem; }
#presentationElements ul li { list-style-type: disc; }
#presentationElements ol li { list-style-type: decimal; }
#presentationElements blockquote { margin: 1rem 0; padding: 1rem; border-left: 4px solid #BB86FC; background-color: #0a0a0a; }
#presentationElements strong { color: #BB86FC; font-weight: bold; }
#presentationElements em { color: #96CEB4; font-style: italic; }
#presentationElements code { background-color: #2a2a2a; padding: 0.2rem 0.4rem; border-radius: 0.2rem; font-family: 'Courier New', monospace; }
#presentationElements img { max-width: 80% !important; height: auto !important; max-height: 400px !important; border-radius: 0.3125rem; margin-bottom: 1rem; object-fit: contain; display: block; margin-left: auto; margin-right: auto; }
#presentationElements iframe { width: 80% !important; height: 300px; max-height: 400px; border: none; border-radius: 0.3125rem; margin-bottom: 1rem; display: block; margin-left: auto; margin-right: auto; }
#presentationElements .formula-block-iframe { overflow-x: auto; padding: 1rem; background-color: #0a0a0a; border: 1px solid #BB86FC; border-radius: 0.3125rem; margin-bottom: 1rem; }
#presentationElements .qa-block { background-color: #0a0a0a; border: 1px solid #BB86FC; border-radius: 0.3125rem; padding: 1rem; margin-bottom: 1rem; }
#presentationElements a { color: #BB86FC; text-decoration: underline; word-break: break-all; }
#presentationElements .typing-element { border-right: 2px solid #BB86FC; animation: blink 1s infinite; }
@keyframes blink { 0%, 50% { border-color: #BB86FC; } 51%, 100% { border-color: transparent; } }
</style>
`;
for (let i = 0; i <= this.currentElementIndex && i < this.elements.length; i++) {
if (i === this.currentElementIndex && this.isTyping) {
const tempDiv = document.createElement('div');
tempDiv.innerHTML = this.elements[i];
const element = tempDiv.firstElementChild;
if (element && (element.tagName === 'P' || element.tagName.startsWith('H'))) {
const typingElement = element.cloneNode(false);
typingElement.classList.add('typing-element');
typingElement.textContent = element.textContent.substring(0, this.currentTypingIndex);
elementsContainer.appendChild(typingElement);
} else {
elementsContainer.innerHTML += this.elements[i];
}
} else {
elementsContainer.innerHTML += this.elements[i];
}
}
contentArea.appendChild(elementsContainer);
setTimeout(() => {
this.resizeCanvas();
if (typeof MathJax !== 'undefined') {
MathJax.typesetPromise([elementsContainer]);
}
if (typeof hljs !== 'undefined') {
elementsContainer.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
}
if (this.autoScroll) this.scrollToBottom();
}, 100);
},
scrollToBottom() {
const contentArea = document.getElementById('presentationContent');
contentArea.scrollTop = contentArea.scrollHeight;
},
typeNextCharacter() {
if (!this.isTyping || this.currentElementIndex >= this.elements.length) return;
const tempDiv = document.createElement('div');
tempDiv.innerHTML = this.elements[this.currentElementIndex];
const element = tempDiv.firstElementChild;
if (element && (element.tagName === 'P' || element.tagName.startsWith('H'))) {
const fullText = element.textContent;
if (this.currentTypingIndex < fullText.length) {
this.currentTypingIndex++;
this.displayCurrentElements();
setTimeout(() => this.typeNextCharacter(), this.typingSpeed);
} else {
this.isTyping = false;
this.currentTypingIndex = 0;
const typingElement = document.querySelector('.typing-element');
if (typingElement) {
typingElement.classList.remove('typing-element');
}
}
} else {
this.isTyping = false;
this.currentTypingIndex = 0;
}
},
togglePlay() {
this.isPlaying = !this.isPlaying;
const playBtn = document.getElementById('playButton');
playBtn.innerHTML = this.isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
playBtn.setAttribute('aria-label', this.isPlaying ? 'Pause' : 'Play');
if (this.isPlaying) {
this.nextElement();
} else {
if (this.playInterval) {
clearInterval(this.playInterval);
this.playInterval = null;
}
this.isTyping = false;
}
},
nextElement() {
if (this.currentElementIndex < this.elements.length - 1) {
this.currentElementIndex++;
const tempDiv = document.createElement('div');
tempDiv.innerHTML = this.elements[this.currentElementIndex];
const element = tempDiv.firstElementChild;
if (element && (element.tagName === 'P' || element.tagName.startsWith('H'))) {
this.isTyping = true;
this.currentTypingIndex = 0;
this.displayCurrentElements();
this.typeNextCharacter();
this.playInterval = setTimeout(() => {
if (this.isPlaying) this.nextElement();
}, element.textContent.length * this.typingSpeed + 1000);
} else {
this.displayCurrentElements();
this.playInterval = setTimeout(() => {
if (this.isPlaying) this.nextElement();
}, 2000);
}
} else {
this.togglePlay();
}
},
toggleAutoScroll() {
this.autoScroll = !this.autoScroll;
const btn = document.getElementById('autoScrollBtn');
btn.style.backgroundColor = this.autoScroll ? '#BB86FC' : '#555555';
btn.setAttribute('aria-label', this.autoScroll ? 'Auto Scroll On' : 'Auto Scroll Off');
},
toggleDrawing() {
const isDrawingEnabled = this.canvas.style.pointerEvents === 'auto';
this.canvas.style.pointerEvents = isDrawingEnabled ? 'none' : 'auto';
const btn = document.getElementById('pencilBtn');
btn.style.backgroundColor = isDrawingEnabled ? '#BB86FC' : '#4CAF50';
btn.setAttribute('aria-label', isDrawingEnabled ? 'Enable Drawing' : 'Disable Drawing');
},
clearCanvas() {
this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
},
setupUIAutoHide() {
this.resetUITimer();
const container = document.getElementById('presentationContainer');
container.addEventListener('mousemove', () => this.resetUITimer());
container.addEventListener('click', () => this.resetUITimer());
container.addEventListener('keydown', () => this.resetUITimer());
},
resetUITimer() {
this.lastInteraction = Date.now();
if (this.uiTimeout) clearTimeout(this.uiTimeout);
this.showUI();
this.uiTimeout = setTimeout(() => this.fadeUI(), 60000);
},
showUI() {
const bottomBar = document.getElementById('presentationBottomBar');
if (bottomBar) {
bottomBar.style.opacity = '1';
bottomBar.style.pointerEvents = 'auto';
}
this.isUIHidden = false;
},
fadeUI() {
const bottomBar = document.getElementById('presentationBottomBar');
if (bottomBar) {
bottomBar.style.opacity = '0.7';
if (this.uiTimeout) clearTimeout(this.uiTimeout);
this.uiTimeout = setTimeout(() => this.hideUI(), 120000);
}
},
hideUI() {
const bottomBar = document.getElementById('presentationBottomBar');
if (bottomBar) {
bottomBar.style.opacity = '0';
bottomBar.style.pointerEvents = 'none';
}
this.isUIHidden = true;
this.createMinimizedButton();
},
setupMainButtonAutoHide() {
this.resetMainButtonTimer();
document.addEventListener('mousemove', () => this.resetMainButtonTimer());
document.addEventListener('click', () => this.resetMainButtonTimer());
document.addEventListener('keydown', () => this.resetMainButtonTimer());
},
resetMainButtonTimer() {
this.lastInteraction = Date.now();
if (this.mainButtonTimeout) clearTimeout(this.mainButtonTimeout);
this.showMainButton();
this.mainButtonTimeout = setTimeout(() => this.fadeMainButton(), 5000);
},
showMainButton() {
const button = document.getElementById('presentationModeBtn');
if (button && !this.isActive) {
button.style.opacity = '1';
button.style.pointerEvents = 'auto';
}
this.isMainButtonHidden = false;
},
fadeMainButton() {
const button = document.getElementById('presentationModeBtn');
if (button && !this.isActive) {
button.style.opacity = '0.7';
if (this.mainButtonTimeout) clearTimeout(this.mainButtonTimeout);
this.mainButtonTimeout = setTimeout(() => this.hideMainButton(), 5000);
}
},
hideMainButton() {
const button = document.getElementById('presentationModeBtn');
if (button && !this.isActive) {
button.style.opacity = '0';
button.style.pointerEvents = 'none';
}
this.isMainButtonHidden = true;
this.createMainMinimizedButton();
},
createMainMinimizedButton() {
if (document.getElementById('mainMinimizedBtn') || this.isActive) return;
const button = document.createElement('button');
button.id = 'mainMinimizedBtn';
button.innerHTML = '<i class="fas fa-play"></i>';
button.setAttribute('aria-label', 'Start Presentation (P)');
button.style.cssText = `
position: fixed;
top: 5rem;
right: 0.2rem;
background-color: #BB86FC;
color: #000000;
border: none;
width: 1rem;
height: 1rem;
border-radius: 0.2rem;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
font-size: 0.5rem;
opacity: 0.4;
z-index: 1001;
transition: opacity 0.3s ease;
`;
button.addEventListener('click', () => {
this.resetMainButtonTimer();
button.remove();
this.togglePresentationMode();
});
button.addEventListener('mouseenter', () => button.style.opacity = '0.8');
button.addEventListener('mouseleave', () => button.style.opacity = '0.4');
document.body.appendChild(button);
},
setupGlobalKeyboardShortcuts() {
document.addEventListener('keydown', (e) => {
if (this.isActive) return;
if (e.key === 'p' || e.key === 'P') {
if (!e.ctrlKey && !e.altKey && !e.metaKey) {
e.preventDefault();
this.resetMainButtonTimer();
this.togglePresentationMode();
}
}
});
},
setupPresentationKeyboardShortcuts() {
const container = document.getElementById('presentationContainer');
container.addEventListener('keydown', (e) => {
this.resetUITimer();
switch(e.key) {
case 'Escape':
this.exitPresentationMode();
break;
case ' ':
case 'k':
case 'K':
e.preventDefault();
this.togglePlay();
break;
case 'ArrowRight':
case 'l':
case 'L':
e.preventDefault();
if (this.currentElementIndex < this.elements.length - 1) {
this.currentElementIndex++;
this.displayCurrentElements();
}
break;
case 'ArrowLeft':
case 'j':
case 'J':
e.preventDefault();
if (this.currentElementIndex > 0) {
this.currentElementIndex--;
this.displayCurrentElements();
}
break;
case 'ArrowUp':
case 'PageUp':
e.preventDefault();
this.previousPage();
break;
case 'ArrowDown':
case 'PageDown':
e.preventDefault();
this.nextPage();
break;
case 'Home':
e.preventDefault();
this.currentElementIndex = 0;
this.displayCurrentElements();
break;
case 'End':
e.preventDefault();
this.currentElementIndex = this.elements.length - 1;
this.displayCurrentElements();
break;
case 'd':
case 'D':
e.preventDefault();
this.toggleDrawing();
break;
case 'e':
case 'E':
e.preventDefault();
this.toggleEraser();
break;
case 'c':
case 'C':
e.preventDefault();
this.clearCanvas();
break;
case 's':
case 'S':
e.preventDefault();
this.toggleAutoScroll();
break;
case 'f':
case 'F':
e.preventDefault();
if (document.fullscreenElement) {
document.exitFullscreen();
} else {
container.requestFullscreen();
}
break;
case '?':
case 'h':
case 'H':
e.preventDefault();
this.showKeyboardHelp();
break;
}
});
},
showKeyboardHelp() {
const helpDiv = document.getElementById('keyboardHelp');
if (helpDiv) {
helpDiv.remove();
return;
}
const help = document.createElement('div');
help.id = 'keyboardHelp';
help.style.cssText = `
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
background-color: #0a0a0a;
border: 2px solid #BB86FC;
border-radius: 0.5rem;
padding: 2rem;
z-index: 10003;
color: #FFFFFF;
max-width: 90vw;
max-height: 90vh;
overflow-y: auto;
`;
help.innerHTML = `
<h3 style="color: #BB86FC; margin-top: 0;">Keyboard Shortcuts</h3>
<div style="columns: 2; column-gap: 2rem; line-height: 1.8;">
<div><strong>Space/K:</strong> Play/Pause</div>
<div><strong>→/L:</strong> Next Element</div>
<div><strong>←/J:</strong> Previous Element</div>
<div><strong>↑/PgUp:</strong> Previous Page</div>
<div><strong>↓/PgDn:</strong> Next Page</div>
<div><strong>Home:</strong> First Element</div>
<div><strong>End:</strong> Last Element</div>
<div><strong>D:</strong> Toggle Drawing</div>
<div><strong>E:</strong> Toggle Eraser</div>
<div><strong>C:</strong> Clear Canvas</div>
<div><strong>S:</strong> Toggle Auto Scroll</div>
<div><strong>F:</strong> Toggle Fullscreen</div>
<div><strong>P:</strong> Start Presentation (Global)</div>
<div><strong>Esc:</strong> Exit Presentation</div>
<div><strong>?/H:</strong> Show/Hide Help</div>
</div>
<p style="text-align: center; margin-top: 1.5rem;">
<button onclick="this.parentElement.parentElement.remove()" style="background-color: #BB86FC; color: #000; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">Close</button>
</p>
`;
document.getElementById('presentationContainer').appendChild(help);
setTimeout(() => help.remove(), 8000);
},
createMinimizedButton() {
if (document.getElementById('minimizedControlBtn')) return;
const button = document.createElement('button');
button.id = 'minimizedControlBtn';
button.innerHTML = '<i class="fas fa-chevron-up"></i>';
button.setAttribute('aria-label', 'Show Controls');
button.style.cssText = `
position: fixed;
bottom: 0.5rem;
right: 0.5rem;
background-color: #BB86FC;
color: #000000;
border: none;
width: 1.5rem;
height: 1.5rem;
border-radius: 0.2rem;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
font-size: 0.7rem;
opacity: 0.5;
z-index: 10002;
transition: opacity 0.3s ease;
`;
button.addEventListener('click', () => {
this.resetUITimer();
button.remove();
});
button.addEventListener('mouseenter', () => button.style.opacity = '0.8');
button.addEventListener('mouseleave', () => button.style.opacity = '0.5');
document.getElementById('presentationContainer').appendChild(button);
},
toggleEraser() {
this.eraserMode = !this.eraserMode;
const eraserBtn = document.getElementById('eraserBtn');
const pencilBtn = document.getElementById('pencilBtn');
if (this.eraserMode) {
eraserBtn.style.backgroundColor = '#f44336';
pencilBtn.style.backgroundColor = '#555555';
this.canvas.style.cursor = 'crosshair';
} else {
eraserBtn.style.backgroundColor = '#BB86FC';
pencilBtn.style.backgroundColor = '#BB86FC';
this.canvas.style.cursor = 'default';
}
},
previousPage() {
const currentIndex = pagesDataIframe.findIndex(p => p.id === this.currentPageId);
if (currentIndex > 0) {
this.currentPageId = pagesDataIframe[currentIndex - 1].id;
this.extractElements();
this.startPresentation();
document.getElementById('pageInfo').textContent = this.getCurrentPageName();
}
},
nextPage() {
const currentIndex = pagesDataIframe.findIndex(p => p.id === this.currentPageId);
if (currentIndex < pagesDataIframe.length - 1) {
this.currentPageId = pagesDataIframe[currentIndex + 1].id;
this.extractElements();
this.startPresentation();
document.getElementById('pageInfo').textContent = this.getCurrentPageName();
}
}
};
document.addEventListener('DOMContentLoaded', () => {
if (typeof pagesDataIframe !== 'undefined') {
PresentationMode.init();
} else {
setTimeout(() => PresentationMode.init(), 1000);
}
});
