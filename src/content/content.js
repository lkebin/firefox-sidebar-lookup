document.addEventListener('selectionchange', function(e) {
    let text = document.getSelection().toString()
    if ( text.trim() != "") {
        browser.runtime.sendMessage({selectText: text, event: 'selectionchange'})
    }
})

