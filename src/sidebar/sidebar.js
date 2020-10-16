const container = document.querySelector('.lookup-sidebar iframe')

function lookup(text) {
    container.setAttribute('src', `https://translate.google.cn?sl=auto&tl=zh-CN&text=${text}`)
    browser.storage.local.remove("selectText")
}

function handleMessage(request, sender, sendResponse) {
    lookup(request.selectText)
}

browser.runtime.onMessage.addListener(handleMessage)

browser.storage.local.get("selectText").then((result) => {
    if (result.hasOwnProperty("selectText")) {
        lookup(result.selectText)
    }
}).catch((err) => {
    console.log(err)
})
