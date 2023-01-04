import logo from './logo.svg';
import './App.css';
import seedrandom from 'seedrandom';
import { WORDLIST, WORDSET } from './wordlist';
import { useCallback, useEffect, useState } from 'react';

const makeGuesses = () => new Array(6).fill(null).map(row => new Array(5).fill(''))

const KEYBOARD = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['BACKSPACE', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER'],
]

const D = new Date()
const DSTRING = D.toISOString().slice(0, 10)
// const DSTRING = '2023-12-25'
const RNG = seedrandom(DSTRING)
const SELECTWORD = () => WORDLIST[Math.floor(RNG() * WORDLIST.length)]

const TARGETWORD = SELECTWORD()
const TARGET = TARGETWORD.split('')
const TSET = {}
TARGET.forEach(letter => {
  if (!TSET.hasOwnProperty(letter)) {
    TSET[letter] = 0
  }
  TSET[letter] += 1
})


function Close({ onClick }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="close-icon"
      onClick={onClick}
    >
      <path fill="#currentColor"
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
      </path>
    </svg>
  )
}

function Modal({ open, closeCb, children }) {
  return (
    <div className={`backdrop ${open ? 'open' : ''}`} onClick={closeCb}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <Close onClick={closeCb} />
        <div className="modal-content">{children}</div>
      </div>
    </div>
  )
}

function Alert({ children }) {
  return (
    <div className="alert">
      {children}
    </div>
  )
}

function save(guesses, currRow) {
  localStorage.setItem(`${DSTRING}-guesses`, JSON.stringify(guesses))
  localStorage.setItem(`${DSTRING}-currrow`, currRow)
}

function loadCurrRow() {
  return +localStorage.getItem(`${DSTRING}-currrow`)
}

function loadGuesses() {
  const guessdata = localStorage.getItem(`${DSTRING}-guesses`)
  let guesses
  if (guessdata) {
    guesses = JSON.parse(guessdata)
  } else {
    guesses = makeGuesses()
  }
  return guesses
}

function App() {
  const [currRow, setCurrRow] = useState(loadCurrRow)
  const [guesses, setGuesses] = useState(loadGuesses)
  const [scores, setScores] = useState([])
  const [modalOpen, setModalOpen] = useState(currRow > 5)

  const closeModalCb = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  // compute scores
  useEffect(() => {
    setScores(s => {
      const slen = s.length
      if (currRow <= slen) return s

      const guess = guesses[slen]
      const tset = { ...TSET }

      const newScores = [0, 0, 0, 0, 0]

      guess.forEach((char, i) => {
        if (char !== TARGET[i]) return

        tset[char]--
        newScores[i] = 1
      })

      guess.forEach((char, i) => {
        if (newScores[i] === 1) return

        if (tset.hasOwnProperty(char) && tset[char] > 0) {
          tset[char]--
          newScores[i] = 2
        }
      })

      return [
        ...s,
        newScores,
      ]
    })
  }, [currRow, setScores])

  const onkeydown = useCallback((evt) => {
    const clicked = !evt.key
    const key = (evt.key || evt.target.dataset.key).toUpperCase()
    const vkey = document.getElementsByClassName(`key-${key}`)[0]
    if (vkey == null) return
    if (!clicked) {
      vkey.classList.add('key-active')
    }
    setGuesses(g =>
      g.map((row, i) => {
        if (currRow !== i) return row

        const r = row.slice()
        if (key === 'BACKSPACE') {
          for (let i = r.length - 1; i >= 0; i--) {
            if (r[i] !== '') {
              r[i] = ''
              break
            }
          }
        } else if (key === 'ENTER') {
          const word = row.join('')

          if (word === TARGETWORD) {
            // set win status
            setCurrRow(7)
            setModalOpen(true)
            save(g, 7)
          } else if (WORDSET.has(word)) {

            if (currRow >= 5) {
              setModalOpen(true)
            }
            // set next row
            setCurrRow(currRow + 1)
            save(g, currRow + 1)
          } else {
            const alertEl = document.getElementsByClassName('alert')[0]

            // reset animation
            alertEl.classList.remove('shown')
            void alertEl.offsetWidth
            alertEl.classList.add('shown')
          }

        } else {
          for (let i = 0; i < r.length; i++) {
            if (r[i] === '') {
              r[i] = key
              break
            }
          }
        }

        return r
      })
    )
  }, [currRow, setCurrRow, setGuesses])

  useEffect(() => {
    const onkeyup = (evt) => {
      const key = evt.key.toUpperCase()
      const vkey = document.getElementsByClassName(`key-${key}`)[0]
      if (vkey == null) return
      vkey.classList.remove('key-active')
    }

    window.addEventListener('keyup', onkeyup)
    window.addEventListener('keydown', onkeydown)

    return () => {
      window.removeEventListener('keydown', onkeydown)
      window.removeEventListener('keyup', onkeyup)
    }
  }, [onkeydown])

  return (
    <div className="App">
      <Modal open={modalOpen} closeCb={closeModalCb}>
        {currRow === 7 ? (
          <div>
            <span>
              You win!
            </span>
            <img src="/win.jpg" />
            <span>
              I am so proud of you.
            </span>
          </div>
        ) : (
          <div>
            <span>
              You lose!
            </span>
            <img src="/lose.jpg" />
            <span>
              Better luck next time!
            </span>
          </div>
        )}
      </Modal>
      <div className="wordgrid-container">
        <Alert>
          Word not found!
        </Alert>
        <table className="wordgrid prevent-select">
          <tbody>
            {guesses.map((guess, i) => {
              return i >= scores.length ? (
                <tr key={i}>
                  {guess.map((cell, j) => {
                    return (
                      <td key={j} className={`${cell === '' ? '' : 'cell-filled'}`}>
                        <span>
                          {cell}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ) : (
                <tr key={i}>
                  {guess.map((cell, j) => {
                    return (
                      <td key={j} className={`cell-filled cell-${scores[i][j]}`}>
                        <span>
                          {cell}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>

      </div>
      <div className="keyboard prevent-select">
        {KEYBOARD.map(row => {
          return (
            <div className="keyboard-row" key={row[0]}>
              {row.map((key) => {
                return <div
                  className={`key key-${key}`}
                  key={key}
                  data-key={key}
                  onClick={onkeydown}>
                  <span>
                    {key}
                  </span>
                </div>
              })}
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
