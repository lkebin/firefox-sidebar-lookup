const container = document.querySelector('.lookup-sidebar iframe')
const source = document.querySelector('.lookup-sidebar select[name="source"]')
const updateOnSelectionChange = document.querySelector('.lookup-sidebar input[name="updateOnSelectionChange"]')
const sourceMap = [
    {key: 'google-translate', name: 'Google Translate', url: 'https://translate.google.com/?sl=auto&tl=zh-CN&text={word}', jsUpdate: true, homePage: 'https://translate.google.com'},
    {key: 'zdic', name: '汉典', url: 'https://www.zdic.net/hans/{word}', jsUpdate: false, homePage: 'https://www.zdic.net'},
];

function lookup(text) {
    browser.storage.local.get('source').then(result => {
        let s
        sourceMap.forEach(function(v) {
            if (v.key == result.source) {
                s= v
            }
        })
        return s
    }).then(source => {
        if (source.jsUpdate) {
            container.contentWindow.postMessage({selectText: text}, "*")
        } else {
            container.setAttribute('src', source.url.replace('{word}', text))
        }

        browser.storage.local.set({selectText: text})
    })
}

function handleMessage(request)  {
    if (request.event == "selectionchange") {
        browser.storage.local.get('updateOnSelectionChange').then((data) => {
            if (data.updateOnSelectionChange) {
                lookup(request.selectText)
            }
        })
    } else {
        lookup(request.selectText)
    }
}

async function getSelectText() {
    return browser.storage.local.get("selectText").then((result) => {
        if (result.hasOwnProperty("selectText")) {
            return result.selectText
        }
    }).catch((err) => {
        console.log(err)
    })
}

updateOnSelectionChange.addEventListener('change', function(e) {
    if (e.target.checked) {
        browser.storage.local.set({'updateOnSelectionChange': true})
    } else {
        browser.storage.local.set({'updateOnSelectionChange': false})
    }
})

browser.runtime.onMessage.addListener(handleMessage)

source.addEventListener('change', async function(e) {
    browser.storage.local.set({source: e.target.value})

    let source
    sourceMap.forEach(function(v) {
        if (v.key == e.target.value) {
            source = v
        }
    })

    const text = await getSelectText()
    if (text) {
        container.setAttribute('src', source.url.replace('{word}', text))
    } else {
        container.setAttribute('src', source.homePage)
    }
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

browser.storage.local.get('updateOnSelectionChange').then((result) => {
    if (result.hasOwnProperty('updateOnSelectionChange')) {
        updateOnSelectionChange.checked = result.updateOnSelectionChange
    } else {
        // default to checked
        updateOnSelectionChange.checked = true
    }
    updateOnSelectionChange.dispatchEvent(new Event('change'))
})

window.addEventListener('unload', function() {
    browser.storage.local.remove('selectText')
})
