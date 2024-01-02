const socket = io()

const startBtn = document.querySelector("#start")
const infoDiv = document.querySelector("#information")
let myName
let running = false
const myCards = []
const cardwidth = "64px"
const cardheight = "64px"
let totalCount = 0

function handleInit(cards, player) {    
    running = true
    myName = player
    const tableCards = document.querySelector("#cards")
    const me = document.querySelector("#my-cards")
    tableCards.innerHTML = ""
    infoDiv.innerHTML = ""
    infoDiv.innerHTML = player + " entrou no jogo..."

    for(let i = 0; i < cards.length; i++) {        
        let imgCard = document.createElement("img")
        imgCard.style.width = cardwidth
        imgCard.style.height = cardheight
        imgCard.src = "images/color_wild.png"
        imgCard.setAttribute("name", cards[i])
        tableCards.appendChild(imgCard)
        imgCard.addEventListener("click", (e) => {            
            if(running && myCards.length < 12) {
                if(e.target.name != "images/color_wild.png" && e.target.name != "images/card_empty.png") {
                    myCards.push(e.target.name)
                    imgCard.src = "images/card_empty.png"
                    imgCard.style.width = cardwidth
                    imgCard.style.height = cardheight
                    imgCard.setAttribute("name", "images/card_empty.png")
                    let myCard = document.createElement("img")
                    myCard.src = "images/" + cards[i]
                    myCard.style.width = cardwidth
                    myCard.style.height = cardheight
                    me.appendChild(myCard)
                    socket.emit("card-picked", cards[i], myName)
                }
            }
        })
    }
}

startBtn.addEventListener("click", () => {
    startBtn.disabled = true    
    socket.emit("game-create", "player")
})

socket.on("init", handleInit)

socket.on("total-points", (total, player, card) => {
    if(player === myName) {
        totalCount += total
    }
    if(totalCount > 21) {
        socket.emit("game-over", myName, totalCount)        
    }
    else {
        let imgCard = document.querySelector(`[name="${card}"]`);
        imgCard.src = "images/card_empty.png"
        imgCard.style.width = cardwidth
        imgCard.style.height = cardheight
        imgCard.setAttribute("name", "images/card_empty.png")
        infoDiv.innerHTML = player + " pegou uma carta..."
    }
})

socket.on("game-results", (player, points) => {    
    if(player === myName) {
        infoDiv.classList.add("red")
        infoDiv.innerHTML = "Você perdeu, ultrapassando com " + points + " pontos"
        running = false
        socket.emit("disconnect")
    }
    else {
        infoDiv.classList.add("blue")
        infoDiv.innerHTML = "Você ganhou, oponente ultrapassou com " + points + " pontos"
        running = false
        socket.emit("disconnect")
    }
})
