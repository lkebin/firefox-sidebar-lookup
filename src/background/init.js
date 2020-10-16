browser.webRequest.onHeadersReceived.addListener(
    info => {
        let headers = info.responseHeaders.filter(header => {
            let name = header.name.toLowerCase();
            return name !== 'x-frame-options' && name !== 'frame-options';
        }
        );
        return {responseHeaders: headers};
    }, 
    {
        urls: [
            '*://translate.google.com/*',
            '*://translate.google.cn/*'
        ],
        types: ['sub_frame']
    }, 
    ['blocking', 'responseHeaders']
)

browser.menus.create({
    id: 'lookup',
    title: 'Look Up ...',
    contexts: ["selection"],
})

browser.menus.onClicked.addListener(function(info, tab) {
    let selectedText = info.selectionText
    if (selectedText.trim() != '') {
        browser.storage.local.set({selectText: selectedText})
        browser.sidebarAction.open()
    }
})
