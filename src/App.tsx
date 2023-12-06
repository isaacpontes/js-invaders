import { useEffect, useRef } from "react"
import "./App.css"

function App() {
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.style.bottom = "1rem"
      playerRef.current.style.left = `50%`
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        console.log("ESQUERDA")
        if (playerRef.current){
          const currentPosition = +playerRef.current.style.left.replace(/%/, "")
          const newPosition = currentPosition > 1 ? currentPosition - 1 : 1
          playerRef.current.style.left = `${newPosition}%`
        }
      } else if (event.key === "ArrowRight") {
        console.log("DIREITA")
        if (playerRef.current){
          const currentPosition = +playerRef.current.style.left.replace(/%/, "")
          const newPosition = currentPosition < 99 ? currentPosition + 1 : 99
          playerRef.current.style.left = `${newPosition}%`
        }
      } else if (event.code === "Space") {
        console.log("PEW!")
      }
    })
  })

  return (
    <>
      <h1>Space Invaders</h1>
      <div id="game">
        <div id="player" ref={playerRef}></div>
      </div>
    </>
  )
}

export default App
