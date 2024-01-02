const express = require("express")
const path = require("path")
const http = require("http")
const socketIO = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

server.listen(3000)

app.use(express.static(path.join(__dirname, "public")))

let player1 = null
let player2 = null

let originalCards = [
    "color_green_1.png", "color_green_2.png", "color_green_3.png", "color_green_4.png", "color_green_5.png", "color_green_6.png", "color_green_7.png", "color_green_8.png", "color_green_9.png",
    "color_purple_1.png", "color_purple_2.png", "color_purple_3.png", "color_purple_4.png", "color_purple_5.png", "color_purple_6.png", "color_purple_7.png", "color_purple_8.png", "color_purple_9.png",
    "color_red_1.png", "color_red_2.png", "color_red_3.png", "color_red_4.png", "color_red_5.png", "color_red_6.png", "color_red_7.png", "color_red_8.png", "color_red_9.png",
    "color_yellow_1.png", "color_yellow_2.png", "color_yellow_3.png", "color_yellow_4.png", "color_yellow_5.png", "color_yellow_6.png", "color_yellow_7.png", "color_yellow_8.png", "color_yellow_9.png"
]

let gameCards = []

io.on("connection", client => {
    client.on("game-create", (username) => {
        let cards
        if(gameCards.length === 0) {
            cards = sortCards()
        }
        if(player1 === null) {
            player1 = "Jogador 1"
            if(gameCards.length === 0) {
                cards = sortCards()
                client.emit("init", cards, player1)
            }
            else {
                client.emit("init", gameCards, player1)
            }
        }
        else if(player2 === null) {
            player2 = "Jogador 2"
            if(gameCards.length === 0) {
                cards = sortCards()
                client.emit("init", cards, player2)
            }
            else {
                client.emit("init", gameCards, player2)
            }
        }
        else {
            return
        }
        
    })
    
    client.on("card-picked", (card, player) => {
        if(player1 != null && player2 != null) {
            let total = calculateCards(card)
            io.emit("total-points", total, player, card)
        }
    })
    
    client.on("game-over", (player, points) => {
        io.emit("game-results", player, points)
    })

})

function calculateCards(card) {
    
    if(card === "color_green_1.png" || card === "color_purple_1.png" || card === "color_red_1.png" || card === "color_yellow_1.png") {
        return 1
    }
    if(card === "color_green_2.png" || card === "color_purple_2.png" || card === "color_red_2.png" || card === "color_yellow_2.png") {
        return 2
    }
    if(card === "color_green_3.png" || card === "color_purple_3.png" || card === "color_red_3.png" || card === "color_yellow_3.png") {
        return 3
    }
    if(card === "color_green_4.png" || card === "color_purple_4.png" || card === "color_red_4.png" || card === "color_yellow_4.png") {
        return 4
    }
    if(card === "color_green_5.png" || card === "color_purple_5.png" || card === "color_red_5.png" || card === "color_yellow_5.png") {
        return 5
    }
    if(card === "color_green_6.png" || card === "color_purple_6.png" || card === "color_red_6.png" || card === "color_yellow_6.png") {
        return 6
    }
    if(card === "color_green_7.png" || card === "color_purple_7.png" || card === "color_red_7.png" || card === "color_yellow_7.png") {
        return 7
    }
    if(card === "color_green_8.png" || card === "color_purple_8.png" || card === "color_red_8.png" || card === "color_yellow_8.png") {
        return 8
    }
    if(card === "color_green_9.png" || card === "color_purple_9.png" || card === "color_red_9.png" || card === "color_yellow_9.png") {    
        return 9
    }
}

function sortCards() {    
   
    for(let i = 0; i < 36; i++) {
        let index = Math.floor(Math.random() * originalCards.length)        
        gameCards.push(originalCards[index])
        originalCards.splice(index, 1)
    }    
    return gameCards

}
