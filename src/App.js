import logo from './logo.svg';
import './App.css';
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

const WORDLIST = [
  'SHARK'
]

const WORDSET = new Set()
WORDLIST.forEach(word => {
  WORDSET.add(word)
})

function App() {
  const [currRow, setCurrRow] = useState(0)
  const [GUESSES, setGuesses] = useState(makeGuesses)

  useEffect(() => {
    const onkeydown = (evt) => {
      const key = evt.key.toUpperCase()
      const vkey = document.getElementsByClassName(`key-${key}`)[0]
      if (vkey == null) return
      vkey.classList.add('key-active')
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
            if (currRow < 6) {
              const word = row.join('')
              if (WORDSET.has(word)) {
                setCurrRow(currRow + 1)
              }
            } else {

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
    }
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
      window.removeEventListener('keydown', onkeyup)
    }
  }, [currRow, setCurrRow, setGuesses])

  return (
    <div className="App">
      <table className="wordgrid">
        <tbody>
          {GUESSES.map((guess, i) => {
            return (
              <tr key={i}>
                {guess.map((cell, j) => {
                  return (
                    <td key={j} className={`${cell === '' ? '' : 'filled'}`}>
                      {cell}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="keyboard">
        {KEYBOARD.map(row => {
          return (
            <div className="keyboard-row" key={row[0]}>
              {row.map((key) => {
                return <div className={`key key-${key}`} key={key}>
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
