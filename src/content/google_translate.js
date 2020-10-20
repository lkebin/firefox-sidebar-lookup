window.addEventListener('message', function(msg) {
    if (msg.data.hasOwnProperty('selectText')) {
        document.querySelector('textarea#source').value = msg.data.selectText
    }
})
