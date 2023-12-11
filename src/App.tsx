import { useEffect, useRef } from "react"
import "./App.css"

const enemyTypes = {
  basic: `<div class="enemy-row basic"}>
    <span class="enemy"></span>
    <span class="enemy"></span>
    <span class="enemy"></span>
    <span class="enemy"></span>
    <span class="enemy"></span>
    <span class="enemy"></span>
    <span class="enemy"></span>
    <span class="enemy"></span>
  </div>`,
  fast: `<div class="enemy-row fast"}>
    <span class="enemy"></span>
    <span class="enemy"></span>
    <span class="enemy"></span>
    <span class="enemy"></span>
    <span class="enemy"></span>
    <span class="enemy"></span>
    <span class="enemy"></span>
    <span class="enemy"></span>
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
  let score = 0
  let isReloading = false
  const playerRef = useRef<HTMLDivElement>(null)
  
  const shoot = () => {
    if (isReloading) return
    console.log("PEW!")
    if (!playerRef.current) return
    const game = document.getElementById("game")
    if (!game) return
    const missile = document.createElement("div")
    missile.className = "missile"
    missile.style.left = `calc(${playerRef.current.style.left} + 0.9rem)`
    game.appendChild(missile)
    isReloading = true
    setTimeout(() => missile.remove() , 1000)
    setTimeout(() => isReloading = false, 500)
  }

  const process = (event: KeyboardEvent) => {
    if (!playerRef.current) return
    if (event.key === "ArrowLeft") {
      const currentPosition = +playerRef.current.style.left.replace(/%/, "")
      const newPosition = currentPosition > 2 ? currentPosition - 2 : 2
      playerRef.current.style.left = `${newPosition}%`
    } else if (event.key === "ArrowRight") {
      const currentPosition = +playerRef.current.style.left.replace(/%/, "")
      const newPosition = currentPosition < 94 ? currentPosition + 2 : 94
      playerRef.current.style.left = `${newPosition}%`
    } else if (event.code === "Space") {
      shoot()
    }
  }

  useEffect(() => {
    if (!playerRef.current) return
    playerRef.current.style.bottom = "1rem"
    playerRef.current.style.left = `48%`
    document.addEventListener("keydown", process)
    return () => {
      document.removeEventListener("keydown", process)
    }
  }, [])

  useEffect(() => {
    const spawnerId = setInterval(() => {
      const enemiesDiv = document.getElementById("enemies")
      if (!enemiesDiv) return
      let type: "basic" | "fast" = "basic"
      if (score >= 50) type = Math.random() > 0.5 ? "fast" : "basic"
      enemiesDiv.innerHTML += enemyTypes[type]
    }, 10 * 1000)

    const collisionCheckerId = setInterval(() => {
      const missiles = document.querySelectorAll(".missile")
      const enemies = document.querySelectorAll(".enemy:not(.dead)")
      missiles.forEach((missile) => {
        enemies.forEach((enemy) => {
          const isColliding = checkCollision(missile, enemy)
          if (isColliding) {
            missile.remove()
            enemy.classList.add("dead")
            score++
            document.getElementById("score")!.innerText = score.toString()
          }
        })
      })
    }, 1)

    const deadRowCleanerId = setInterval(() => {
      const deadRows = document.querySelectorAll(".enemy-row:first-child:not(:has(.enemy:not(.dead)))")
      deadRows.forEach((row) => row.remove())
    }, 2000)

    const deathCheckerId = setInterval(() => {
      const enemies = document.querySelectorAll(".enemy:not(.dead)")
      enemies.forEach((enemy) => {
        if (!playerRef.current) return
        const isColliding = checkCollision(enemy, playerRef.current)
        if (!isColliding) return
        alert("YOU DIED!!!")
        score = 0
        document.getElementById("enemies")!.innerHTML = enemyTypes["basic"]
        document.getElementById("score")!.innerText = score.toString()
      })
    })

    return () => {
      clearInterval(spawnerId)
      clearInterval(collisionCheckerId)
      clearInterval(deadRowCleanerId)
      clearInterval(deathCheckerId)
    }
  }, [])

  return (
    <>
      <h1>Space Invaders - Score: <span id="score">{score}</span></h1>
      
      <div id="game">
        <div id="enemies">
          <div className="enemy-row basic">
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
          </div>
        </div>
        <div id="player" ref={playerRef}></div>
      </div>
    </>
  )
}

export default App
