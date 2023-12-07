import { useEffect, useRef } from "react"
import "./App.css"

function App() {
  const playerRef = useRef<HTMLDivElement>(null)
  
  const shoot = () => {
    console.log("PEW!")
    if (!playerRef.current) return
    const game = document.getElementById("game")
    if (!game) return
    const missile = document.createElement("div")
    missile.className = "missile"
    missile.style.left = `calc(${playerRef.current.style.left} + 0.9rem)`
    game.appendChild(missile)
    setTimeout(() => missile.remove() , 1000)
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

    })

    return () => {
      clearInterval(spawnerId)
    }
  }, [])

  return (
    <>
      <h1>Space Invaders</h1>
      <div id="game">
        <div id="enemies">
          <div className="enemy-row">
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
          </div>
          <div className="enemy-row">
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
          </div>
          <div className="enemy-row">
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
          </div>
          <div className="enemy-row">
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
          </div>
          <div className="enemy-row">
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy"></span>
            <span className="enemy dead"></span>
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
