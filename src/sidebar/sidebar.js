const container = document.querySelector('.lookup-sidebar iframe')
const source = document.querySelector('.lookup-sidebar select[name="source"]')
const sourceMap = [
    {key: 'google-translate-cn', name: 'Google Translate (China)', url: 'https://translate.google.cn/?sl=auto&tl=zh-CN'},
    {key: 'google-translate', name: 'Google Translate (Global)', url: 'https://translate.google.com/?sl=auto'},
];

function lookup(text) {
    document.querySelector('iframe').contentWindow.postMessage({selectText: text}, "*")
    browser.storage.local.set({selectText: text})
}

function handleMessage(request)  {
    lookup(request.selectText)
}

container.addEventListener('load', function() {
    browser.storage.local.get("selectText").then((result) => {
        if (result.hasOwnProperty("selectText")) {
            lookup(result.selectText)
        }
    }).catch((err) => {
        console.log(err)
    })
})

browser.runtime.onMessage.addListener(handleMessage)

source.addEventListener('change', async function(e) {
    browser.storage.local.set({source: e.target.value})

    sourceMap.forEach(function(v) {
        if (v.key == e.target.value) {
            container.setAttribute('src', v.url)
        }
    })
})

browser.storage.local.get('source').then((result) => {
    sourceMap.forEach(function(v) {
        defaultSelect = (v.key == 'google-translate-cn')
        source.appendChild(new Option(v.name, v.key, defaultSelect, false))    
    })

    for(var i = 0; i < source.options.length; i++) {
        if (result.source == source.options[i].value && source.options[i].selected != 'selected') {
            source.options[i].selected = 'selected'            
        }
    }

    source.dispatchEvent(new Event('change'))
})

window.addEventListener('unload', function() {
    browser.storage.local.remove('selectText')
})
