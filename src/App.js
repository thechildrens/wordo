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

const KEY_CODES = {
  'A': 97,
  'B': 98,
  'C': 99,
  'D': 100,
  'E': 101,
  'F': 102,
  'G': 103,
  'H': 104,
  'I': 105,
  'J': 106,
  'K': 107,
  'L': 108,
  'M': 109,
  'N': 110,
  'O': 111,
  'P': 112,
  'Q': 113,
  'R': 114,
  'S': 115,
  'T': 116,
  'U': 117,
  'V': 118,
  'W': 119,
  'X': 120,
  'Y': 121,
  'Z': 122,
  'Enter': 13,
  'Backspace': 8,
}

const D = new Date()
const RNG = seedrandom(D.toISOString().slice(0, 10))
const SELECTWORD = () => WORDLIST[Math.floor(RNG() * WORDLIST.length)]
const TARGET = SELECTWORD().split('')
const TSET = {}
TARGET.forEach(letter => {
  if (!TSET.hasOwnProperty(letter)) {
    TSET[letter] = 0
  }
  TSET[letter] += 1
})
function App() {
  const [currRow, setCurrRow] = useState(0)
  const [GUESSES, setGuesses] = useState(makeGuesses)

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
          if (WORDSET.has(word)) {

            setCurrRow(currRow + 1)
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
      <table className="wordgrid prevent-select">
        <tbody>
          {GUESSES.map((guess, i) => {
            const tset = { ...TSET }

            return i >= currRow ? (
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
                  tset[cell]--
                  return (
                    <td key={j} className={
                      `cell-filled
                      ${cell === TARGET[j] ? 'cell-correct' : (
                        (tset.hasOwnProperty(cell) && tset[cell] > -1) ? 'cell-misplaced' : 'cell-wrong'
                      )}`
                    }>
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
