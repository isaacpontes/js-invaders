import { useEffect, useRef, useState } from "react"
import playerShip from "./assets/player_ship.png"
import enemy1 from "./assets/enemy_1.png"
import enemy2 from "./assets/enemy_2.png"
import "./App.css"

const enemyTypes = {
  basic: `<div class="enemy-row basic"}>
    <span class="enemy"><img src="${enemy1}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy1}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy1}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy1}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy1}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy1}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy1}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy1}" width="24" height="24" /></span>
  </div>`,
  fast: `<div class="enemy-row fast"}>
    <span class="enemy"><img src="${enemy2}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy2}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy2}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy2}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy2}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy2}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy2}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy2}" width="24" height="24" /></span>
  </div>`,
  resistant: ``,
  "basic reverse": `<div class="enemy-row basic reverse"}>
    <span class="enemy"><img src="${enemy1}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy1}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy1}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy1}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy1}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy1}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy1}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy1}" width="24" height="24" /></span>
  </div>`,
  "fast reverse": `<div class="enemy-row fast reverse"}>
    <span class="enemy"><img src="${enemy2}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy2}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy2}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy2}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy2}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy2}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy2}" width="24" height="24" /></span>
    <span class="enemy"><img src="${enemy2}" width="24" height="24" /></span>
  </div>`
}


function checkCollision(elm1: Element, elm2: Element) {
  var elm1Rect = elm1.getBoundingClientRect()
  var elm2Rect = elm2.getBoundingClientRect()

  return (
    (elm1Rect.right >= elm2Rect.left && elm1Rect.left <= elm2Rect.right) &&
    (elm1Rect.bottom >= elm2Rect.top && elm1Rect.top <= elm2Rect.bottom)
  )
}

function App() {
  let score = useRef(0)
  let isReloading = false
  const RELOAD_TIME = 500
  const SHOOTING_SPEED = 1000
  const SPAWN_SPEED = 10000
  const gameRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const enemiesAreaRef = useRef<HTMLDivElement>(null)
  const [showGameOver, setShowGameOver] = useState(false)

  const reload = () => {
    isReloading = true
    setTimeout(() => isReloading = false, RELOAD_TIME)
  }
  
  const shoot = (player: HTMLElement, game: HTMLElement) => {
    if (isReloading) return
    const missile = document.createElement("div")
    missile.className = "missile"
    missile.style.left = `calc(${player.style.left} + 0.9rem)`
    game.appendChild(missile)
    setTimeout(() => missile.remove() , SHOOTING_SPEED)
    reload()
  }

  const moveLeft = (player: HTMLElement) => {
    const currentPosition = +player.style.left.replace(/%/, "")
    const newPosition = currentPosition > 2 ? currentPosition - 2 : 2
    player.style.left = `${newPosition}%`
  }

  const moveRight = (player: HTMLElement) => {
    const currentPosition = +player.style.left.replace(/%/, "")
    const newPosition = currentPosition < 94 ? currentPosition + 2 : 94
    player.style.left = `${newPosition}%`
  }

  const process = (event: KeyboardEvent) => {
    if (!gameRef.current || !playerRef.current) return
    if (event.key === "ArrowLeft") moveLeft(playerRef.current)
    else if (event.key === "ArrowRight") moveRight(playerRef.current)
    else if (event.code === "Space") shoot(playerRef.current, gameRef.current)
  }

  const calculateEnemyType = (score: number) => {
    let type: "basic" | "fast" | "basic reverse" | "fast reverse" = "basic"
    const rng = Math.floor(Math.random() * 100) + 1
    if (score >= 50 && score < 200) type = rng > 50 ? "fast" : "basic"
    else if (score >= 200) {
      if (rng < 25) type = "basic"
      else if (rng < 50) type = "fast"
      else if (rng < 75) type = "basic reverse"
      else type = "fast reverse"
    }
    return type
  }

  const spawnEnemies = (enemiesArea: HTMLElement) => {
    enemiesArea.innerHTML += enemyTypes[calculateEnemyType(score.current)]
    if (score.current >= 500) enemiesArea.innerHTML += enemyTypes[calculateEnemyType(score.current)]
  }

  const killEnemy = (missile: Element, enemy: Element) => {
    missile.remove()
    enemy.classList.add("dead")
    score.current++
    document.getElementById("score")!.innerText = score.current.toString().padStart(6, "0")
  }

  useEffect(() => {
    if (!playerRef.current) return
    playerRef.current.style.bottom = "24px"
    playerRef.current.style.left = `48%`
    document.addEventListener("keydown", process)
    return () => {
      document.removeEventListener("keydown", process)
    }
  }, [showGameOver])

  useEffect(() => {
    const spawnerId = setInterval(() => {
      if (!enemiesAreaRef.current) return
      spawnEnemies(enemiesAreaRef.current)
    }, SPAWN_SPEED)

    const collisionCheckerId = setInterval(() => {
      const missiles = document.querySelectorAll(".missile")
      const enemies = document.querySelectorAll(".enemy:not(.dead)")
      missiles.forEach((missile) => {
        enemies.forEach((enemy) => {
          const isColliding = checkCollision(missile, enemy)
          if (isColliding) killEnemy(missile, enemy)
        })
      })
    }, 1)

    const deadRowCleanerId = setInterval(() => {
      const deadRow = document.querySelector(".enemy-row:first-child:not(:has(.enemy:not(.dead)))")
      deadRow?.remove()
    }, 2000)

    const deathCheckerId = setInterval(() => {
      const enemies = document.querySelectorAll(".enemy:not(.dead)")
      const playerCollider = document.getElementById("player-collider")!
      enemies.forEach((enemy) => {
        if (!playerRef.current) return
        const isColliding = checkCollision(enemy, playerRef.current) || checkCollision(enemy, playerCollider)
        if (!isColliding) return
        setTimeout(() => setShowGameOver(true), 250)
      })
    })

    return () => {
      clearInterval(spawnerId)
      clearInterval(collisionCheckerId)
      clearInterval(deadRowCleanerId)
      clearInterval(deathCheckerId)
    }
  }, [showGameOver])

  const restart = () => {
    console.log("Sua pontuação foi: ", score.current)
    score.current = 0
    setShowGameOver(false)
    document.getElementById("score")!.innerText = "000000"
  }

  return (
    <div id="jsInvaders">
      <div id="title">
        <span>Space Invaders</span>
        <span>Score: <span id="score">000000</span></span>
      </div>
      
      {showGameOver ? (
        <div id="gameover">
          <p>VOCÊ PERDEU! {"=("}</p>
          <button onClick={restart}>Tentar novamente?</button>
        </div>
      ) : (
        <div id="game" ref={gameRef}>
          <div id="enemies" ref={enemiesAreaRef}>
            <div className="enemy-row basic">
              <span className="enemy"><img src={enemy1} width={24} height={24} /></span>
              <span className="enemy"><img src={enemy1} width={24} height={24} /></span>
              <span className="enemy"><img src={enemy1} width={24} height={24} /></span>
              <span className="enemy"><img src={enemy1} width={24} height={24} /></span>
              <span className="enemy"><img src={enemy1} width={24} height={24} /></span>
              <span className="enemy"><img src={enemy1} width={24} height={24} /></span>
              <span className="enemy"><img src={enemy1} width={24} height={24} /></span>
              <span className="enemy"><img src={enemy1} width={24} height={24} /></span>
            </div>
          </div>
          <div id="player" ref={playerRef}>
            <div id="player-collider"></div>
            <img src={playerShip} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
