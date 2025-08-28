import { useRef, useState } from 'react'
import './App.css'
import pokemonData from './pokemonData'

function App() {
  const [count, setCount] = useState(null)
  const [playerPokemon, setPlayerPokemon] = useState(null)
  const [opponentPokemon, setOpponentPokemon] = useState(null)
  const [message, setMessage] = useState("")
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [attacklogs, setAttacklogs] = useState(" ")


  const attackSound = useRef(null)
  const choosePokemon = (pokemon) => {
    setPlayerPokemon({...pokemon, attacks: [...pokemon.attacks]})

    const randomOpponent = pokemonData[Math.floor(Math.random() * pokemonData.length)]

    setOpponentPokemon({
      ...randomOpponent, attacks: [...randomOpponent.attacks]
    })

    
    
    setMessage(`${pokemon.name} Eu escolho você!  Seu Oponente irá utilizar um: ${randomOpponent.name}`)
    
    setIsPlayerTurn(true)

   setAttacklogs("")  
  }

  const resetGame = () => {
    setPlayerPokemon(null)
    setOpponentPokemon(null)
    setMessage("")
    setIsPlayerTurn(true)
    setAttacklogs("")  }

  const renderLifeBar = (hp, maxHp) => {
    const widthPercentage = (hp / maxHp) * 100;
    
    let barColor;
    if (widthPercentage > 50) {
      barColor = '#4caf50'; 
    } else if (widthPercentage > 20) {
      barColor = '#f3d148'; 
    } else {
      barColor = '#f44336';
    }

    return (
      <div className='life-bar-container'>
        <div 
          className='life-bar' 
          style={{
            width: `${widthPercentage}%`, 
            backgroundColor: barColor 
          }}
        >
        </div>
      </div>
    );
  }



  const addLog = (log) => {
    setAttacklogs((attacklogs) => attacklogs + "<li>" + log + "</li>")
  }

  const playerAttack = (selectedAttack) => {
    if(!playerPokemon || !opponentPokemon){
      setMessage("Escolha seu Pokemon para batalhar")
      return
    }





    if(Math.random() > selectedAttack.accuracy){
      const log = `${playerPokemon.name} tentou utilizar ${selectedAttack.name} mas falhou!`
      setMessage(log)
      addLog(log)

      setTimeout(() =>{
        setIsPlayerTurn(false)
        opponentAttack()
      }, 1000)

      return
    }
    if(attackSound.current){
      attackSound.current.play() 
    }

    const playerDamage = selectedAttack.damage
    const opponentHp = opponentPokemon.hp - playerDamage >= 0 ? opponentPokemon.hp - playerDamage : 0

    setOpponentPokemon({
      ...opponentPokemon,
      hp: opponentHp
    })

  
    let commentary = ""

    if(playerDamage > 10 ) commentary = "E foi Super Efetivo!"
    if((selectedAttack.name == "Confusion") && (Math.random() < 0.5)) {commentary += `O ${opponentPokemon.name} inimigo está confuso!`}

    const log = `Você usou ${selectedAttack.name} e causou ${selectedAttack.damage} de dano! ${commentary}`

    setMessage(log)
    addLog(log)

    if(opponentHp == 0){
      setMessage(`Parabéns, seu ${playerPokemon.name} venceu!`)
      return
    }

    setTimeout(() => {
      setIsPlayerTurn(false)
      opponentAttack()
    }, 1000)
  }

  const opponentAttack = ( ) => {

     if(!playerPokemon || !opponentPokemon){
      setMessage("Escolha seu Pokemon para batalhar")
      return
    }

    const availableAttacks = opponentPokemon.attacks.filter((attack) => attack.uses > 0)

    if(availableAttacks.length == 0){
      const log = `${opponentPokemon.name} não possui mais ataques!`

      setMessage(log)
      addLog(log)
      return 
    }

    const selectedAttack = availableAttacks[Math.floor(Math.random() * availableAttacks.length)]


     if(selectedAttack.uses <= 0){
      setMessage('Sem PP restante para este ataque')
      return
    }

     if(Math.random() > selectedAttack.accuracy){
      const log = `${opponentPokemon.name} tentou utilizar ${selectedAttack.name} mas falhou!`
      setMessage(log)
      addLog(log)

      setTimeout(() =>{
        setIsPlayerTurn(true)
      }, 1000)
      return
    }

     if(attackSound.current){
      attackSound.current.play() 
    }

    
    const opponentDamage = selectedAttack.damage
    const playerHp = playerPokemon.hp - opponentDamage >= 0 ? playerPokemon.hp - opponentDamage : 0

    setPlayerPokemon({
      ...playerPokemon,
      hp: playerHp
    })

    selectedAttack.uses -= 1

    let commentary = ""

    if(opponentDamage > 10 ) commentary = "E foi Super Efetivo!"
    if((selectedAttack?.name == "Confusion") && (Math.random() < 0.5)) {commentary += `Seu ${playerPokemon.name} está confuso!`}

    const log = `${opponentPokemon.name} usou ${selectedAttack.name} e causou ${selectedAttack.damage} de dano! ${commentary}`

    setMessage(log)
    addLog(log)

    if(playerHp <= 0){
      setMessage(`Mais sorte da próxima, ${opponentPokemon.name} venceu!`)
      setTimeout(() => {
        resetGame()
      }, 3000);
      return
    }

    setTimeout(() => {
      setIsPlayerTurn(true)
    }, 1000)

  }








  return (
    <>
    <div className="nes-container is-rounded is-dark">
      <i className="nes-pokeball"></i>
      <h1>Simulador de Batalhas</h1>
      
      {!playerPokemon?.hp && 
      <p>{message}</p>
}
      
      {
        playerPokemon?.hp &&
      <button className='nes-btn is-error' onClick={resetGame}>Reiniciar</button>
     }
     

      {playerPokemon?.hp == null && opponentPokemon?.hp == null && (
        <div className= 'pokemon-selection'>
          <h2>Escolha seu Pokemon</h2>
          <div className='pokemon-list'>
            {pokemonData.map((pokemon) => (
              <button key={pokemon.name} type='button' className="nes-btn is-primary" onClick={() => choosePokemon(pokemon)}> 
                {pokemon.name}
              </button>
            ))}
          </div>
        </div>
      )} 
    
      <div className='main-container'>
      {
        playerPokemon?.hp &&
       <div className='battle'>
        <div>
            <p className='nes-dialog'>{message}</p>
        </div>
    <div className='pokemon-status'>
      <div>
      <h3>{playerPokemon?.name}</h3>
      <img src={playerPokemon?.sprite} alt={playerPokemon?.name} className={playerPokemon?.isAttacking ? "attacking" : ""}/>
    
    {renderLifeBar(playerPokemon?.hp, playerPokemon?.maxHp)} <p>HP: {playerPokemon?.hp}</p>
</div>
      
    <div>
      <h3>{opponentPokemon?.name}</h3>
      <img src={opponentPokemon?.sprite} alt={opponentPokemon?.name} className={opponentPokemon?.isAttacking ? "attacking" : ""}/>
    {renderLifeBar(opponentPokemon?.hp, opponentPokemon?.maxHp)} <p>HP: {opponentPokemon?.hp}</p>
    </div>

</div>
       {isPlayerTurn && playerPokemon?.hp > 0 && opponentPokemon?.hp > 0 && (
        <div className='attack-options'>
          {playerPokemon?.attacks.map((selectedAttack) => (
            <button key={selectedAttack.name} style={{marginLeft: '10px'}} className='nes-btn is-warning' onClick={() => playerAttack(selectedAttack)}
            disabled={selectedAttack.uses <= 0}>{selectedAttack.name} ({selectedAttack.damage} DMG)</button>
          ))}
        </div>
       )}   
</div>}



      {playerPokemon?.hp && 
      

   <div className='nes-container with-title is-centered is-dark attack-logs'>
        <h3 className='title'>Battle Log</h3>
        <div className='lists'>
   
          <ul className='nes-list is-disc' dangerouslySetInnerHTML={{__html: attacklogs}}>

          </ul>
        </div>
      </div>
      
}    
</div>
                <audio
        ref={attackSound}
        src="https://vgmtreasurechest.com/soundtracks/pokemon-sfx-gen-3-attack-moves-rse-fr-lg/izqqhmeayp/Tackle.mp3"
        preload="auto"
      />

    </div>
    </>
  )
}

export default App
