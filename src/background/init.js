browser.webRequest.onHeadersReceived.addListener(
    (info) => {
        let headers = info.responseHeaders.filter(header => {
            let name = header.name.toLowerCase();
            return name !== 'x-frame-options' && name !== 'frame-options';
        });

        return {responseHeaders: headers};
    }, 
    {
        urls: [
            '*://translate.google.com/*',
            '*://translate.google.cn/*',
        ],
        types: ['sub_frame']
    }, 
    ['blocking', 'responseHeaders']
)

browser.webRequest.onBeforeSendHeaders.addListener(
    (info) => {
        let headers = info.requestHeaders.map(header => {
            let name = header.name.toLowerCase();
            if (name == 'user-agent') {
                header.value = header.value + " Mobile "
            }

            return header
        });

        return {requestHeaders: headers};
    },
    {
        urls: [
            '*://translate.google.com/*',
            '*://translate.google.cn/*',
        ],
        types: ['sub_frame']
    },
    ['blocking', 'requestHeaders']
)

browser.menus.create({
    id: 'sidebar-lookup',
    title: 'Look Up ...',
    contexts: ["selection"],
})

browser.menus.onClicked.addListener(function(info, tab) {
    let text = info.selectionText
    if (text.trim() != '') {
        browser.storage.local.set({selectText: text})
        browser.sidebarAction.open()
        browser.runtime.sendMessage({selectText: text})
    }
})

