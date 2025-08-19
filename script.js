
        
        (function() {
            let nameInput, logoUrlInput, faviconUrlInput, metaInput, ogTitleInput, ogDescriptionInput, ogImageUrlInput, ogImageWidthInput, ogImageHeightInput, twitterCardTypeSelect, hostingUrlInput, copyrightHolderInput, copyrightYearInput, contactEmailInput, facebookUrlInput, twitterUrlInput, linkedinUrlInput, showScrollToTopRadios;
            let logoPreviewImg, pageList, externalLinkList;
            let openAddPageModalBtn, addPageModalOverlay, modalNewPageNameInput, cancelAddPageBtn, confirmAddPageBtn;
            let editPageModalOverlay, modalEditPageNameInput, cancelEditPageBtn, saveEditPageBtn, currentEditingPageId = null;
            let confirmDeleteModalOverlay, pageToDeleteNameSpan, cancelDeleteBtn, confirmDeleteBtn, pageIdToDelete = null;
            let headerIcons, libraryIcon, editIcon, previewIcon, codeIcon;
            let generatorView, pageEditorView, previewView, codeView, libraryView;
            let pageEditorBackBtn, pageEditorTitle, pageEditorPlusBtn, pageContentEditor, currentPageIdInEditor = null;
            let previewIframe, refreshPreviewBtn, openInNewTabBtn;
            let menuButton, previewFixedSidebar, previewSidebarPageList, mobileSidebarOverlay, mobileSidebar, mobileSidebarPageList;
            let addContentTypeModalOverlay, cancelAddContentTypeBtn, contentTypeList;
            let addHeadingModalOverlay, headingText, headingLevel, cancelAddHeadingBtn, addHeadingBtn;
            let addListModalOverlay, listItems, listTypeRadios, cancelAddListBtn, addListBtn;
            let addTableModalOverlay, tableContentInput, cancelAddTableBtn, addTableBtn;
            let addFormulaModalOverlay, formulaInput, cancelAddFormulaBtn, addFormulaBtn;
            let addUrlModalOverlay, urlLink, urlText, cancelAddUrlBtn, addUrlBtn;
            let addCodeModalOverlay, codeLanguage, codeContent, cancelAddCodeBtn, addCodeBtn;
            let addImageModalOverlay, imageUrl, imageAlt, cancelAddImageBtn, addImageBtn;
            let addPdfModalOverlay, pdfUrl, cancelAddPdfBtn, addPdfBtn;
            let addIframeModalOverlay, iframeUrl, cancelAddIframeBtn, addIframeBtn;
            let addVideoModalOverlay, videoUrl, cancelAddVideoBtn, addVideoBtn;
            let addMapModalOverlay, mapUrl, cancelAddMapBtn, addMapBtn;
            let addBoldModalOverlay, boldText, cancelAddBoldBtn, addBoldBtn;
            let addItalicsModalOverlay, italicsText, cancelAddItalicsBtn, addItalicsBtn;
            let copyCodeBtn, editCodeBtn, loadUrlHtmlBtn;
            let monacoEditor = null;
            let isMonacoEditable = false;
            let messageBox, messageText, messageCloseBtn;
            let loadUrlHtmlModalOverlay, htmlUrlInput, cancelLoadUrlHtmlBtn, confirmLoadUrlHtmlBtn;
            let addQuestionAnswerModalOverlay, qaTypeSelect, qaInputs, qaQuestion, qaAnswer, trueFalseInputs, tfStatement, tfAnswerRadios, fillInBlanksInputs, fibSentence, fibAnswers, multipleChoiceInputs, mcQuestion, mcOptions, mcCorrectAnswer, cancelAddQaBtn, addQaBtn;
            let openAddExternalLinkModalBtn, addExternalLinkModalOverlay, externalLinkDisplayText, externalLinkUrl, cancelAddExternalLinkBtn, addExternalLinkBtn;
            let confirmDeleteExternalLinkModalOverlay, externalLinkToDeleteNameSpan, cancelDeleteExternalLinkBtn, confirmDeleteExternalLinkBtn, externalLinkToDeleteId = null;
            let websiteList, addNewWebsiteBtn, websiteSearchInput, importWebsiteBtn, importFileInput;
            let confirmDeleteWebsiteModalOverlay, websiteToDeleteNameSpan, cancelDeleteWebsiteBtn, confirmDeleteWebsiteBtn, websiteIdToDelete = null;

            const noImageSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 17V7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z'%3E%3C/path%3E%3Cline x1='12' y1='13' x2='12' y2='17'%3E%3C/line%3E%3Cpolyline points='9 10 12 13 15 10'%3E%3C/polyline%3E%3C/svg%3E";

            let pagesData = [];
            let externalLinks = [];
            let currentPreviewPageId = null;
            let allWebsites = [];
            let currentWebsiteId = null;

            function showMessage(message, type = 'info', duration = 3000) {
                if (!messageBox || !messageText || !messageCloseBtn) return;
                messageText.textContent = message;
                messageBox.className = '';
                messageBox.classList.add('show');
                if (type === 'error') messageBox.classList.add('error');
                else if (type === 'success') messageBox.classList.add('success');
                else { messageBox.style.backgroundColor = '#BB86FC'; messageBox.style.color = '#000000'; }
                messageBox.style.display = 'flex';
                if (messageBox.timeoutId) clearTimeout(messageBox.timeoutId);
                messageBox.timeoutId = setTimeout(() => {
                    messageBox.classList.remove('show');
                    setTimeout(() => { messageBox.style.display = 'none'; }, 300);
                }, duration);
            }

            function dismissMessage() {
                if (messageBox) {
                    messageBox.classList.remove('show');
                    if (messageBox.timeoutId) clearTimeout(messageBox.timeoutId);
                    setTimeout(() => { messageBox.style.display = 'none'; }, 300);
                }
            }

            function saveAllWebsitesToLocalStorage() {
                try {
                    localStorage.setItem('arviaAllWebsitesLibrary', JSON.stringify(allWebsites));
                } catch (e) {
                    console.error("Error saving all websites to local storage:", e);
                    showMessage("Error saving website library: " + e.message, 'error');
                }
            }

            function loadAllWebsitesFromLocalStorage() {
                try {
                    const storedData = localStorage.getItem('arviaAllWebsitesLibrary');
                    if (storedData) allWebsites = JSON.parse(storedData);
                    else allWebsites = [];
                } catch (e) {
                    console.error("Error loading all websites from local storage, starting fresh:", e);
                    showMessage("Error loading website library. Starting with a new website.", 'error');
                    allWebsites = [];
                }
            }

            function saveCurrentWebsiteToLibrary() {
                const showScrollToTop = document.querySelector('input[name="showScrollToTop"]:checked')?.value === 'yes';

                const currentWebsiteSettings = {
                    name: nameInput.value,
                    logoUrl: logoUrlInput.value,
                    faviconUrl: faviconUrlInput.value,
                    meta: metaInput.value,
                    ogTitle: ogTitleInput.value,
                    ogDescription: ogDescriptionInput.value,
                    ogImageUrl: ogImageUrlInput.value,
                    ogImageWidth: ogImageWidthInput.value,
                    ogImageHeight: ogImageHeightInput.value,
                    twitterCardType: twitterCardTypeSelect.value,
                    hostingUrl: hostingUrlInput.value,
                    copyrightHolder: copyrightHolderInput.value,
                    copyrightYear: copyrightYearInput.value,
                    contactEmail: contactEmailInput.value,
                    facebookUrl: facebookUrlInput.value,
                    twitterUrl: twitterUrlInput.value,
                    linkedinUrl: linkedinUrlInput.value,
                    showScrollToTop: showScrollToTop
                };

                const currentWebsiteData = {
                    id: currentWebsiteId || crypto.randomUUID(),
                    name: nameInput.value || 'Untitled Website',
                    settings: currentWebsiteSettings,
                    pages: pagesData,
                    externalLinks: externalLinks,
                    currentPreviewPageId: currentPreviewPageId
                };

                const existingIndex = allWebsites.findIndex(w => w.id === currentWebsiteData.id);
                if (existingIndex !== -1) {
                    allWebsites[existingIndex] = currentWebsiteData;
                } else {
                    allWebsites.push(currentWebsiteData);
                    currentWebsiteId = currentWebsiteData.id;
                }
                saveAllWebsitesToLocalStorage();
                renderWebsiteList();
            }

            function loadWebsiteFromLibrary(websiteId) {
                const website = allWebsites.find(w => w.id === websiteId);
                if (website) {
                    currentWebsiteId = website.id;
                    nameInput.value = website.settings.name || '';
                    logoUrlInput.value = website.settings.logoUrl || '';
                    faviconUrlInput.value = website.settings.faviconUrl || '';
                    metaInput.value = website.settings.meta || '';
                    ogTitleInput.value = website.settings.ogTitle || '';
                    ogDescriptionInput.value = website.settings.ogDescription || '';
                    ogImageUrlInput.value = website.settings.ogImageUrl || '';
                    ogImageWidthInput.value = website.settings.ogImageWidth || '';
                    ogImageHeightInput.value = website.settings.ogImageHeight || '';
                    twitterCardTypeSelect.value = website.settings.twitterCardType || 'summary';
                    hostingUrlInput.value = website.settings.hostingUrl || '';
                    copyrightHolderInput.value = website.settings.copyrightHolder || '';
                    copyrightYearInput.value = website.settings.copyrightYear || new Date().getFullYear();
                    contactEmailInput.value = website.settings.contactEmail || '';
                    facebookUrlInput.value = website.settings.facebookUrl || '';
                    twitterUrlInput.value = website.settings.twitterUrl || '';
                    linkedinUrlInput.value = website.settings.linkedinUrl || '';
                    document.querySelector(`input[name="showScrollToTop"][value="${website.settings.showScrollToTop ? 'yes' : 'no'}"]`).checked = true;

                    pagesData = website.pages || [];
                    externalLinks = website.externalLinks || [];
                    currentPreviewPageId = website.currentPreviewPageId;

                    renderPages();
                    renderExternalLinks();
                    updateLogoPreview();
                    openPreview();
                    showView(generatorView);
                    editIcon.classList.add('selected');
                    libraryIcon.classList.remove('selected');
                    previewIcon.classList.remove('selected');
                    codeIcon.classList.remove('selected');
                    showMessage(`Website "${escapeHtml(website.name)}" loaded successfully!`, 'success');
                } else {
                    showMessage("Website not found in library.", 'error');
                }
            }
            
            function exportWebsite(websiteId) {
                const website = allWebsites.find(w => w.id === websiteId);
                if (website) {
                    const dataStr = JSON.stringify(website, null, 2);
                    const dataBlob = new Blob([dataStr], {type: "application/json"});
                    const url = URL.createObjectURL(dataBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${website.name || 'Untitled Website'}.arvia.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    showMessage(`Exporting "${escapeHtml(website.name)}"...`, 'success');
                } else {
                    showMessage("Could not find website to export.", 'error');
                }
            }

            function importWebsite() {
                importFileInput.click();
            }

            function handleImportFile(event) {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        
                        if (!importedData.id || !importedData.name || !importedData.settings || !importedData.pages) {
                            throw new Error("Invalid or corrupted file format.");
                        }

                        const existingIndex = allWebsites.findIndex(w => w.id === importedData.id);
                        if (existingIndex !== -1) {
                            allWebsites[existingIndex] = importedData;
                             showMessage(`Website "${escapeHtml(importedData.name)}" updated from import.`, 'success');
                        } else {
                            allWebsites.push(importedData);
                             showMessage(`Website "${escapeHtml(importedData.name)}" imported successfully.`, 'success');
                        }
                        
                        saveAllWebsitesToLocalStorage();
                        renderWebsiteList();

                    } catch (err) {
                        console.error("Import error:", err);
                        showMessage(`Import failed: ${err.message}`, 'error');
                    } finally {
                        importFileInput.value = '';
                    }
                };
                reader.readAsText(file);
            }

            function deleteWebsiteFromLibraryConfirmed() {
                if (websiteIdToDelete) {
                    const deletedWebsiteName = allWebsites.find(w => w.id === websiteIdToDelete)?.name || 'Unknown Website';
                    allWebsites = allWebsites.filter(w => w.id !== websiteIdToDelete);
                    saveAllWebsitesToLocalStorage();
                    renderWebsiteList();
                    closeConfirmDeleteWebsiteModal();
                    if (currentWebsiteId === websiteIdToDelete) {
                        startNewWebsite();
                        showMessage(`Website "${escapeHtml(deletedWebsiteName)}" deleted and a new website started.`, 'success');
                    } else {
                        showMessage(`Website "${escapeHtml(deletedWebsiteName)}" deleted successfully!`, 'success');
                    }
                }
            }

            function startNewWebsite() {
                currentWebsiteId = crypto.randomUUID();
                nameInput.value = 'My New Website';
                logoUrlInput.value = '';
                faviconUrlInput.value = '';
                metaInput.value = '';
                ogTitleInput.value = '';
                ogDescriptionInput.value = '';
                ogImageUrlInput.value = '';
                ogImageWidthInput.value = '';
                ogImageHeightInput.value = '';
                twitterCardTypeSelect.value = 'summary';
                hostingUrlInput.value = '';
                copyrightHolderInput.value = '';
                copyrightYearInput.value = new Date().getFullYear();
                contactEmailInput.value = '';
                facebookUrlInput.value = '';
                twitterUrlInput.value = '';
                linkedinUrlInput.value = '';
                document.querySelector('input[name="showScrollToTop"][value="yes"]').checked = true;
                pagesData = getDefaultPages();
                externalLinks = [];
                currentPreviewPageId = pagesData.find(p => p.isDefault)?.id || pagesData[0]?.id || null;
                
                saveCurrentWebsiteToLibrary();
                renderPages();
                renderExternalLinks();
                updateLogoPreview();
                openPreview();
                showMessage("New website started!", 'info');
            }

            function renderWebsiteList(filter = '') {
                if (!websiteList) return;
                websiteList.innerHTML = '';
                const filteredWebsites = allWebsites.filter(website =>
                    website.name.toLowerCase().includes(filter.toLowerCase())
                );
                if (filteredWebsites.length === 0) {
                    websiteList.innerHTML = '<p class="modal-message">No websites found. Add one or import a project file!</p>';
                    return;
                }
                filteredWebsites.forEach(website => {
                    const websiteItem = document.createElement('div');
                    websiteItem.className = 'website-item';
                    websiteItem.dataset.id = website.id;
                    websiteItem.innerHTML = `<span class="website-name">${escapeHtml(website.name)}</span>
                    <div class="website-actions">
                        <span class="website-action-icon" data-action="open-website" data-id="${website.id}" aria-label="Open Website"><i class="fas fa-folder-open"></i></span>
                        <span class="website-action-icon" data-action="export-website" data-id="${website.id}" aria-label="Export Website"><i class="fas fa-file-export"></i></span>
                        <span class="website-action-icon" data-action="delete-website" data-id="${website.id}" aria-label="Delete Website"><i class="fas fa-trash-alt"></i></span>
                    </div>`;
                    websiteList.appendChild(websiteItem);
                });
            }

            function openLibraryView() {
                renderWebsiteList();
                showView(libraryView);
            }

            function openConfirmDeleteWebsiteModal(id) {
                const website = allWebsites.find(w => w.id === id);
                if (website && confirmDeleteWebsiteModalOverlay && websiteToDeleteNameSpan) {
                    websiteIdToDelete = id;
                    websiteToDeleteNameSpan.textContent = website.name;
                    confirmDeleteWebsiteModalOverlay.classList.add('show');
                } else {
                    showMessage("Website not found or modal elements missing.", 'error');
                }
            }

            function closeConfirmDeleteWebsiteModal() {
                if (confirmDeleteWebsiteModalOverlay) confirmDeleteWebsiteModalOverlay.classList.remove('show');
                websiteIdToDelete = null;
            }

            function getDefaultPages() {
                return [
                    { id: 'home', name: 'Home', order: 1, isDefault: true, content: '<h1>Welcome to our Homepage!</h1><p>This is the main page of your website. You can add more content here.</p><p>Feel free to edit this text in the editor view.</p><div class="formula-block-iframe">$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$</div>' },
                    { id: 'about-us', name: 'About Us', order: 2, isDefault: false, content: '<h1>About Our Company</h1><p>We are a team dedicated to providing excellent services.</p><p>Our mission is to empower users to create stunning websites effortlessly.</p>' },
                    { id: 'services', name: 'Services', order: 3, isDefault: false, content: '<h1>Our Services</h1><p>We offer web design, development, and hosting solutions.</p><p>Contact us for custom solutions tailored to your needs.</p>' },
                    { id: 'contact', name: 'Contact', order: 4, isDefault: false, content: '<h1>Contact Us</h1><p>Reach out to us via email: info@arvia.com</p><p>Or call us at: 123-456-7890</p>' }
                ];
            }

            function openAddPageModal() {
                if (addPageModalOverlay && modalNewPageNameInput) {
                    addPageModalOverlay.classList.add('show');
                    modalNewPageNameInput.value = '';
                    modalNewPageNameInput.focus();
                }
            }

            function closeAddPageModal() {
                if (addPageModalOverlay) addPageModalOverlay.classList.remove('show');
            }

            function openEditPageModal(id) {
                const page = pagesData.find(p => p.id === id);
                if (page && editPageModalOverlay && modalEditPageNameInput) {
                    currentEditingPageId = id;
                    modalEditPageNameInput.value = page.name;
                    editPageModalOverlay.classList.add('show');
                    modalEditPageNameInput.focus();
                } else {
                    showMessage("Page not found or modal elements missing.", 'error');
                }
            }

            function closeEditPageModal() {
                if (editPageModalOverlay) editPageModalOverlay.classList.remove('show');
                currentEditingPageId = null;
            }

            function openConfirmDeleteModal(id) {
                const page = pagesData.find(p => p.id === id);
                if (page && confirmDeleteModalOverlay && pageToDeleteNameSpan) {
                    pageIdToDelete = id;
                    pageToDeleteNameSpan.textContent = page.name;
                    confirmDeleteModalOverlay.classList.add('show');
                } else {
                    showMessage("Page not found or modal elements missing.", 'error');
                }
            }

            function closeConfirmDeleteModal() {
                if (confirmDeleteModalOverlay) confirmDeleteModalOverlay.classList.remove('show');
                pageIdToDelete = null;
            }

            function openMobileSidebar() {
                if (mobileSidebarOverlay) mobileSidebarOverlay.classList.add('show');
            }

            function closeMobileSidebar() {
                if (mobileSidebarOverlay) mobileSidebarOverlay.classList.remove('show');
            }

            function openAddContentTypeModal() {
                if (addContentTypeModalOverlay) addContentTypeModalOverlay.classList.add('show');
            }

            function closeAddContentTypeModal() {
                if (addContentTypeModalOverlay) addContentTypeModalOverlay.classList.remove('show');
            }

            function openSpecificContentModal(modalOverlay) {
                closeAddContentTypeModal();
                if (modalOverlay) {
                    modalOverlay.classList.add('show');
                    const inputElement = modalOverlay.querySelector('.modal-input, .textarea-input, .modal-select');
                    if (inputElement) {
                        inputElement.value = '';
                        if (inputElement.tagName === 'SELECT') inputElement.value = inputElement.options[0].value;
                        const firstRadio = modalOverlay.querySelector('input[type="radio"]');
                        if (firstRadio) firstRadio.checked = true;
                        inputElement.focus();
                    }
                    if (modalOverlay === addQuestionAnswerModalOverlay) showQaInputs('qa');
                }
            }

            function closeSpecificContentModal(modalOverlay) {
                if (modalOverlay) modalOverlay.classList.remove('show');
            }

            function addContentToEditor(contentHtml) {
                if (pageContentEditor) {
                    pageContentEditor.value += '\n' + contentHtml;
                } else {
                    showMessage("Page content editor not found.", 'error');
                }
            }

            function addHeadingToEditor() {
                if (!headingText || !headingLevel || !addHeadingModalOverlay) return;
                const text = headingText.value.trim();
                const level = headingLevel.value;
                if (text) {
                    addContentToEditor(`<${level}>${escapeHtml(text)}</${level}>`);
                    showMessage("Heading added.", 'success', 1500);
                } else {
                    showMessage("Heading text cannot be empty.", 'error');
                }
                closeSpecificContentModal(addHeadingModalOverlay);
            }

            function addListToEditor() {
                if (!listItems || !addListModalOverlay) return;
                const items = listItems.value.split('\n').map(item => item.trim()).filter(item => item !== '');
                const type = document.querySelector('input[name="listType"]:checked')?.value;
                if (items.length > 0 && type) {
                    const listHtml = `<${type}>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</${type}>`;
                    addContentToEditor(listHtml);
                    showMessage("List added.", 'success', 1500);
                } else {
                    showMessage("List items or type cannot be empty.", 'error');
                }
                closeSpecificContentModal(addListModalOverlay);
            }

            function addTableToEditor() {
                if (!tableContentInput || !addTableModalOverlay) return;
                const tableData = tableContentInput.value.trim();
                const rows = tableData.split('\n').map(row => row.split(';').map(cell => cell.trim()));
                if (rows.length === 0 || rows[0].length === 0) {
                    showMessage("Table data is empty or malformed.", 'error');
                    closeSpecificContentModal(addTableModalOverlay);
                    return;
                }
                let tableHtml = '<table><thead><tr>';
                rows[0].forEach(header => { tableHtml += `<th>${escapeHtml(header)}</th>`; });
                tableHtml += '</tr></thead><tbody>';
                for (let i = 1; i < rows.length; i++) {
                    tableHtml += '<tr>';
                    rows[i].forEach(cell => { tableHtml += `<td>${escapeHtml(cell)}</td>`; });
                    tableHtml += '</tr>';
                }
                tableHtml += '</tbody></table>';
                addContentToEditor(tableHtml);
                showMessage("Table added.", 'success', 1500);
                closeSpecificContentModal(addTableModalOverlay);
            }

            function addFormulaToEditor() {
                if (!formulaInput || !addFormulaModalOverlay) return;
                const formula = formulaInput.value.trim();
                if (formula) {
                    addContentToEditor(`<div class="formula-block-iframe">$$\\text{${escapeHtml(formula)}}$$</div>`);
                    showMessage("Formula added.", 'success', 1500);
                } else {
                    showMessage("Formula cannot be empty.", 'error');
                }
                closeSpecificContentModal(addFormulaModalOverlay);
            }

            function addUrlToEditor() {
                if (!urlLink || !urlText || !addUrlModalOverlay) return;
                const link = urlLink.value.trim();
                const text = urlText.value.trim() || link;
                if (link) {
                    addContentToEditor(`<p><a href="${escapeHtml(link)}" target="_blank">${escapeHtml(text)}</a></p>`);
                    showMessage("URL added.", 'success', 1500);
                } else {
                    showMessage("URL cannot be empty.", 'error');
                }
                closeSpecificContentModal(addUrlModalOverlay);
            }

            function addCodeToEditor() {
                if (!codeLanguage || !codeContent || !addCodeModalOverlay) return;
                const lang = codeLanguage.value.trim() || 'plaintext';
                const code = codeContent.value;
                if (code) {
                    addContentToEditor(`<pre><code class="language-${escapeHtml(lang)}">${escapeHtml(code)}</code></pre>`);
                    showMessage("Code block added.", 'success', 1500);
                } else {
                    showMessage("Code content cannot be empty.", 'error');
                }
                closeSpecificContentModal(addCodeModalOverlay);
            }

            function addImageToEditor() {
                if (!imageUrl || !imageAlt || !addImageModalOverlay) return;
                const src = imageUrl.value.trim();
                const alt = imageAlt.value.trim();
                if (src) {
                    addContentToEditor(`<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" style="max-width: 100%; height: auto; border-radius: 0.3125rem; margin-bottom: 0.9375rem;">`);
                    showMessage("Image added.", 'success', 1500);
                } else {
                    showMessage("Image URL cannot be empty.", 'error');
                }
                closeSpecificContentModal(addImageModalOverlay);
            }

            function addPdfToEditor() {
                if (!pdfUrl || !addPdfModalOverlay) return;
                const src = pdfUrl.value.trim();
                if (src) {
                    addContentToEditor(`<iframe src="${escapeHtml(src)}" loading="lazy" style="width: 100%; height: 37.5rem; border: none; border-radius: 0.3125rem; margin-bottom: 0.9375rem;"></iframe>`);
                    showMessage("PDF added.", 'success', 1500);
                } else {
                    showMessage("PDF URL cannot be empty.", 'error');
                }
                closeSpecificContentModal(addPdfModalOverlay);
            }

            function addIframeToEditor() {
                if (!iframeUrl || !addIframeModalOverlay) return;
                const src = iframeUrl.value.trim();
                if (src) {
                    addContentToEditor(`<iframe src="${escapeHtml(src)}" loading="lazy" style="width: 100%; height: 25rem; border: none; border-radius: 0.3125rem; margin-bottom: 0.9375rem;"></iframe>`);
                    showMessage("Iframe added.", 'success', 1500);
                } else {
                    showMessage("Iframe URL cannot be empty.", 'error');
                }
                closeSpecificContentModal(addIframeModalOverlay);
            }

            function addVideoToEditor() {
                if (!videoUrl || !addVideoModalOverlay) return;
                const src = videoUrl.value.trim();
                if (src) {
                    addContentToEditor(`<iframe src="${escapeHtml(src)}" loading="lazy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width: 100%; height: 25rem; border: none; border-radius: 0.3125rem; margin-bottom: 0.9375rem;"></iframe>`);
                    showMessage("Video added.", 'success', 1500);
                } else {
                    showMessage("Video URL cannot be empty.", 'error');
                }
                closeSpecificContentModal(addVideoModalOverlay);
            }

            function addMapToEditor() {
                if (!mapUrl || !addMapModalOverlay) return;
                const src = mapUrl.value.trim();
                if (src) {
                    addContentToEditor(`<iframe src="${escapeHtml(src)}" loading="lazy" style="width: 100%; height: 28.125rem; border: none; border-radius: 0.3125rem; margin-bottom: 0.9375rem;" allowfullscreen="" referrerpolicy="no-referrer-when-downgrade"></iframe>`);
                    showMessage("Map added.", 'success', 1500);
                } else {
                    showMessage("Map URL cannot be empty.", 'error');
                }
                closeSpecificContentModal(addMapModalOverlay);
            }

            function addBoldToEditor() {
                if (!boldText || !addBoldModalOverlay) return;
                const text = boldText.value.trim();
                if (text) {
                    addContentToEditor(`<strong>${escapeHtml(text)}</strong>`);
                    showMessage("Bold text added.", 'success', 1500);
                } else {
                    showMessage("Text to make bold cannot be empty.", 'error');
                }
                closeSpecificContentModal(addBoldModalOverlay);
            }

            function addItalicsToEditor() {
                if (!italicsText || !addItalicsModalOverlay) return;
                const text = italicsText.value.trim();
                if (text) {
                    addContentToEditor(`<em>${escapeHtml(text)}</em>`);
                    showMessage("Italic text added.", 'success', 1500);
                } else {
                    showMessage("Text to make italic cannot be empty.", 'error');
                }
                closeSpecificContentModal(addItalicsModalOverlay);
            }

            function showQaInputs(type) {
                [qaInputs, trueFalseInputs, fillInBlanksInputs, multipleChoiceInputs].forEach(el => { if (el) el.classList.add('hidden'); });
                if (qaQuestion) qaQuestion.value = '';
                if (qaAnswer) qaAnswer.value = '';
                if (tfStatement) tfStatement.value = '';
                if (fibSentence) fibSentence.value = '';
                if (fibAnswers) fibAnswers.value = '';
                if (mcQuestion) mcQuestion.value = '';
                if (mcOptions) mcOptions.value = '';
                if (mcCorrectAnswer) mcCorrectAnswer.value = '';

                switch (type) {
                    case 'qa': if (qaInputs) qaInputs.classList.remove('hidden'); if (qaQuestion) qaQuestion.focus(); break;
                    case 'true-false': if (trueFalseInputs) trueFalseInputs.classList.remove('hidden'); if (tfStatement) tfStatement.focus(); break;
                    case 'fill-in-blanks': if (fillInBlanksInputs) fillInBlanksInputs.classList.remove('hidden'); if (fibSentence) fibSentence.focus(); break;
                    case 'multiple-choice': if (multipleChoiceInputs) multipleChoiceInputs.classList.remove('hidden'); if (mcQuestion) mcQuestion.focus(); break;
                }
            }

            function addQuestionAnswerToEditor() {
                const type = qaTypeSelect.value;
                let contentHtml = '';
                switch (type) {
                    case 'qa':
                        const q = qaQuestion.value.trim();
                        const a = qaAnswer.value.trim();
                        if (q && a) contentHtml = `<div class="qa-block" data-qa-type="qa" data-question="${escapeHtml(q)}" data-answer="${escapeHtml(a)}"><p><strong>Q:</strong> ${escapeHtml(q)}</p><p><strong>A:</strong> ${escapeHtml(a)}</p></div>`;
                        else { showMessage("Question and Answer cannot be empty.", 'error'); return; }
                        break;
                    case 'true-false':
                        const statement = tfStatement.value.trim();
                        const tfAnswer = document.querySelector('input[name="tfAnswer"]:checked')?.value;
                        if (statement && tfAnswer) contentHtml = `<div class="qa-block" data-qa-type="true-false" data-statement="${escapeHtml(statement)}" data-answer="${escapeHtml(tfAnswer)}"><p><strong>Statement:</strong> ${escapeHtml(statement)}</p><p><strong>Answer:</strong> ${escapeHtml(tfAnswer)}</p></div>`;
                        else { showMessage("Statement and answer cannot be empty.", 'error'); return; }
                        break;
                    case 'fill-in-blanks':
                        const sentence = fibSentence.value.trim();
                        const answers = fibAnswers.value.trim().split(',').map(s => s.trim()).filter(s => s !== '');
                        if (sentence && answers.length > 0) {
                            let formattedSentence = escapeHtml(sentence).replace(/\[BLANK\]/g, '<span style="text-decoration: underline; font-weight: bold;">[BLANK]</span>');
                            contentHtml = `<div class="qa-block" data-qa-type="fill-in-blanks" data-sentence="${escapeHtml(sentence)}" data-answers="${escapeHtml(JSON.stringify(answers))}"><p>${formattedSentence}</p><p><strong>Answers:</strong> ${answers.map(a => escapeHtml(a)).join(', ')}</p></div>`;
                        } else { showMessage("Sentence and answers cannot be empty.", 'error'); return; }
                        break;
                    case 'multiple-choice':
                        const mcQ = mcQuestion.value.trim();
                        const mcOpts = mcOptions.value.trim().split(',').map(s => s.trim()).filter(s => s !== '');
                        const mcCorrect = mcCorrectAnswer.value.trim();
                        if (mcQ && mcOpts.length > 0 && mcCorrect) {
                            let optionsHtml = mcOpts.map(opt => `<li>${escapeHtml(opt)}</li>`).join('');
                            contentHtml = `<div class="qa-block" data-qa-type="multiple-choice" data-question="${escapeHtml(mcQ)}" data-options="${escapeHtml(JSON.stringify(mcOpts))}" data-answer="${escapeHtml(mcCorrect)}"><p><strong>Q:</strong> ${escapeHtml(mcQ)}</p><ul>${optionsHtml}</ul><p><strong>Correct Answer:</strong> ${escapeHtml(mcCorrect)}</p></div>`;
                        } else { showMessage("Question, options, and correct answer cannot be empty.", 'error'); return; }
                        break;
                }
                if (contentHtml) {
                    addContentToEditor(contentHtml);
                    showMessage("Question added successfully!", 'success', 1500);
                }
                closeSpecificContentModal(addQuestionAnswerModalOverlay);
            }

            function escapeHtml(unsafe) {
                return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
            }

            function updateLogoPreview() {
                if (!logoUrlInput || !logoPreviewImg) return;
                const url = logoUrlInput.value.trim();
                if (url) {
                    logoPreviewImg.src = url;
                    logoPreviewImg.onerror = () => { logoPreviewImg.src = noImageSvg; logoPreviewImg.style.objectFit = 'contain'; };
                } else {
                    logoPreviewImg.src = noImageSvg; logoPreviewImg.onerror = null; logoPreviewImg.style.objectFit = 'contain';
                }
                saveCurrentWebsiteToLibrary();
            }

            function extractUrlsFromContent(content) {
                const urls = new Set();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                tempDiv.querySelectorAll('img').forEach(img => { if (img.src) urls.add({ url: img.src, type: 'Image' }); });
                tempDiv.querySelectorAll('iframe').forEach(iframe => { if (iframe.src) urls.add({ url: iframe.src, type: 'Iframe/Embed' }); });
                tempDiv.querySelectorAll('a').forEach(a => { if (a.href) urls.add({ url: a.href, type: 'Link' }); });
                return Array.from(urls);
            }

            function generateKeywordsFromContent() {
                const allText = pagesData.map(page => {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = page.content;
                    return tempDiv.textContent || '';
                }).join(' ').toLowerCase();

                const words = allText.match(/\b\w+\b/g) || [];
                const stopWords = new Set(["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by", "of", "in", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "shall", "should", "can", "could", "may", "might", "must", "it", "its", "he", "she", "they", "we", "you", "your", "my", "our", "their", "this", "that", "these", "those", "here", "there", "when", "where", "why", "how", "what", "which", "who", "whom", "whose", "if", "then", "than", "as", "so", "such", "too", "very", "just", "don", "should", "now"]);

                const wordFrequencies = {};
                words.forEach(word => {
                    if (word.length > 2 && !stopWords.has(word)) {
                        wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
                    }
                });

                const sortedWords = Object.keys(wordFrequencies).sort((a, b) => wordFrequencies[b] - wordFrequencies[a]);
                return sortedWords.slice(0, 15).join(', ');
            }

            function generateAutoDescription() {
                if (metaInput.value.trim() !== '') return metaInput.value.trim();

                for (const page of pagesData) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = page.content;
                    const paragraphs = tempDiv.querySelectorAll('p');
                    for (const p of paragraphs) {
                        const text = p.textContent.trim();
                        if (text.length > 50) {
                            return text.substring(0, 160) + (text.length > 160 ? '...' : '');
                        }
                    }
                }
                return `Welcome to ${nameInput.value || 'My ARvia Website'}. Explore our pages to learn more.`;
            }

            function generateWebsiteInfoPage() {
                const websiteName = nameInput.value.trim();
                const logoUrl = logoUrlInput.value.trim();
                const faviconUrl = faviconUrlInput.value.trim();
                const metaDescription = metaInput.value.trim();
                const copyrightHolder = copyrightHolderInput.value.trim();
                const copyrightYear = copyrightYearInput.value.trim();
                const contactEmail = contactEmailInput.value.trim();
                const facebookUrl = facebookUrlInput.value.trim();
                const twitterUrl = twitterUrlInput.value.trim();
                const linkedinUrl = linkedinUrlInput.value.trim();
                const hostingUrl = hostingUrlInput.value.trim();
                let allResources = new Map();
                if (faviconUrl) allResources.set(faviconUrl, 'Favicon');
                if (logoUrl) allResources.set(logoUrl, 'Website Logo');
                pagesData.filter(p => p.id !== '_websiteInfoPage').forEach(page => {
                    const pageUrls = extractUrlsFromContent(page.content);
                    pageUrls.forEach(resource => { allResources.set(resource.url, resource.type); });
                });
                let resourcesHtml = '';
                if (allResources.size > 0) {
                    resourcesHtml += '<ul style="list-style: disc; padding-left: 20px;">';
                    allResources.forEach((type, url) => {
                        const displayUrl = url.length > 50 ? url.substring(0, 25) + '...' + url.substring(url.length - 20) : url;
                        resourcesHtml += `<li style="margin-bottom: 5px;"><strong>${escapeHtml(type)}:</strong> <a href="${escapeHtml(url)}" target="_blank" style="color: #BB86FC; text-decoration: underline;"><span style="display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(displayUrl)}</span></a></li>`;
                    });
                    resourcesHtml += '</ul>';
                } else {
                    resourcesHtml += '<p>No external resources (images, videos, links, iframes, favicon) found in page content.</p>';
                }
                let infoContent = `<h1>Website Information</h1>`;
                if (websiteName) infoContent += `<h2>General Details</h2><p><strong>Website Name:</strong> ${escapeHtml(websiteName)}</p>`;
                if (logoUrl) infoContent += `<p><strong>Logo URL:</strong> <a href="${escapeHtml(logoUrl)}" target="_blank" style="color: #BB86FC; text-decoration: underline;"><span style="display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(logoUrl)}</span></a></p>`;
                if (faviconUrl) infoContent += `<p><strong>Favicon URL:</strong> <a href="${escapeHtml(faviconUrl)}" target="_blank" style="color: #BB86FC; text-decoration: underline;"><span style="display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(faviconUrl)}</span></a></p>`;
                if (metaDescription) infoContent += `<p><strong>Meta Description:</strong> ${escapeHtml(metaDescription)}</p>`;
                if (hostingUrl) infoContent += `<p><strong>Hosting URL:</strong> <a href="${escapeHtml(hostingUrl)}" target="_blank" style="color: #BB86FC; text-decoration: underline;"><span style="display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(hostingUrl)}</span></a></p>`;
                if (copyrightHolder || copyrightYear) {
                    infoContent += `<h2>Copyright Information</h2>`;
                    if (copyrightHolder) infoContent += `<p><strong>Copyright Holder:</strong> ${escapeHtml(copyrightHolder)}</p>`;
                    if (copyrightYear) infoContent += `<p><strong>Copyright Year:</strong> ${escapeHtml(copyrightYear)}</p>`;
                }
                if (contactEmail || facebookUrl || twitterUrl || linkedinUrl) {
                    infoContent += `<h2>Contact & Social Media</h2>`;
                    if (contactEmail) infoContent += `<p><strong>Contact Email:</strong> <a href="mailto:${escapeHtml(contactEmail)}" style="color: #BB86FC; text-decoration: underline;">${escapeHtml(contactEmail)}</a></p>`;
                    if (facebookUrl) infoContent += `<p><strong>Facebook:</strong> <a href="${escapeHtml(facebookUrl)}" target="_blank" style="color: #BB86FC; text-decoration: underline;"><span style="display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(facebookUrl)}</span></a></p>`;
                    if (twitterUrl) infoContent += `<p><strong>Twitter:</strong> <a href="${escapeHtml(twitterUrl)}" target="_blank" style="color: #BB86FC; text-decoration: underline;"><span style="display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(twitterUrl)}</span></a></p>`;
                    if (linkedinUrl) infoContent += `<p><strong>LinkedIn:</strong> <a href="${escapeHtml(linkedinUrl)}" target="_blank" style="color: #BB86FC; text-decoration: underline;"><span style="display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(linkedinUrl)}</span></a></p>`;
                }
                infoContent += `<h2>Used Resources (URLs)</h2>${resourcesHtml}`;
                const existingInfoPageIndex = pagesData.findIndex(p => p.id === '_websiteInfoPage');
                if (existingInfoPageIndex !== -1) {
                    pagesData[existingInfoPageIndex].content = infoContent;
                } else {
                    const newOrder = pagesData.length > 0 ? Math.max(...pagesData.map(p => p.order)) + 1 : 1;
                    pagesData.push({ id: '_websiteInfoPage', name: 'Website Info', order: newOrder, isDefault: false, content: infoContent });
                }
            }

            function renderPages() {
                if (!pageList) return;
                pageList.innerHTML = '';
                pagesData.sort((a, b) => a.order - b.order);
                pagesData.forEach((page, index) => {
                    const pageItem = document.createElement('div');
                    pageItem.className = 'page-item';
                    pageItem.dataset.id = page.id;
                    pageItem.innerHTML = `
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="radio" name="defaultPage" class="default-page-radio" value="${page.id}" ${page.isDefault ? 'checked' : ''}>
                            <span class="page-name">${escapeHtml(page.name)}</span>
                        </label>
                        <div class="page-actions">
                            <span class="action-icon sort-up" data-action="move-up" data-id="${page.id}" aria-label="Move page up"><i class="fas fa-sort-up sort-icon"></i></span>
                            <span class="action-icon sort-down" data-action="move-down" data-id="${page.id}" aria-label="Move page down"><i class="fas fa-sort-down sort-icon"></i></span>
                            <span class="action-icon page-order">${index + 1}</span>
                            <span class="action-icon edit-page" data-action="edit" data-id="${page.id}" aria-label="Edit page name"><i class="fas fa-pen"></i></span>
                            <span class="action-icon delete-page" data-action="delete" data-id="${page.id}" aria-label="Delete page"><i class="fas fa-trash-alt"></i></span>
                        </div>`;
                    pageList.appendChild(pageItem);
                });
                pageList.querySelectorAll('input[name="defaultPage"]').forEach(radio => {
                    radio.addEventListener('change', (event) => {
                        setDefaultPage(event.target.value);
                    });
                });
                saveCurrentWebsiteToLibrary();
            }

            function setDefaultPage(pageId) {
                pagesData.forEach(p => {
                    p.isDefault = (p.id === pageId);
                });
                renderPages();
                openPreview();
                showMessage(`Page "${escapeHtml(pagesData.find(p => p.id === pageId)?.name || '')}" set as default.`, 'success');
            }

            function addPage(name) {
                if (name.trim()) {
                    const newId = crypto.randomUUID();
                    const newOrder = pagesData.length > 0 ? Math.max(...pagesData.map(p => p.order)) + 1 : 1;
                    const newPage = { id: newId, name: name.trim(), order: newOrder, isDefault: false, content: '' };
                    
                    if (pagesData.length === 0) {
                        newPage.isDefault = true;
                    }
                    pagesData.push(newPage);
                    renderPages();
                    closeAddPageModal();
                    openPreview();
                    showMessage(`Page "${escapeHtml(name.trim())}" added successfully!`, 'success');
                } else {
                    showMessage("Page name cannot be empty.", 'error');
                }
            }

            function saveEditedPage() {
                if (currentEditingPageId) {
                    const newName = modalEditPageNameInput.value.trim();
                    const page = pagesData.find(p => p.id === currentEditingPageId);
                    if (page && newName !== '') {
                        page.name = newName;
                        renderPages();
                        closeEditPageModal();
                        openPreview();
                        showMessage(`Page name changed to "${escapeHtml(newName)}" successfully!`, 'success');
                    } else if (newName === '') {
                        showMessage("Page name cannot be empty.", 'error');
                    }
                }
            }

            function deletePageConfirmed() {
                if (pageIdToDelete) {
                    const deletedPageName = pagesData.find(p => p.id === pageIdToDelete)?.name || 'Unknown Page';
                    pagesData = pagesData.filter(p => p.id !== pageIdToDelete);
                    pagesData.forEach((p, i) => p.order = i + 1);
                    
                    if (!pagesData.some(p => p.isDefault) && pagesData.length > 0) {
                        pagesData[0].isDefault = true;
                    } else if (pagesData.length === 0) {
                        currentPreviewPageId = null;
                    }

                    renderPages();
                    closeConfirmDeleteModal();
                    if (pagesData.length > 0 && currentPreviewPageId === pageIdToDelete) {
                        currentPreviewPageId = pagesData.find(p => p.isDefault)?.id || pagesData[0]?.id || null;
                    } else if (pagesData.length === 0) {
                        currentPreviewPageId = null;
                    }
                    openPreview();
                    showMessage(`Page "${escapeHtml(deletedPageName)}" deleted successfully!`, 'success');
                }
            }

            function movePage(id, direction) {
                const index = pagesData.findIndex(p => p.id === id);
                if (index === -1) return;
                const targetIndex = direction === 'up' ? index - 1 : index + 1;
                if (targetIndex >= 0 && targetIndex < pagesData.length) {
                    [pagesData[index].order, pagesData[targetIndex].order] = [pagesData[targetIndex].order, pagesData[index].order];
                    pagesData.sort((a, b) => a.order - b.order);
                    renderPages();
                    openPreview();
                    showMessage(`Page "${escapeHtml(pagesData[index].name)}" moved ${direction}.`, 'info');
                }
            }

            function renderExternalLinks() {
                if (!externalLinkList) return;
                externalLinkList.innerHTML = '';
                if (externalLinks.length === 0) {
                    externalLinkList.innerHTML = '<p class="modal-message">No external links added yet.</p>';
                    return;
                }
                externalLinks.forEach(link => {
                    const linkItem = document.createElement('div');
                    linkItem.className = 'external-link-item';
                    linkItem.dataset.id = link.id;
                    linkItem.innerHTML = `
                        <span class="external-link-name">${escapeHtml(link.displayText)}</span>
                        <div class="external-link-actions">
                            <span class="action-icon delete-link" data-action="delete-external-link" data-id="${link.id}" aria-label="Delete link"><i class="fas fa-trash-alt"></i></span>
                        </div>`;
                    externalLinkList.appendChild(linkItem);
                });
                saveCurrentWebsiteToLibrary();
            }

            function addExternalLink() {
                if (!externalLinkDisplayText || !externalLinkUrl || !addExternalLinkModalOverlay) return;
                const displayText = externalLinkDisplayText.value.trim();
                const url = externalLinkUrl.value.trim();
                if (displayText && url) {
                    externalLinks.push({ id: crypto.randomUUID(), displayText, url });
                    renderExternalLinks();
                    closeSpecificContentModal(addExternalLinkModalOverlay);
                    openPreview();
                    showMessage("External link added.", 'success', 1500);
                } else {
                    showMessage("Display text and URL cannot be empty.", 'error');
                }
            }

            function deleteExternalLinkConfirmed() {
                if (externalLinkToDeleteId) {
                    const deletedLinkName = externalLinks.find(l => l.id === externalLinkToDeleteId)?.displayText || 'Unknown Link';
                    externalLinks = externalLinks.filter(l => l.id !== externalLinkToDeleteId);
                    renderExternalLinks();
                    closeConfirmDeleteExternalLinkModal();
                    openPreview();
                    showMessage(`Link "${escapeHtml(deletedLinkName)}" deleted successfully!`, 'success');
                }
            }

            function openConfirmDeleteExternalLinkModal(id) {
                const link = externalLinks.find(l => l.id === id);
                if (link && confirmDeleteExternalLinkModalOverlay && externalLinkToDeleteNameSpan) {
                    externalLinkToDeleteId = id;
                    externalLinkToDeleteNameSpan.textContent = link.displayText;
                    confirmDeleteExternalLinkModalOverlay.classList.add('show');
                } else {
                    showMessage("Link not found or modal elements missing.", 'error');
                }
            }

            function closeConfirmDeleteExternalLinkModal() {
                if (confirmDeleteExternalLinkModalOverlay) confirmDeleteExternalLinkModalOverlay.classList.remove('show');
                externalLinkToDeleteId = null;
            }


            function showView(viewElement) {
                if (generatorView) generatorView.classList.add('hidden');
                if (pageEditorView) pageEditorView.classList.add('hidden');
                if (previewView) previewView.classList.add('hidden');
                if (codeView) codeView.classList.add('hidden');
                if (libraryView) libraryView.classList.add('hidden');
                if (viewElement) viewElement.classList.remove('hidden');
            }

            function openPageEditor(pageId) {
                const page = pagesData.find(p => p.id === pageId);
                if (page && pageEditorTitle && pageContentEditor) {
                    currentPageIdInEditor = pageId;
                    pageEditorTitle.textContent = page.name;
                    pageContentEditor.value = page.content;
                    showView(pageEditorView);
                } else {
                    showMessage("Page not found for editing or editor elements missing.", 'error');
                }
            }

            function closePageEditor() {
                const page = pagesData.find(p => p.id === currentPageIdInEditor);
                if (page && pageContentEditor) page.content = pageContentEditor.value;
                currentPageIdInEditor = null;
                saveCurrentWebsiteToLibrary();
                showView(generatorView);
                openPreview();
            }

            function renderPreviewSidebar(targetElement) {
                if (!targetElement) return;
                targetElement.innerHTML = '';
                pagesData.sort((a, b) => a.order - b.order);
                pagesData.forEach(page => {
                    const pageLink = document.createElement('div');
                    pageLink.className = 'sidebar-page-item';
                    pageLink.textContent = page.name;
                    pageLink.dataset.id = page.id;
                    pageLink.addEventListener('click', () => {
                        if (previewIframe && previewIframe.contentWindow) {
                            previewIframe.contentWindow.location.hash = page.id;
                        }
                        closeMobileSidebar();
                    });
                    targetElement.appendChild(pageLink);
                });
            }

            function generateFullWebsiteHtml() {
                const websiteName = nameInput.value.trim();
                const logoUrl = logoUrlInput.value.trim();
                const faviconUrl = faviconUrlInput.value.trim();
                const metaDescription = generateAutoDescription();
                const ogTitle = ogTitleInput.value.trim();
                const ogDescription = ogDescriptionInput.value.trim();
                const ogImageUrl = ogImageUrlInput.value.trim();
                const ogImageWidth = ogImageWidthInput.value.trim();
                const ogImageHeight = ogImageHeightInput.value.trim();
                const twitterCardType = twitterCardTypeSelect.value.trim();
                const hostingUrl = hostingUrlInput.value.trim();
                const copyrightHolder = copyrightHolderInput.value.trim();
                const copyrightYear = copyrightYearInput.value.trim();
                const contactEmail = contactEmailInput.value.trim();
                const facebookUrl = facebookUrlInput.value.trim();
                const twitterUrl = twitterUrlInput.value.trim();
                const linkedinUrl = linkedinUrlInput.value.trim();
                const showScrollToTop = document.querySelector('input[name="showScrollToTop"]:checked')?.value === 'yes';

                const siteTitle = websiteName || 'My ARvia Website';
                
                const defaultPage = pagesData.find(p => p.isDefault) || pagesData[0];
                const initialPageContent = defaultPage ? defaultPage.content : '<h1>Welcome!</h1><p>No page selected or content available.</p>';
                const initialPageId = defaultPage ? defaultPage.id : null;

                let sidebarHtml = '';
                pagesData.sort((a, b) => a.order - b.order).forEach(page => {
                    const activeClass = page.id === initialPageId ? 'active' : '';
                    sidebarHtml += `<div class="sidebar-page-item-iframe ${activeClass}" data-id="${page.id}">${escapeHtml(page.name)}</div>`;
                });
                
                const currentPageIndex = pagesData.findIndex(p => p.id === initialPageId);
                const prevButtonHtml = `<button id="prevPageBtnIframe" class="pagination-button-iframe" ${currentPageIndex <= 0 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i> </button>`;
                const nextButtonHtml = `<button id="nextPageBtnIframe" class="pagination-button-iframe" ${currentPageIndex >= pagesData.length - 1 ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;

                let qaSchema = [];
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = initialPageContent;
                tempDiv.querySelectorAll('.qa-block').forEach(qaBlock => {
                    const qaType = qaBlock.dataset.qaType;
                    let question = '';
                    let answer = '';
                    if (qaType === 'qa') {
                        question = qaBlock.dataset.question;
                        answer = qaBlock.dataset.answer;
                    } else if (qaType === 'true-false') {
                        question = qaBlock.dataset.statement;
                        answer = qaBlock.dataset.answer;
                    } else if (qaType === 'fill-in-blanks') {
                        question = qaBlock.dataset.sentence;
                        answer = JSON.parse(qaBlock.dataset.answers || '[]').join(', ');
                    } else if (qaType === 'multiple-choice') {
                        question = qaBlock.dataset.question;
                        answer = qaBlock.dataset.answer;
                    }
                    if (question && answer) {
                        qaSchema.push({
                            "@type": "Question",
                            "name": question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": answer
                            }
                        });
                    }
                });

                const jsonLdSchema = qaSchema.length > 0 ? `<script type="application/ld+json">{"@context": "https://schema.org","@type": "FAQPage","mainEntity": ${JSON.stringify(qaSchema)}}</script>` : '';
                const keywords = generateKeywordsFromContent();

                let externalLinksHtml = '';
                externalLinks.forEach(link => {
                    externalLinksHtml += `<a href="${escapeHtml(link.url)}" target="_blank" class="external-link-iframe">${escapeHtml(link.displayText)}</a>`;
                });

                const cssStyles = `
                    * {box-sizing: border-box;}
                    html, body {width: 100%; height: 100%; overflow-x: hidden; scroll-behavior: smooth;}
                    body {font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #1a1a1a; color: #FFFFFF; display: flex; flex-direction: column; min-height: 100vh;}
                    .preview-header-iframe {background-color: #0a0a0a; color: #FFFFFF; padding: 0.9375rem 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; position: fixed; top: 0; left: 0; width: 100%; z-index: 100; box-shadow: 0 2px 5px rgba(0,0,0,0.2);}
                    .secondary-header-iframe {background-color: rgba(0, 0, 0, 0.7); padding: 0.5rem 1.25rem; border-bottom: none; position: fixed; top: 4.5rem; left: 0; width: 100%; z-index: 99; overflow-x: auto; white-space: nowrap; box-shadow: 0 2px 5px rgba(0,0,0,0.1);}
                    .secondary-header-content-iframe {display: flex; gap: 1rem; justify-content: center;}
                    .external-link-iframe {color: #BB86FC; text-decoration: none; padding: 0.3rem 0.5rem; border-radius: 0.3125rem; transition: background-color 0.3s ease, color 0.3s ease;}
                    .external-link-iframe:hover {background-color: #BB86FC; color: #000000;}
                    .logo-section-iframe {display: flex; align-items: center;}
                    .arvia-logo-iframe {width: 2.5rem; height: 2.5rem; margin-right: 0.625rem; border-radius: 0.3125rem; object-fit: contain;}
                    .arvia-text-iframe {font-family: 'Comic Sans MS', cursive, sans-serif; font-size: 2rem; font-weight: bold; color: #805BE9; margin-left: 0.3125rem;}
                    .menu-button-iframe {font-size: 1.8rem; color: #BB86FC; cursor: pointer; display: none;}
                    .preview-content-area-iframe {display: flex; flex-grow: 1; width: 100%; overflow: hidden; margin-top: calc(4.5rem + ${externalLinksHtml ? '2.5rem' : '0rem'}); height: calc(100vh - (4.5rem + ${externalLinksHtml ? '2.5rem' : '0rem'}));}
                    .preview-sidebar-iframe {width: 15.625rem; background-color: #0a0a0a; border-right: 2px solid #FFFFFF; flex-shrink: 0; overflow-y: auto; padding: 1.25rem 0; display: flex; flex-direction: column; height: 100%;}
                    .sidebar-logo-section-iframe {display: none;}
                    .sidebar-page-item-iframe {padding: 0.625rem 1.25rem; color: #FFFFFF; cursor: pointer; transition: background-color 0.3s ease, color 0.3s ease; border-radius: 0.3125rem; margin: 0.25rem 0.625rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
                    .sidebar-page-item-iframe:hover {background-color: #2a2a2a; color: #BB86FC;}
                    .sidebar-page-item-iframe.active {background-color: #BB86FC; color: #000000; font-weight: bold;}
                    .main-content-iframe {flex-grow: 1; padding: 1.875rem; background-color: #1a1a1a; overflow-y: auto; color: #FFFFFF; width: 100%; display: flex; flex-direction: column; justify-content: space-between; height: 100%;}
                    .content-wrapper-iframe {max-width: 800px; margin: 0 auto; padding: 0 1rem; width: 100%;}
                    .actual-page-content-iframe {flex-grow: 1; margin-bottom: 1.25rem;}
                    .main-content-iframe h1, .main-content-iframe h2, .main-content-iframe h3 {color: #BB86FC; margin-bottom: 0.9375rem;}
                    .main-content-iframe p {margin-bottom: 0.625rem; line-height: 1.6;}
                    .main-content-iframe pre {background-color: #0a0a0a; padding: 0.9375rem; border-radius: 0.3125rem; overflow-x: auto; position: relative; margin-bottom: 0.9375rem;}
                    .main-content-iframe pre code {display: block; white-space: pre;}
                    .copy-code-btn-iframe {position: absolute; top: 0.625rem; right: 0.625rem; background-color: #BB86FC; color: #000000; padding: 0.3125rem 0.5rem; border-radius: 0.3125rem; cursor: pointer; font-size: 0.8rem; opacity: 0.8; transition: opacity 0.3s ease;}
                    .copy-code-btn-iframe:hover {opacity: 1;}
                    .main-content-iframe table {width: 100%; border-collapse: collapse; margin-bottom: 0.9375rem; overflow-x: auto; display: block; border-radius: 0.3125rem;}
                    .main-content-iframe th, .main-content-iframe td {border: 1px solid #555555; padding: 0.5rem; text-align: left;}
                    .main-content-iframe th {background-color: #2a2a2a; color: #BB86FC;}
                    .main-content-iframe ul {list-style: disc; margin-left: 1.25rem; padding-left: 0; margin-bottom: 0.625rem;}
                    .main-content-iframe ol {list-style: decimal; margin-left: 1.25rem; padding-left: 0; margin-bottom: 0.625rem;}
                    .main-content-iframe li {margin-bottom: 0.3125rem;}
                    .main-content-iframe iframe {width: 100%; height: 25rem; border: none; border-radius: 0.3125rem;}
                    .formula-block-iframe {overflow-x: auto; padding: 0.9375rem; background-color: #0a0a0a; border: 1px solid #BB86FC; border-radius: 0.3125rem; margin-bottom: 0.9375rem; white-space: nowrap;}
                    .preview-pagination-iframe {display: flex; justify-content: space-between; align-items: center; padding-top: 0.625rem; border-top: 1px solid #333333; flex-shrink: 0; width: 100%;}
                    .pagination-button-iframe {background-color: #BB86FC; color: #000000; padding: 0.625rem 1rem; border-radius: 0.3125rem; font-weight: bold; cursor: pointer; transition: background-color 0.3s ease, opacity 0.3s ease, transform 0.3s ease; display: flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; font-size: 1.2rem;}
                    .pagination-button-iframe:hover:not(:disabled) {background-color: #9C27B0; transform: translateY(-2px);}
                    .pagination-button-iframe:disabled {background-color: #555555; cursor: not-allowed; opacity: 0.6;}
                    .mobile-sidebar-overlay-iframe {position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.7); display: flex; justify-content: flex-start; align-items: flex-start; z-index: 1001; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease;}
                    .mobile-sidebar-overlay-iframe.show {opacity: 1; visibility: visible;}
                    .mobile-sidebar-iframe {width: 50vw; height: 100%; background-color: #0a0a0a; padding: 1.25rem 0; box-shadow: 0.125rem 0 0.625rem rgba(0, 0, 0, 0.5); transform: translateX(-100%); transition: transform 0.3s ease; overflow-y: auto;}
                    .mobile-sidebar-overlay-iframe.show .mobile-sidebar-iframe {transform: translateX(0);}
                    .mobile-sidebar-iframe .sidebar-title {display: none;}
                    .mobile-sidebar-iframe .sidebar-page-item {padding: 0.625rem 1.25rem;}
                    .mobile-sidebar-iframe .sidebar-logo-section-iframe {display: flex; align-items: center; padding: 0.625rem 1.25rem; border-bottom: 1px solid #333; margin-bottom: 1rem;}
                    .scroll-to-top-btn-iframe {position: fixed; bottom: 1.5rem; right: 1.5rem; background-color: #BB86FC; color: #000000; width: 3rem; height: 3rem; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.5rem; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.3); opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease;}
                    .scroll-to-top-btn-iframe.show {opacity: 1; visibility: visible;}
                    .qa-block {background-color: #0a0a0a; border: 1px solid #BB86FC; border-radius: 0.3125rem; padding: 0.9375rem; margin-bottom: 0.9375rem;}
                    .qa-block p {margin-bottom: 0.5rem;}
                    .qa-block ul {list-style: disc; margin-left: 1.25rem; margin-top: 0.5rem;}
                    .qa-block li {margin-bottom: 0.3rem;}
                    @media (max-width: 48rem) {
                        .preview-header-iframe {padding: 0.625rem 0.9375rem;}
                        .secondary-header-iframe {top: 4.5rem; padding: 0.4rem 0.9375rem;}
                        .arvia-text-iframe {font-size: 1.8rem;}
                        .arvia-logo-iframe {width: 2.1875rem; height: 2.1875rem;}
                        .menu-button-iframe {display: block; order: 2;}
                        .preview-header-iframe .logo-section-iframe {order: 1; display: flex;}
                        .preview-sidebar-iframe {display: none;}
                        .main-content-iframe {padding: 1.25rem;}
                        .sidebar-logo-section-iframe {display: none;}
                        .mobile-sidebar-iframe .sidebar-logo-section-iframe {display: flex;}
                        .preview-content-area-iframe {margin-top: calc(4.5rem + ${externalLinksHtml ? '2.5rem' : '0rem'}); height: calc(100vh - (4.5rem + ${externalLinksHtml ? '2.5rem' : '0rem'}));}
                    }
                    @media (min-width: 48.0625rem) {
                        .menu-button-iframe {display: none;}
                    }
                    @media (orientation: landscape) and (max-width: 62rem) {
                        .preview-sidebar-iframe {width: 12.5rem;}
                        .main-content-iframe {padding: 1.25rem;}
                    }
                    @media (orientation: portrait) and (max-width: 48rem) {
                        .preview-header-iframe {padding: 0.5rem 0.75rem;}
                        .main-content-iframe {padding: 0.9375rem;}
                    }
                `;

                return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${escapeHtml(siteTitle)}</title>${metaDescription ? `<meta name="description" content="${escapeHtml(metaDescription)}">` : ''}<meta name="keywords" content="${escapeHtml(keywords)}"><meta name="author" content="${escapeHtml(copyrightHolder || 'ARvia')}"><meta name="generator" content="ARvia Website Generator"><meta name="theme-color" content="#BB86FC"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">${faviconUrl ? `<link rel="icon" href="${escapeHtml(faviconUrl)}" type="image/x-icon">` : ''}<meta property="og:title" content="${escapeHtml(ogTitle || siteTitle)}"><meta property="og:description" content="${escapeHtml(ogDescription || metaDescription)}">${ogImageUrl ? `<meta property="og:image" content="${escapeHtml(ogImageUrl)}">` : ''}${ogImageWidth ? `<meta property="og:image:width" content="${escapeHtml(ogImageWidth)}">` : ''}${ogImageHeight ? `<meta property="og:image:height" content="${escapeHtml(ogImageHeight)}">` : ''}<meta property="og:url" content="${escapeHtml(hostingUrl || window.location.href)}"><meta property="og:type" content="website"><meta name="twitter:card" content="${escapeHtml(twitterCardType)}">${ogTitle ? `<meta name="twitter:title" content="${escapeHtml(ogTitle)}">` : ''}${ogDescription ? `<meta name="twitter:description" content="${escapeHtml(ogDescription)}">` : ''}${ogImageUrl ? `<meta name="twitter:image" content="${escapeHtml(ogImageUrl)}">` : ''}<meta name="arvia-website-name" content="${escapeHtml(websiteName)}"><meta name="arvia-logo-url" content="${escapeHtml(logoUrl)}"><meta name="arvia-favicon-url" content="${escapeHtml(faviconUrl)}"><meta name="arvia-hosting-url" content="${escapeHtml(hostingUrl)}"><meta name="arvia-copyright-holder" content="${escapeHtml(copyrightHolder)}"><meta name="arvia-copyright-year" content="${escapeHtml(copyrightYear)}"><meta name="arvia-contact-email" content="${escapeHtml(contactEmail)}"><meta name="arvia-facebook-url" content="${escapeHtml(facebookUrl)}"><meta name="arvia-twitter-url" content="${escapeHtml(twitterUrl)}"><meta name="arvia-linkedin-url" content="${escapeHtml(linkedinUrl)}"><meta name="arvia-show-scroll-to-top" content="${showScrollToTop ? 'yes' : 'no'}"><meta name="arvia-external-links" content="${escapeHtml(JSON.stringify(externalLinks))}">${jsonLdSchema}<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"> <script src="https://tikzjax.com/v1/tikzjax.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script><script src="https://cdn.tailwindcss.com"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script><script>MathJax = {tex: {inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['$$', '$$'], ['\\[', '\\]']]}, svg: {fontCache: 'global'}};</script><script async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script><style>${cssStyles}</style></head><body><header class="preview-header-iframe"><div class="logo-section-iframe"><img src="${escapeHtml(logoUrl || "https://arlabs07.github.io/Learning-labs.github.io/arvia.jpg")}" alt="ARvia Logo" class="arvia-logo-iframe"><span class="arvia-text-iframe">${escapeHtml(siteTitle)}</span></div><span id="menuButtonIframe" class="menu-button-iframe" aria-label="Open Mobile Menu"><i class="fas fa-bars"></i></span></header>${externalLinksHtml ? `<div class="secondary-header-iframe"><div class="secondary-header-content-iframe">${externalLinksHtml}</div></div>` : ''}<div class="preview-content-area-iframe"><div id="previewFixedSidebarIframe" class="preview-sidebar-iframe"><div id="previewSidebarPageListIframe">${sidebarHtml}</div></div><div class="main-content-iframe"><div class="content-wrapper-iframe"><div id="actualPageContentIframe" class="actual-page-content-iframe">${initialPageContent}</div></div><div id="previewPaginationIframe" class="preview-pagination-iframe">${prevButtonHtml}${nextButtonHtml}</div></div></div><div id="mobileSidebarOverlayIframe" class="mobile-sidebar-overlay-iframe"><div id="mobileSidebarIframe" class="mobile-sidebar-iframe"><div class="sidebar-logo-section-iframe"><img src="${escapeHtml(logoUrl || "https://arlabs07.github.io/Learning-labs.github.io/arvia.jpg")}" alt="ARvia Logo" class="arvia-logo-iframe"><span class="arvia-text-iframe" style="font-size: 1.5rem;">${escapeHtml(siteTitle)}</span></div><div id="mobileSidebarPageListIframe">${sidebarHtml}</div></div></div>${showScrollToTop ? `<button id="scrollToTopBtnIframe" class="scroll-to-top-btn-iframe" aria-label="Scroll to top"><i class="fas fa-arrow-circle-up"></i></button>` : ''}<script>const pagesDataIframe = ${JSON.stringify(pagesData)};let currentPageIdIframe = '${initialPageId}';const previewSidebarPageListIframe = document.getElementById('previewSidebarPageListIframe');const mobileSidebarPageListIframe = document.getElementById('mobileSidebarPageListIframe');const actualPageContentIframe = document.getElementById('actualPageContentIframe');const menuButtonIframe = document.getElementById('menuButtonIframe');const mobileSidebarOverlayIframe = document.getElementById('mobileSidebarOverlayIframe');const prevPageBtnIframe = document.getElementById('prevPageBtnIframe');const nextPageBtnIframe = document.getElementById('nextPageBtnIframe');const scrollToTopBtnIframe = document.getElementById('scrollToTopBtnIframe');const mainContentIframe = document.querySelector('.main-content-iframe');function animatePageContent() {if (!actualPageContentIframe) return;actualPageContentIframe.querySelectorAll('h1, h2, h3, p, ul, ol, table, pre, img, iframe, .formula-block-iframe, strong, em, a, .qa-block').forEach(el => {el.style.opacity = '0';el.style.transform = 'translateY(20px)';});anime({targets: '#actualPageContentIframe h1, #actualPageContentIframe h2, #actualPageContentIframe h3, #actualPageContentIframe p, #actualPageContentIframe ul, #actualPageContentIframe ol, #actualPageContentIframe table, #actualPageContentIframe pre, #actualPageContentIframe img, #actualPageContentIframe iframe, #actualPageContentIframe .formula-block-iframe, #actualPageContentIframe strong, #actualPageContentIframe em, #actualPageContentIframe a, #actualPageContentIframe .qa-block',opacity: [0, 1],translateY: [20, 0],delay: anime.stagger(50, {start: 300}),easing: 'easeOutQuad'});}function displayPageContentIframe(pageId) {const page = pagesDataIframe.find(p => p.id === pageId);if (page && actualPageContentIframe) {actualPageContentIframe.innerHTML = page.content;currentPageIdIframe = pageId;document.querySelectorAll('.sidebar-page-item-iframe').forEach(item => {if (item.dataset.id === pageId) {item.classList.add('active');} else {item.classList.remove('active');}});updatePaginationButtonsIframe();initializeIframeScripts();}}function updatePaginationButtonsIframe() {const currentIndex = pagesDataIframe.findIndex(p => p.id === currentPageIdIframe);if (prevPageBtnIframe) prevPageBtnIframe.disabled = currentIndex <= 0;if (nextPageBtnIframe) nextPageBtnIframe.disabled = currentIndex >= pagesDataIframe.length - 1;}function initializeIframeScripts() {if (typeof MathJax !== 'undefined') {MathJax.typesetPromise([actualPageContentIframe]).then(() => {animatePageContent();}).catch(err => console.error("MathJax typesetting error:", err));} else {animatePageContent();}actualPageContentIframe.querySelectorAll('pre code').forEach((block) => {if (typeof hljs !== 'undefined') {hljs.highlightElement(block);}const copyButton = document.createElement('button');copyButton.className = 'copy-code-btn-iframe';copyButton.textContent = 'Copy';copyButton.onclick = () => {try {const codeText = block.textContent;const tempInput = document.createElement('textarea');tempInput.value = codeText;document.body.appendChild(tempInput);tempInput.select();document.execCommand('copy');document.body.removeChild(tempInput);copyButton.textContent = 'Copied!';setTimeout(() => { copyButton.textContent = 'Copy'; }, 2000);} catch (err) {console.error("Failed to copy code in iframe:", err);}};if (!block.parentNode.querySelector('.copy-code-btn-iframe')) {block.parentNode.style.position = 'relative';block.parentNode.appendChild(copyButton);}});updatePaginationButtonsIframe();}if (previewSidebarPageListIframe) {previewSidebarPageListIframe.addEventListener('click', (event) => {const target = event.target.closest('.sidebar-page-item-iframe');if (target && target.dataset.id) {window.location.hash = target.dataset.id;}});}if (mobileSidebarPageListIframe) {mobileSidebarPageListIframe.addEventListener('click', (event) => {const target = event.target.closest('.sidebar-page-item-iframe');if (target && target.dataset.id) {window.location.hash = target.dataset.id;mobileSidebarOverlayIframe.classList.remove('show');}});}if (menuButtonIframe) {menuButtonIframe.addEventListener('click', () => {mobileSidebarOverlayIframe.classList.add('show');});}if (mobileSidebarOverlayIframe) {mobileSidebarOverlayIframe.addEventListener('click', (event) => {if (event.target === mobileSidebarOverlayIframe) {mobileSidebarOverlayIframe.classList.remove('show');}});}if (prevPageBtnIframe) {prevPageBtnIframe.addEventListener('click', () => {const currentIndex = pagesDataIframe.findIndex(p => p.id === currentPageIdIframe);if (currentIndex > 0) {window.location.hash = pagesDataIframe[currentIndex - 1].id;}});}if (nextPageBtnIframe) {nextPageBtnIframe.addEventListener('click', () => {const currentIndex = pagesDataIframe.findIndex(p => p.id === currentPageIdIframe);if (currentIndex < pagesDataIframe.length - 1) {window.location.hash = pagesDataIframe[currentIndex + 1].id;}});}if (scrollToTopBtnIframe && mainContentIframe) {mainContentIframe.addEventListener('scroll', () => {if (mainContentIframe.scrollTop > (mainContentIframe.clientHeight * 0.5)) {scrollToTopBtnIframe.classList.add('show');} else {scrollToTopBtnIframe.classList.remove('show');}});scrollToTopBtnIframe.addEventListener('click', () => {mainContentIframe.scrollTo({top: 0, behavior: 'smooth'});scrollToTopBtnIframe.classList.remove('show');});}window.addEventListener('hashchange', () => {const hashId = window.location.hash.substring(1);const targetPage = pagesDataIframe.find(p => p.id === hashId);if (targetPage) {displayPageContentIframe(targetPage.id);} else if (pagesDataIframe.length > 0) {displayPageContentIframe(pagesDataIframe.find(p => p.isDefault)?.id || pagesDataIframe[0].id);}});document.addEventListener('DOMContentLoaded', () => {const initialHash = window.location.hash.substring(1);const defaultPageId = pagesDataIframe.find(p => p.isDefault)?.id || (pagesDataIframe.length > 0 ? pagesDataIframe[0].id : null);if (initialHash && pagesDataIframe.some(p => p.id === initialHash)) {displayPageContentIframe(initialHash);} else if (defaultPageId) {displayPageContentIframe(defaultPageId);}})</script></body></html>`;
            }

            function updateIframeContent() {
                try {
                    if (previewIframe && previewIframe.contentWindow && previewIframe.contentWindow.document) {
                        const iframeDoc = previewIframe.contentWindow.document;
                        iframeDoc.open();
                        iframeDoc.write(generateFullWebsiteHtml());
                        iframeDoc.close();
                    }
                } catch (error) {
                    console.error("Error loading iframe content:", error);
                    if (previewIframe) previewIframe.srcdoc = `<div style="color: red; padding: 20px;">Error loading preview: ${escapeHtml(error.message)}. Please check your inputs.</div>`;
                    showMessage("Error updating preview: " + error.message, 'error');
                }
            }

            function loadMonacoEditor(containerId, content) {
                try {
                    if (monacoEditor) {
                        monacoEditor.setValue(content);
                        monacoEditor.updateOptions({ readOnly: !isMonacoEditable });
                        return;
                    }
                    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.48.0/min/vs' } });
                    require(['vs/editor/editor.main'], function() {
                        const editorContainer = document.getElementById(containerId);
                        if (editorContainer) {
                            monacoEditor = monaco.editor.create(editorContainer, {
                                value: content,
                                language: 'html',
                                theme: 'vs-dark',
                                readOnly: !isMonacoEditable,
                                minimap: { enabled: false }
                            });
                        } else {
                            showMessage("Error: Code editor container not found.", 'error');
                        }
                    });
                } catch (error) {
                    console.error("Error loading Monaco editor:", error);
                    showMessage("Error loading code editor: " + error.message, 'error');
                }
            }

            function toggleCodeEditorEditMode() {
                if (!monacoEditor) {
                    showMessage("Code editor not initialized.", 'error');
                    return;
                }
                isMonacoEditable = !isMonacoEditable;
                monacoEditor.updateOptions({ readOnly: !isMonacoEditable });
                if (isMonacoEditable) {
                    if (editCodeBtn) {
                        editCodeBtn.innerHTML = '<i class="fas fa-save"></i> <span>Save Changes</span>';
                        editCodeBtn.style.width = 'auto';
                    }
                    showMessage("Code editor is now editable. Click 'Save Changes' when done.", 'info');
                } else {
                    if (editCodeBtn) {
                        editCodeBtn.innerHTML = '<i class="fas fa-edit"></i> <span>Edit Code</span>';
                        editCodeBtn.style.width = '2.5rem';
                    }
                    saveCodeChangesFromEditor();
                }
            }

            function saveCodeChangesFromEditor() {
                if (!monacoEditor) {
                    showMessage("Code editor not initialized.", 'error');
                    return;
                }
                try {
                    const fullHtml = monacoEditor.getValue();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(fullHtml, 'text/html');
                    const errorNode = doc.querySelector('parsererror');
                    if (errorNode) {
                        showMessage("Error: Invalid HTML. Please fix syntax errors in the code editor.", 'error', 5000);
                        isMonacoEditable = false;
                        monacoEditor.updateOptions({ readOnly: true });
                        if (editCodeBtn) {
                            editCodeBtn.innerHTML = '<i class="fas fa-edit"></i> <span>Edit Code</span>';
                            editCodeBtn.style.width = '2.5rem';
                        }
                        return;
                    }
                    if (nameInput) nameInput.value = doc.querySelector('meta[name="arvia-website-name"]')?.getAttribute('content') || doc.querySelector('title')?.textContent || '';
                    if (logoUrlInput) logoUrlInput.value = doc.querySelector('meta[name="arvia-logo-url"]')?.getAttribute('content') || '';
                    if (faviconUrlInput) faviconUrlInput.value = doc.querySelector('meta[name="arvia-favicon-url"]')?.getAttribute('content') || '';
                    if (metaInput) metaInput.value = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
                    if (ogTitleInput) ogTitleInput.value = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
                    if (ogDescriptionInput) ogDescriptionInput.value = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
                    if (ogImageUrlInput) ogImageUrlInput.value = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
                    if (ogImageWidthInput) ogImageWidthInput.value = doc.querySelector('meta[property="og:image:width"]')?.getAttribute('content') || '';
                    if (ogImageHeightInput) ogImageHeightInput.value = doc.querySelector('meta[property="og:image:height"]')?.getAttribute('content') || '';
                    if (twitterCardTypeSelect) twitterCardTypeSelect.value = doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || 'summary';
                    if (hostingUrlInput) hostingUrlInput.value = doc.querySelector('meta[name="arvia-hosting-url"]')?.getAttribute('content') || '';
                    if (copyrightHolderInput) copyrightHolderInput.value = doc.querySelector('meta[name="arvia-copyright-holder"]')?.getAttribute('content') || '';
                    if (copyrightYearInput) copyrightYearInput.value = doc.querySelector('meta[name="arvia-copyright-year"]')?.getAttribute('content') || new Date().getFullYear();
                    if (contactEmailInput) contactEmailInput.value = doc.querySelector('meta[name="arvia-contact-email"]')?.getAttribute('content') || '';
                    if (facebookUrlInput) facebookUrlInput.value = doc.querySelector('meta[name="arvia-facebook-url"]')?.getAttribute('content') || '';
                    if (twitterUrlInput) twitterUrlInput.value = doc.querySelector('meta[name="arvia-twitter-url"]')?.getAttribute('content') || '';
                    if (linkedinUrlInput) linkedinUrlInput.value = doc.querySelector('meta[name="arvia-linkedin-url"]')?.getAttribute('content') || '';
                    
                    const showScrollToTopMeta = doc.querySelector('meta[name="arvia-show-scroll-to-top"]')?.getAttribute('content');
                    if (showScrollToTopMeta) {
                        document.querySelector(`input[name="showScrollToTop"][value="${showScrollToTopMeta}"]`).checked = true;
                    }

                    const externalLinksMeta = doc.querySelector('meta[name="arvia-external-links"]')?.getAttribute('content');
                    if (externalLinksMeta) {
                        try {
                            externalLinks = JSON.parse(externalLinksMeta);
                        } catch (e) {
                            console.error("Error parsing external links from meta tag:", e);
                            externalLinks = [];
                        }
                    } else {
                        externalLinks = [];
                    }

                    const actualPageContentDiv = doc.getElementById('actualPageContentIframe');
                    if (actualPageContentDiv && currentPageIdInEditor) {
                        const page = pagesData.find(p => p.id === currentPageIdInEditor);
                        if (page) {
                            page.content = actualPageContentDiv.innerHTML;
                            showMessage("Code changes saved successfully!", 'success');
                        } else {
                            showMessage("Could not find current page in data to update content.", 'error');
                        }
                    } else {
                        showMessage("Could not find page content in parsed HTML or no page is currently selected.", 'error');
                    }
                    saveCurrentWebsiteToLibrary();
                    renderPages();
                    renderExternalLinks();
                    updateLogoPreview();
                    openPreview();
                } catch (error) {
                    console.error("Error saving code changes:", error);
                    showMessage("Error saving code changes: " + error.message, 'error', 5000);
                    isMonacoEditable = false;
                    monacoEditor.updateOptions({ readOnly: true });
                    if (editCodeBtn) {
                        editCodeBtn.innerHTML = '<i class="fas fa-edit"></i> <span>Edit Code</span>';
                        editCodeBtn.style.width = '2.5rem';
                    }
                }
            }

            function openLoadUrlHtmlModal() {
                if (loadUrlHtmlModalOverlay && htmlUrlInput) {
                    loadUrlHtmlModalOverlay.classList.add('show');
                    htmlUrlInput.value = '';
                    htmlUrlInput.focus();
                }
            }

            function closeLoadUrlHtmlModal() {
                if (loadUrlHtmlModalOverlay) loadUrlHtmlModalOverlay.classList.remove('show');
            }

            async function loadHtmlFromUrl() {
                if (!htmlUrlInput || !monacoEditor) return;
                const url = htmlUrlInput.value.trim();
                if (!url) {
                    showMessage("Please enter a URL to load.", 'error');
                    return;
                }
                const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
                showMessage("Loading HTML... This may take a moment.", 'info', 5000);
                try {
                    const response = await fetch(proxyUrl);
                    if (!response.ok) {
                        let errorText = await response.text();
                        try {
                            const errorJson = JSON.parse(errorText);
                            errorText = errorJson.message || errorText;
                        } catch (e) {
                        }
                        throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText}`);
                    }
                    const htmlContent = await response.text();
                    monacoEditor.setValue(htmlContent);
                    monacoEditor.updateOptions({ readOnly: false });
                    isMonacoEditable = true;
                    if (editCodeBtn) {
                        editCodeBtn.innerHTML = '<i class="fas fa-save"></i> <span>Save Changes</span>';
                        editCodeBtn.style.width = 'auto';
                    }
                    showMessage("HTML loaded successfully! You can now edit and save.", 'success');
                    closeLoadUrlHtmlModal();
                } catch (error) {
                    console.error("Error loading HTML from URL:", error);
                    showMessage(`Failed to load HTML from URL: ${error.message}. Ensure the URL is correct and accessible.`, 'error', 7000);
                }
            }

            function openCodeView() {
                const generatedHtml = generateFullWebsiteHtml();
                loadMonacoEditor('codeEditorContainer', generatedHtml);
                isMonacoEditable = false;
                if (editCodeBtn) {
                    editCodeBtn.innerHTML = '<i class="fas fa-edit"></i> <span>Edit Code</span>';
                    editCodeBtn.style.width = '2.5rem';
                }
                showView(codeView);
            }

            function openPreview() {
                generateWebsiteInfoPage();
                renderPreviewSidebar(previewFixedSidebar);
                renderPreviewSidebar(mobileSidebarPageList);
                currentPreviewPageId = pagesData.find(p => p.isDefault)?.id || pagesData[0]?.id || null;
                updateIframeContent();
                showView(previewView);
            }

            document.addEventListener('DOMContentLoaded', () => {
                nameInput = document.getElementById('name');
                logoUrlInput = document.getElementById('logo-url');
                faviconUrlInput = document.getElementById('favicon-url');
                metaInput = document.getElementById('meta');
                ogTitleInput = document.getElementById('og-title');
                ogDescriptionInput = document.getElementById('og-description');
                ogImageUrlInput = document.getElementById('og-image-url');
                ogImageWidthInput = document.getElementById('og-image-width');
                ogImageHeightInput = document.getElementById('og-image-height');
                twitterCardTypeSelect = document.getElementById('twitter-card-type');
                hostingUrlInput = document.getElementById('hosting-url');
                copyrightHolderInput = document.getElementById('copyright-holder');
                copyrightYearInput = document.getElementById('copyright-year');
                contactEmailInput = document.getElementById('contact-email');
                facebookUrlInput = document.getElementById('facebook-url');
                twitterUrlInput = document.getElementById('twitter-url');
                linkedinUrlInput = document.getElementById('linkedin-url');
                showScrollToTopRadios = document.querySelectorAll('input[name="showScrollToTop"]');
                logoPreviewImg = document.getElementById('logoPreview');
                pageList = document.getElementById('pageList');
                externalLinkList = document.getElementById('externalLinkList');
                openAddPageModalBtn = document.getElementById('openAddPageModal');
                addPageModalOverlay = document.getElementById('addPageModalOverlay');
                modalNewPageNameInput = document.getElementById('modalNewPageName');
                cancelAddPageBtn = document.getElementById('cancelAddPageBtn');
                confirmAddPageBtn = document.getElementById('confirmAddPageBtn');
                editPageModalOverlay = document.getElementById('editPageModalOverlay');
                modalEditPageNameInput = document.getElementById('modalEditPageName');
                cancelEditPageBtn = document.getElementById('cancelEditPageBtn');
                saveEditPageBtn = document.getElementById('saveEditPageBtn');
                confirmDeleteModalOverlay = document.getElementById('confirmDeleteModalOverlay');
                pageToDeleteNameSpan = document.getElementById('pageToDeleteName');
                cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
                confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
                headerIcons = document.querySelectorAll('.header-icon');
                libraryIcon = document.getElementById('libraryIcon');
                editIcon = document.getElementById('editIcon');
                previewIcon = document.getElementById('previewIcon');
                codeIcon = document.getElementById('codeIcon');
                generatorView = document.getElementById('generatorView');
                pageEditorView = document.getElementById('pageEditorView');
                previewView = document.getElementById('previewView');
                codeView = document.getElementById('codeView');
                libraryView = document.getElementById('libraryView');
                pageEditorBackBtn = document.getElementById('pageEditorBackBtn');
                pageEditorTitle = document.getElementById('pageEditorTitle');
                pageEditorPlusBtn = document.getElementById('pageEditorPlusBtn');
                pageContentEditor = document.getElementById('pageContentEditor');
                previewIframe = document.getElementById('previewIframe');
                refreshPreviewBtn = document.getElementById('refreshPreviewBtn');
                openInNewTabBtn = document.getElementById('openInNewTabBtn');
                menuButton = document.getElementById('menuButton');
                previewFixedSidebar = document.getElementById('previewFixedSidebar');
                previewSidebarPageList = document.getElementById('previewSidebarPageList');
                mobileSidebarOverlay = document.getElementById('mobileSidebarOverlay');
                mobileSidebar = document.getElementById('mobileSidebar');
                mobileSidebarPageList = document.getElementById('mobileSidebarPageList');
                addContentTypeModalOverlay = document.getElementById('addContentTypeModalOverlay');
                cancelAddContentTypeBtn = document.getElementById('cancelAddContentTypeBtn');
                contentTypeList = document.querySelector('.content-type-list');
                addHeadingModalOverlay = document.getElementById('addHeadingModalOverlay');
                headingText = document.getElementById('headingText');
                headingLevel = document.getElementById('headingLevel');
                cancelAddHeadingBtn = document.getElementById('cancelAddHeadingBtn');
                addHeadingBtn = document.getElementById('addHeadingBtn');
                addListModalOverlay = document.getElementById('addListModalOverlay');
                listItems = document.getElementById('listItems');
                listTypeRadios = document.querySelectorAll('input[name="listType"]');
                cancelAddListBtn = document.getElementById('cancelAddListBtn');
                addListBtn = document.getElementById('addListBtn');
                addTableModalOverlay = document.getElementById('addTableModalOverlay');
                tableContentInput = document.getElementById('tableContentInput');
                cancelAddTableBtn = document.getElementById('cancelAddTableBtn');
                addTableBtn = document.getElementById('addTableBtn');
                addFormulaModalOverlay = document.getElementById('addFormulaModalOverlay');
                formulaInput = document.getElementById('formulaInput');
                cancelAddFormulaBtn = document.getElementById('cancelAddFormulaBtn');
                addFormulaBtn = document.getElementById('addFormulaBtn');
                addUrlModalOverlay = document.getElementById('addUrlModalOverlay');
                urlLink = document.getElementById('urlLink');
                urlText = document.getElementById('urlText');
                cancelAddUrlBtn = document.getElementById('cancelAddUrlBtn');
                addUrlBtn = document.getElementById('addUrlBtn');
                addCodeModalOverlay = document.getElementById('addCodeModalOverlay');
                codeLanguage = document.getElementById('codeLanguage');
                codeContent = document.getElementById('codeContent');
                cancelAddCodeBtn = document.getElementById('cancelAddCodeBtn');
                addCodeBtn = document.getElementById('addCodeBtn');
                addImageModalOverlay = document.getElementById('addImageModalOverlay');
                imageUrl = document.getElementById('imageUrl');
                imageAlt = document.getElementById('imageAlt');
                cancelAddImageBtn = document.getElementById('cancelAddImageBtn');
                addImageBtn = document.getElementById('addImageBtn');
                addPdfModalOverlay = document.getElementById('addPdfModalOverlay');
                pdfUrl = document.getElementById('pdfUrl');
                cancelAddPdfBtn = document.getElementById('cancelAddPdfBtn');
                addPdfBtn = document.getElementById('addPdfBtn');
                addIframeModalOverlay = document.getElementById('addIframeModalOverlay');
                iframeUrl = document.getElementById('iframeUrl');
                cancelAddIframeBtn = document.getElementById('cancelAddIframeBtn');
                addIframeBtn = document.getElementById('addIframeBtn');
                addVideoModalOverlay = document.getElementById('addVideoModalOverlay');
                videoUrl = document.getElementById('videoUrl');
                cancelAddVideoBtn = document.getElementById('cancelAddVideoBtn');
                addVideoBtn = document.getElementById('addVideoBtn');
                addMapModalOverlay = document.getElementById('addMapModalOverlay');
                mapUrl = document.getElementById('mapUrl');
                cancelAddMapBtn = document.getElementById('cancelAddMapBtn');
                addMapBtn = document.getElementById('addMapBtn');
                addBoldModalOverlay = document.getElementById('addBoldModalOverlay');
                boldText = document.getElementById('boldText');
                cancelAddBoldBtn = document.getElementById('cancelAddBoldBtn');
                addBoldBtn = document.getElementById('addBoldBtn');
                addItalicsModalOverlay = document.getElementById('addItalicsModalOverlay');
                italicsText = document.getElementById('italicsText');
                cancelAddItalicsBtn = document.getElementById('cancelAddItalicsBtn');
                addItalicsBtn = document.getElementById('addItalicsBtn');
                copyCodeBtn = document.getElementById('copyCodeBtn');
                editCodeBtn = document.getElementById('editCodeBtn');
                loadUrlHtmlBtn = document.getElementById('loadUrlHtmlBtn');
                messageBox = document.getElementById('messageBox');
                messageText = document.getElementById('messageText');
                messageCloseBtn = document.getElementById('messageCloseBtn');
                loadUrlHtmlModalOverlay = document.getElementById('loadUrlHtmlModalOverlay');
                htmlUrlInput = document.getElementById('htmlUrlInput');
                cancelLoadUrlHtmlBtn = document.getElementById('cancelLoadUrlHtmlBtn');
                confirmLoadUrlHtmlBtn = document.getElementById('confirmLoadUrlHtmlBtn');
                addQuestionAnswerModalOverlay = document.getElementById('addQuestionAnswerModalOverlay');
                qaTypeSelect = document.getElementById('qaTypeSelect');
                qaInputs = document.getElementById('qaInputs');
                qaQuestion = document.getElementById('qaQuestion');
                qaAnswer = document.getElementById('qaAnswer');
                trueFalseInputs = document.getElementById('trueFalseInputs');
                tfStatement = document.getElementById('tfStatement');
                tfAnswerRadios = document.querySelectorAll('input[name="tfAnswer"]');
                fillInBlanksInputs = document.getElementById('fillInBlanksInputs');
                fibSentence = document.getElementById('fibSentence');
                fibAnswers = document.getElementById('fibAnswers');
                multipleChoiceInputs = document.getElementById('multipleChoiceInputs');
                mcQuestion = document.getElementById('mcQuestion');
                mcOptions = document.getElementById('mcOptions');
                mcCorrectAnswer = document.getElementById('mcCorrectAnswer');
                cancelAddQaBtn = document.getElementById('cancelAddQaBtn');
                addQaBtn = document.getElementById('addQaBtn');
                openAddExternalLinkModalBtn = document.getElementById('openAddExternalLinkModal');
                addExternalLinkModalOverlay = document.getElementById('addExternalLinkModalOverlay');
                externalLinkDisplayText = document.getElementById('externalLinkDisplayText');
                externalLinkUrl = document.getElementById('externalLinkUrl');
                cancelAddExternalLinkBtn = document.getElementById('cancelAddExternalLinkBtn');
                addExternalLinkBtn = document.getElementById('addExternalLinkBtn');
                confirmDeleteExternalLinkModalOverlay = document.getElementById('confirmDeleteExternalLinkModalOverlay');
                externalLinkToDeleteNameSpan = document.getElementById('externalLinkToDeleteName');
                cancelDeleteExternalLinkBtn = document.getElementById('cancelDeleteExternalLinkBtn');
                confirmDeleteExternalLinkBtn = document.getElementById('confirmDeleteExternalLinkBtn');
                websiteList = document.getElementById('websiteList');
                addNewWebsiteBtn = document.getElementById('addNewWebsiteBtn');
                websiteSearchInput = document.getElementById('websiteSearchInput');
                importWebsiteBtn = document.getElementById('importWebsiteBtn');
                importFileInput = document.getElementById('importFileInput');
                confirmDeleteWebsiteModalOverlay = document.getElementById('confirmDeleteWebsiteModalOverlay');
                websiteToDeleteNameSpan = document.getElementById('websiteToDeleteName');
                cancelDeleteWebsiteBtn = document.getElementById('cancelDeleteWebsiteBtn');
                confirmDeleteWebsiteBtn = document.getElementById('confirmDeleteWebsiteBtn');

                if (messageCloseBtn) messageCloseBtn.addEventListener('click', dismissMessage);
                if (copyCodeBtn) {
                    copyCodeBtn.addEventListener('click', () => {
                        try {
                            if (monacoEditor) {
                                const codeText = monacoEditor.getValue();
                                const tempInput = document.createElement('textarea');
                                tempInput.value = codeText;
                                document.body.appendChild(tempInput);
                                tempInput.select();
                                document.execCommand('copy');
                                document.body.removeChild(tempInput);
                                showMessage("Code copied to clipboard!", 'success');
                            } else {
                                showMessage("Code editor not initialized.", 'error');
                            }
                        } catch (error) {
                            showMessage("An unexpected error occurred during copy.", 'error');
                        }
                    });
                }
                if (editCodeBtn) editCodeBtn.addEventListener('click', toggleCodeEditorEditMode);
                if (loadUrlHtmlBtn) loadUrlHtmlBtn.addEventListener('click', openLoadUrlHtmlModal);
                if (cancelLoadUrlHtmlBtn) cancelLoadUrlHtmlBtn.addEventListener('click', closeLoadUrlHtmlModal);
                if (confirmLoadUrlHtmlBtn) confirmLoadUrlHtmlBtn.addEventListener('click', loadHtmlFromUrl);
                if (htmlUrlInput) htmlUrlInput.addEventListener('keypress', (event) => { if (event.key === 'Enter') loadHtmlFromUrl(); });
                if (loadUrlHtmlModalOverlay) loadUrlHtmlModalOverlay.addEventListener('click', (event) => { if (event.target === loadUrlHtmlModalOverlay) closeLoadUrlHtmlModal(); });
                if (refreshPreviewBtn) refreshPreviewBtn.addEventListener('click', openPreview);
                if (openInNewTabBtn) {
                    openInNewTabBtn.addEventListener('click', () => {
                        try {
                            const generatedHtml = generateFullWebsiteHtml();
                            const blob = new Blob([generatedHtml], { type: 'text/html' });
                            const url = URL.createObjectURL(blob);
                            window.open(url, '_blank');
                        } catch (error) {
                            showMessage("Failed to open preview in new tab: " + error.message, 'error');
                        }
                    });
                }
                if (nameInput) nameInput.addEventListener('input', saveCurrentWebsiteToLibrary);
                if (logoUrlInput) logoUrlInput.addEventListener('input', updateLogoPreview);
                if (faviconUrlInput) faviconUrlInput.addEventListener('input', saveCurrentWebsiteToLibrary);
                if (metaInput) metaInput.addEventListener('input', saveCurrentWebsiteToLibrary);
                if (ogTitleInput) ogTitleInput.addEventListener('input', saveCurrentWebsiteToLibrary);
                if (ogDescriptionInput) ogDescriptionInput.addEventListener('input', saveCurrentWebsiteToLibrary);
                if (ogImageUrlInput) ogImageUrlInput.addEventListener('input', saveCurrentWebsiteToLibrary);
                if (ogImageWidthInput) ogImageWidthInput.addEventListener('input', saveCurrentWebsiteToLibrary);
                if (ogImageHeightInput) ogImageHeightInput.addEventListener('input', saveCurrentWebsiteToLibrary);
                if (twitterCardTypeSelect) twitterCardTypeSelect.addEventListener('change', saveCurrentWebsiteToLibrary);
                if (hostingUrlInput) hostingUrlInput.addEventListener('input', saveCurrentWebsiteToLibrary);
                if (copyrightHolderInput) copyrightHolderInput.addEventListener('input', saveCurrentWebsiteToLibrary);
                if (copyrightYearInput) copyrightYearInput.addEventListener('input', saveCurrentWebsiteToLibrary);
                if (contactEmailInput) contactEmailInput.addEventListener('input', saveCurrentWebsiteToLibrary);
                if (facebookUrlInput) facebookUrlInput.addEventListener('input', saveCurrentWebsiteToLibrary);
                if (twitterUrlInput) twitterUrlInput.addEventListener('input', saveCurrentWebsiteToLibrary);
                if (linkedinUrlInput) linkedinUrlInput.addEventListener('input', saveCurrentWebsiteToLibrary);
                showScrollToTopRadios.forEach(radio => radio.addEventListener('change', saveCurrentWebsiteToLibrary));
                if (pageList) {
                    pageList.addEventListener('click', (event) => {
                        const target = event.target.closest('.action-icon, .page-item');
                        if (!target) return;
                        const pageItemId = target.closest('.page-item')?.dataset.id;
                        if (target.classList.contains('action-icon')) {
                            const action = target.dataset.action;
                            const id = target.dataset.id;
                            if (action === 'edit') openEditPageModal(id);
                            else if (action === 'delete') openConfirmDeleteModal(id);
                            else if (action === 'move-up') movePage(id, 'up');
                            else if (action === 'move-down') movePage(id, 'down');
                        } else if (target.tagName !== 'INPUT') {
                            openPageEditor(pageItemId);
                        }
                    });
                }
                if (openAddPageModalBtn) openAddPageModalBtn.addEventListener('click', openAddPageModal);
                if (cancelAddPageBtn) cancelAddPageBtn.addEventListener('click', closeAddPageModal);
                if (confirmAddPageBtn) confirmAddPageBtn.addEventListener('click', () => { addPage(modalNewPageNameInput.value); });
                if (modalNewPageNameInput) modalNewPageNameInput.addEventListener('keypress', (event) => { if (event.key === 'Enter') addPage(modalNewPageNameInput.value); });
                if (addPageModalOverlay) addPageModalOverlay.addEventListener('click', (event) => { if (event.target === addPageModalOverlay) closeAddPageModal(); });
                if (cancelEditPageBtn) cancelEditPageBtn.addEventListener('click', closeEditPageModal);
                if (saveEditPageBtn) saveEditPageBtn.addEventListener('click', saveEditedPage);
                if (modalEditPageNameInput) modalEditPageNameInput.addEventListener('keypress', (event) => { if (event.key === 'Enter') saveEditedPage(); });
                if (editPageModalOverlay) editPageModalOverlay.addEventListener('click', (event) => { if (event.target === editPageModalOverlay) closeEditPageModal(); });
                if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeConfirmDeleteModal);
                if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', deletePageConfirmed);
                if (confirmDeleteModalOverlay) confirmDeleteModalOverlay.addEventListener('click', (event) => { if (event.target === confirmDeleteModalOverlay) closeConfirmDeleteModal(); });
                headerIcons.forEach(icon => {
                    if (icon) {
                        icon.addEventListener('click', () => {
                            headerIcons.forEach(i => i.classList.remove('selected'));
                            icon.classList.add('selected');
                            if (icon.id === 'libraryIcon') openLibraryView();
                            else if (icon.id === 'editIcon') showView(generatorView);
                            else if (icon.id === 'previewIcon') openPreview();
                            else if (icon.id === 'codeIcon') openCodeView();
                        });
                    }
                });
                if (pageEditorBackBtn) pageEditorBackBtn.addEventListener('click', closePageEditor);
                if (pageEditorPlusBtn) pageEditorPlusBtn.addEventListener('click', openAddContentTypeModal);
                if (cancelAddContentTypeBtn) cancelAddContentTypeBtn.addEventListener('click', closeAddContentTypeModal);
                if (contentTypeList) {
                    contentTypeList.addEventListener('click', (event) => {
                        const target = event.target.closest('.content-type-list-item');
                        if (target) {
                            const contentType = target.dataset.type;
                            switch (contentType) {
                                case 'heading': openSpecificContentModal(addHeadingModalOverlay); break;
                                case 'list': openSpecificContentModal(addListModalOverlay); break;
                                case 'table': openSpecificContentModal(addTableModalOverlay); break;
                                case 'formula': openSpecificContentModal(addFormulaModalOverlay); break;
                                case 'url': openSpecificContentModal(addUrlModalOverlay); break;
                                case 'code': openSpecificContentModal(addCodeModalOverlay); break;
                                case 'image': openSpecificContentModal(addImageModalOverlay); break;
                                case 'pdf': openSpecificContentModal(addPdfModalOverlay); break;
                                case 'iframe': openSpecificContentModal(addIframeModalOverlay); break;
                                case 'video': openSpecificContentModal(addVideoModalOverlay); break;
                                case 'map': openSpecificContentModal(addMapModalOverlay); break;
                                case 'bold': openSpecificContentModal(addBoldModalOverlay); break;
                                case 'italics': openSpecificContentModal(addItalicsModalOverlay); break;
                                case 'question-answer': openSpecificContentModal(addQuestionAnswerModalOverlay); break;
                            }
                        }
                    });
                }
                if (addContentTypeModalOverlay) addContentTypeModalOverlay.addEventListener('click', (event) => { if (event.target === addContentTypeModalOverlay) closeAddContentTypeModal(); });
                if (cancelAddHeadingBtn) cancelAddHeadingBtn.addEventListener('click', () => closeSpecificContentModal(addHeadingModalOverlay));
                if (addHeadingBtn) addHeadingBtn.addEventListener('click', addHeadingToEditor);
                if (cancelAddListBtn) cancelAddListBtn.addEventListener('click', () => closeSpecificContentModal(addListModalOverlay));
                if (addListBtn) addListBtn.addEventListener('click', addListToEditor);
                if (cancelAddTableBtn) cancelAddTableBtn.addEventListener('click', () => closeSpecificContentModal(addTableModalOverlay));
                if (addTableBtn) addTableBtn.addEventListener('click', addTableToEditor);
                if (cancelAddFormulaBtn) cancelAddFormulaBtn.addEventListener('click', () => closeSpecificContentModal(addFormulaModalOverlay));
                if (addFormulaBtn) addFormulaBtn.addEventListener('click', addFormulaToEditor);
                if (cancelAddUrlBtn) cancelAddUrlBtn.addEventListener('click', () => closeSpecificContentModal(addUrlModalOverlay));
                if (addUrlBtn) addUrlBtn.addEventListener('click', addUrlToEditor);
                if (cancelAddCodeBtn) cancelAddCodeBtn.addEventListener('click', () => closeSpecificContentModal(addCodeModalOverlay));
                if (addCodeBtn) addCodeBtn.addEventListener('click', addCodeToEditor);
                if (cancelAddImageBtn) cancelAddImageBtn.addEventListener('click', () => closeSpecificContentModal(addImageModalOverlay));
                if (addImageBtn) addImageBtn.addEventListener('click', addImageToEditor);
                if (cancelAddPdfBtn) cancelAddPdfBtn.addEventListener('click', () => closeSpecificContentModal(addPdfModalOverlay));
                if (addPdfBtn) addPdfBtn.addEventListener('click', addPdfToEditor);
                if (cancelAddIframeBtn) cancelAddIframeBtn.addEventListener('click', () => closeSpecificContentModal(addIframeModalOverlay));
                if (addIframeBtn) addIframeBtn.addEventListener('click', addIframeToEditor);
                if (cancelAddVideoBtn) cancelAddVideoBtn.addEventListener('click', () => closeSpecificContentModal(addVideoModalOverlay));
                if (addVideoBtn) addVideoBtn.addEventListener('click', addVideoToEditor);
                if (cancelAddMapBtn) cancelAddMapBtn.addEventListener('click', () => closeSpecificContentModal(addMapModalOverlay));
                if (addMapBtn) addMapBtn.addEventListener('click', addMapToEditor);
                if (cancelAddBoldBtn) cancelAddBoldBtn.addEventListener('click', () => closeSpecificContentModal(addBoldModalOverlay));
                if (addBoldBtn) addBoldBtn.addEventListener('click', addBoldToEditor);
                if (cancelAddItalicsBtn) cancelAddItalicsBtn.addEventListener('click', () => closeSpecificContentModal(addItalicsModalOverlay));
                if (addItalicsBtn) addItalicsBtn.addEventListener('click', addItalicsToEditor);
                if (menuButton) menuButton.addEventListener('click', openMobileSidebar);
                if (mobileSidebarOverlay) mobileSidebarOverlay.addEventListener('click', (event) => { if (event.target === mobileSidebarOverlay || event.target.closest('.sidebar-page-item')) closeMobileSidebar(); });
                if (qaTypeSelect) qaTypeSelect.addEventListener('change', (event) => showQaInputs(event.target.value));
                if (cancelAddQaBtn) cancelAddQaBtn.addEventListener('click', () => closeSpecificContentModal(addQuestionAnswerModalOverlay));
                if (addQaBtn) addQaBtn.addEventListener('click', addQuestionAnswerToEditor);
                if (addQuestionAnswerModalOverlay) addQuestionAnswerModalOverlay.addEventListener('click', (event) => { if (event.target === addQuestionAnswerModalOverlay) closeSpecificContentModal(addQuestionAnswerModalOverlay); });
                if (openAddExternalLinkModalBtn) openAddExternalLinkModalBtn.addEventListener('click', () => openSpecificContentModal(addExternalLinkModalOverlay));
                if (cancelAddExternalLinkBtn) cancelAddExternalLinkBtn.addEventListener('click', () => closeSpecificContentModal(addExternalLinkModalOverlay));
                if (addExternalLinkBtn) addExternalLinkBtn.addEventListener('click', addExternalLink);
                if (addExternalLinkModalOverlay) addExternalLinkModalOverlay.addEventListener('click', (event) => { if (event.target === addExternalLinkModalOverlay) closeSpecificContentModal(addExternalLinkModalOverlay); });
                if (externalLinkList) {
                    externalLinkList.addEventListener('click', (event) => {
                        const target = event.target.closest('.action-icon, .external-link-item');
                        if (!target) return;
                        const linkId = target.closest('.external-link-item')?.dataset.id;
                        if (target.dataset.action === 'delete-external-link') openConfirmDeleteExternalLinkModal(linkId);
                    });
                }
                if (cancelDeleteExternalLinkBtn) cancelDeleteExternalLinkBtn.addEventListener('click', closeConfirmDeleteExternalLinkModal);
                if (confirmDeleteExternalLinkBtn) confirmDeleteExternalLinkBtn.addEventListener('click', deleteExternalLinkConfirmed);
                if (confirmDeleteExternalLinkModalOverlay) confirmDeleteExternalLinkModalOverlay.addEventListener('click', (event) => { if (event.target === confirmDeleteExternalLinkModalOverlay) closeConfirmDeleteExternalLinkModal(); });

                if (addNewWebsiteBtn) addNewWebsiteBtn.addEventListener('click', startNewWebsite);
                if (importWebsiteBtn) importWebsiteBtn.addEventListener('click', importWebsite);
                if (importFileInput) importFileInput.addEventListener('change', handleImportFile);
                if (websiteList) {
                    websiteList.addEventListener('click', (event) => {
                        const target = event.target.closest('.website-action-icon');
                        if (!target) return;
                        const websiteId = target.dataset.id;
                        if (target.dataset.action === 'open-website') loadWebsiteFromLibrary(websiteId);
                        else if (target.dataset.action === 'export-website') exportWebsite(websiteId);
                        else if (target.dataset.action === 'delete-website') openConfirmDeleteWebsiteModal(websiteId);
                    });
                }
                if (websiteSearchInput) websiteSearchInput.addEventListener('input', (event) => renderWebsiteList(event.target.value));
                if (cancelDeleteWebsiteBtn) cancelDeleteWebsiteBtn.addEventListener('click', closeConfirmDeleteWebsiteModal);
                if (confirmDeleteWebsiteBtn) confirmDeleteWebsiteBtn.addEventListener('click', deleteWebsiteFromLibraryConfirmed);
                if (confirmDeleteWebsiteModalOverlay) confirmDeleteWebsiteModalOverlay.addEventListener('click', (event) => { if (event.target === confirmDeleteWebsiteModalOverlay) closeConfirmDeleteWebsiteModal(); });

                loadAllWebsitesFromLocalStorage();
                if (allWebsites.length > 0) {
                    loadWebsiteFromLibrary(allWebsites[0].id);
                } else {
                    startNewWebsite();
                }
            });
        })();
