const socket = io.connect('http://localhost:8080')

document.addEventListener('DOMContentLoaded', () => {

    // DOM
    let messageArea = document.getElementById('messageArea')
    let qRubrik = document.querySelector('#questArea h1')
    let qParagraph = document.querySelector('#questArea p')
    let qSvar = document.querySelector('#questArea input')
    let qBtn = document.querySelector('#questArea button')

    socket.on('setup', (data) => {
        messageArea.innerText = 'Välkommen, ' + data
    })

    socket.on('ask', (question) => {
        qRubrik.innerText = 'Redo för fråga ' + question.i + '?'
        setTimeout(() => {
            qParagraph.innerText = question.q
        }, 1000)
    })

    socket.on('correct', (data) => {
        if (socket.id == data.winner)
            qRubrik.innerText += " Correct"
        qParagraph.innerHTML += '<p>Rätt svar gavs av user ' + data.winner + ' på tiden ' + data.time + ' sekunder.'

        qBtn.innerText = 'Nästa fråga'
        qSvar.value = -1
    })

    socket.on('end', () => {
        qRubrik.innerText = "Tävlingen slut"
        qParagraph.innerHTML = ""
    })

    qBtn.addEventListener('click', () => {
        if (qSvar.value != -1) {
            socket.emit('answer', {
                a: qSvar.value
            })
        } else {
            qRubrik.innerText = ""
            qParagraph.innerHTML = ""
            socket.emit('new question')
        }
    })
})