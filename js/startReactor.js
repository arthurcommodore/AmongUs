const startReactor = {

    computerCombination: [],
    playerCombination: [],
    computerCombinationPosition: 1,
    computerMaxPosition: 5,
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
        playerMemoryButtons: document.querySelectorAll(`player_memory`),

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
            const leds = (location == `computer` ? startReactor.interface.computerPanel : startReactor.interface.playerLedPanel)
            const memPanel = startReactor.interface.memoryPanel.children[index]

            memPanel.classList.add(`memoryActive`)
            startReactor.interface.turnLedOn(combinationPosition, leds)

            startReactor.audio.combinations[index].play().then(() => {
                setTimeout(() => {
                    memPanel.classList.remove(`memoryActive`)
                }, 150)
            })
        }
       

    },

    load() {},
    start() {
        startReactor.createCombination = startReactor.createCombination()
        startReactor.computerCombinationPosition = 1
        startReactor.playerCombination = [],
        startReactor.interface.start().then(() => {
            setTimeout(() => {
                startReactor.playCombination()
            },500)
        })


    },

    createCombination() {
        const newCombination = []
        Array(startReactor.computerMaxPosition).fill().map((_, i) => {
            const position = Math.floor( (Math.random() * startReactor.computerMaxPosition) )
            newCombination.push(position)
        })
        return newCombination
    },
    playCombination() {
            
    }
}