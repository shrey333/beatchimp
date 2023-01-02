"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from './page.module.css'
import { v4 as uuidv4 } from 'uuid'

const inter = Inter({ subsets: ['latin'] })

type ButtonsArray = {
  key: string,
  visibility: boolean,
  innerNumber: string,
  innerNumberVisibility: boolean
} | {
  key: string,
  visibility: boolean,
  innerNumber: number,
  innerNumberVisibility: boolean
}
type ShowAlert = {
  show: boolean,
  data: string
}

export default function Home() {
  const [score, setScore] = useState(0)
  const [currentId, setCurrentId] = useState(0)
  const [showAlert, setShowAlert] = useState<ShowAlert>({show: false, data: ''})
  const [buttonsArray, setButtonsArray] = useState<ButtonsArray[]>([])
  const [orderedIds, setOrderedIds] = useState<string[]>([])
  const [occupiedNumbers, setOccupiedNumbers] = useState(new Map())
  const [firstClick, setFirstClick] = useState(0)

  useEffect(() => {
    initializePage()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initializePage = () => {
    setCurrentId(0)
    setButtonsArray([])
    setOrderedIds([])
    occupiedNumbers.clear()
    setOccupiedNumbers(new Map(occupiedNumbers))
    setFirstClick(0)
    const array: ButtonsArray[] = []
    let orderedIds: Array<string> = []

    for(let i = 1; i <= 45; i++){
      const key = uuidv4()
      array.push({key: key, visibility: false, innerNumber: '', innerNumberVisibility: false})
    }

    for(let i = 0; i < 10; ++i) {
      let randomNumber = Math.floor(Math.random() * 45)
      while(typeof occupiedNumbers.get(randomNumber) === 'number'){
        randomNumber = Math.floor(Math.random() * 45)
      }
      const key = uuidv4()
      array[randomNumber] = {key: key, visibility: true, innerNumber: i, innerNumberVisibility: true}
      setOccupiedNumbers(occupiedNumbers.set(randomNumber, i))
      setOccupiedNumbers(occupiedNumbers.set(key, randomNumber))
      orderedIds.push(key)
    }
    setButtonsArray(array)
    setOrderedIds(orderedIds)
  }

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, uid: string) => {
    let array: ButtonsArray[] = [...buttonsArray]
    const clickTime = (new Date()).getTime(), previousId = currentId
    const previousFirstClick = firstClick || clickTime
    const currentScore = ((clickTime - previousFirstClick)/1000)
    if(currentId === 0){
      occupiedNumbers.forEach((value: ButtonsArray, key: number) => {
        if(typeof key !== 'string'){
          array[key].innerNumberVisibility = false
        }
      });
      setFirstClick(clickTime)
    }
    array[occupiedNumbers.get(uid)].visibility = false
    setCurrentId(currentId + 1)
    setButtonsArray(array)
    
    if(uid !== orderedIds[previousId]){
      occupiedNumbers.forEach((value: ButtonsArray, key: number) => {
        if(typeof key !== 'string'){
          array[key].visibility = false
        }
      })
      setScore(0)
      setShowAlert({show: true, data: '🙂Sorry, try again! (click refresh pattern)'})
      setTimeout(() => {
        setShowAlert({show: false, data: ''})
      }, 3000)
    }
    if(previousId === orderedIds.length - 1){
      let previousbest = parseInt(localStorage.getItem("best") ?? '0')
      localStorage.setItem("best", Math.max(currentScore, previousbest).toString())
      setScore(currentScore)
      setShowAlert({show: true, data: '🎉Congratulation! Improve the score now (click refresh pattern)'})
      setTimeout(() => {
        setShowAlert({show: false, data: ''})
      }, 3000)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <a
            href="https://www.youtube.com/watch?v=ktkjUjcZid0&list=WL&index=69"
            target="_blank"
            rel="noopener noreferrer"
          >
          <p className={inter.className}>
            💡Game idea
          </p>
        </a>
        <div>
          <a
            href="/"
          >
            Beat the Chimp🦧
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.center_grid}>
          {buttonsArray.map((element: ButtonsArray) => {
            return (
              <button 
                key={element.key} 
                style={{visibility: element.visibility ? 'visible': 'hidden'}} 
                onClick={(e) => handleButtonClick(e, element.key)}>
                  {element.innerNumberVisibility ? element.innerNumber : ''}
              </button>
            )
          })}
        </div>
        {
          showAlert.show && (<div className={inter.className}>{showAlert.data}</div>)
        }
        
      </div>

      <div className={styles.grid}>
        <button
            className={styles.card}
            onClick={() => initializePage()}
          >
          <h2 className={inter.className}>
            Refresh pattern <span>-&gt;</span>
          </h2>
        </button>
        <div className={styles.card}>
          <h2 className={inter.className}>
            Your previous score
          </h2>
          <p className={inter.className}>
            {score}s
          </p>
        </div>

        <div className={styles.card}>
          <h2 className={inter.className}>
            Your best score
          </h2>
          <p className={inter.className}>{localStorage.getItem('best')}s</p>
        </div>

        
      </div>
    </main>
  )
}
