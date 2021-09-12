const startReactor = {

    computerCombination: [],
    playerCombination: [],
    computerCombinationPosition: 1,
    combinationMaxPostion: 5,
    memoryMaxCombination: 9,

    audio: {
        start: 'start.mp3',
        fail: 'fail.mp3',
        complete: 'complete.mp3',
        combinations: ['0.mp3', '1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3', '6.mp3', '7.mp3', '8.mp3'],

        loadAudio(filename) {
            const file = `./audio/${filename}?cb=${new Date().getTime()}`
            const audio = new Audio(file)
            audio.load()
            return audio
        },

        loadAudios() {
            if(typeof startReactor.audio.start === `object` )return

            startReactor.audio.start = startReactor.audio.loadAudio(startReactor.audio.start)
            startReactor.audio.complete = startReactor.audio.loadAudio(startReactor.audio.complete)
            startReactor.audio.fail = startReactor.audio.loadAudio(startReactor.audio.fail)
            startReactor.audio.combinations = startReactor.audio.combinations.map(audio => startReactor.audio.loadAudio(audio))
        }

    },
    interface: {
        memoryPanel: document.querySelector(`.painelMemory`),
        computerPanel: document.querySelector(`.computerLedPanel`),
        playerLedPanel: document.querySelector(`.playerLedPanel`),
        playerMemory: document.querySelector(`.playerMemory`),
        playerMemoryButtons: document.getElementsByClassName(`player_memory`),

        turnLedOn(index, ledPanel){
            ledPanel.children[index].classList.add("ledOn")
        },

        turnAllLeds() {
            const computerLedPanel = startReactor.interface.computerPanel
            const playerLedPanel = startReactor.interface.playerLedPanel

            Array(computerLedPanel.children.length).fill().map((_, i) => {
                computerLedPanel.children[i].classList.remove(`ledOn`)
                playerLedPanel.children[i].classList.remove(`ledOn`)
            })

        },
        async start() {
            return startReactor.audio.start.play()
        },

        playItem(index, combinationPosition, location = `computer`) {
            const leds = (location == `computer` ? startReactor.interface.computerPanel: startReactor.interface.playerLedPanel)
            const memPanel = startReactor.interface.memoryPanel.children[index]

            console.log(leds)

            memPanel.classList.add(`memoryActive`)
            startReactor.interface.turnLedOn(combinationPosition, leds)

            startReactor.audio.combinations[index].play().then(() => {
                setTimeout(() => {
                    memPanel.classList.remove(`memoryActive`)
                }, 150)
            })
        },
        
        endGame(type = "fail") {
            
            const memPanel = startReactor.interface.memoryPanel
            const ledPanel = startReactor.interface.computerPanel
            const audio = (type == "complete") ? startReactor.audio.complete : startReactor.audio.fail
            const typeClasses = (type == "complete") ? ["playerMemoryComplete", "playerLedComplete"] : ["playerMemoryError", "playerLedError"]

            startReactor.interface.disableButtons()
            startReactor.interface.turnAllLeds()

            audio.play().then(() => {

                for (var i = 0; i < memPanel.children.length; i++) {
                    if (memPanel.children[i].tagName == "DIV")
                        memPanel.children[i].classList.add(typeClasses[0])
                }
                for (var i = 0; i < ledPanel.children.length; i++) {
                    if (ledPanel.children[i].tagName == "DIV")
                        ledPanel.children[i].classList.add(typeClasses[1])
                }
                setTimeout(() => {
                    for (var i = 0; i < memPanel.children.length; i++) {
                    if (memPanel.children[i].tagName == "DIV")
                        memPanel.children[i].classList.remove(typeClasses[0])
                    }
                    for (var i = 0; i < ledPanel.children.length; i++) {
                    if (ledPanel.children[i].tagName == "DIV")
                        ledPanel.children[i].classList.remove(typeClasses[1])
                    }
                }, 900);

            })

        },

        enableButtons() {
            const playerMemory = startReactor.interface.playerMemory
            playerMemory.classList.add(`playerActive`)

            Array(playerMemory.children.length).fill().map((_,i) => {
                if(playerMemory.children[i].tagName === `DIV`)
                    playerMemory.children[i].classList.add(`playerMemoryActive`)
            })
        },
        
        disableButtons() {
            const playerMemory = startReactor.interface.playerMemory
            playerMemory.classList.remove(`playerActive`)

            Array(playerMemory.children.length).map((_, i) => {
                if(playerMemory.children[i].tagName === `DIV`)
                    playerMemory.children.classList.remove(`playerMemoryActive`)
            })
        },
    },

    async load() {
        return new Promise(resolve => {
            startReactor.audio.loadAudios()

            const playerMemory = startReactor.interface.playerMemory
            const memory = startReactor.interface.playerMemoryButtons

            Array.prototype.forEach.call(memory, (elem) => {
                console.log(elem)
                elem.addEventListener(`click`, () => {
                    if(playerMemory.classList.contains(`playerActive`)) {
                        startReactor.play(parseInt(elem.dataset.memory))
                        elem.style.animation = `playermemoryClick .4s`
                        setTimeout(() => elem.style.animation = ``, 400)
                    }
                })
            })
        })


    },
    start() {
        startReactor.computerCombination = startReactor.createCombination()
        startReactor.computerCombinationPosition = 1
        startReactor.playerCombination = []
        startReactor.interface.start().then(() => {
            setTimeout(() => {
                startReactor.playCombination()
            },500)
        })


    },

    createCombination() {
        const newCombination = []
        Array(startReactor.combinationMaxPostion).fill().map((_, i) => {
            const position = Math.floor( (Math.random() * startReactor.combinationMaxPostion) + 1)
            newCombination.push(position - 1)
        })
        return newCombination
    },

    play(index) {

        startReactor.interface.playItem(index, startReactor.playerCombination.length, 'player')
        startReactor.playerCombination.push(index)

        if (startReactor.isTheRightCombination(startReactor.playerCombination.length)) {
            
            if (startReactor.playerCombination.length == startReactor.combinationMaxPostion) {
                startReactor.interface.endGame("complete")
                setTimeout(() => {
                    startReactor.start()
                }, 1200)
                return
            }

            if (startReactor.playerCombination.length == startReactor.computerCombinationPosition) {
                startReactor.computerCombinationPosition++
                setTimeout(() => {
                        startReactor.playCombination()
                }, 1200)
                return
            }

        } else {

            startReactor.interface.endGame("fail")
            document.getElementById("title").textContent = "Você é o impostor"
            setTimeout(() => {
                document.getElementById("title").textContent = "START REACTOR"
                startReactor.start()
            }, 1400)
            return
        }
    },

    playCombination() {

        startReactor.playerCombination = []
        startReactor.interface.disableButtons()
        startReactor.interface.turnAllLeds()

        for (let i = 0; i <= startReactor.computerCombinationPosition - 1; i++){

            setTimeout(() => {
                startReactor.interface.playItem(startReactor.computerCombination[i], i)
            }, 400 * (i+1))
        }

        setTimeout(() => {
            startReactor.interface.turnAllLeds()
            startReactor.interface.enableButtons()
        }, 600 * startReactor.computerCombinationPosition)

     },
    
    isTheRightCombination(position) {
        
        let computerCombination = startReactor.computerCombination.slice(0, position)
        return ( computerCombination.toString() == startReactor.playerCombination.toString())

    },
}