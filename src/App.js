import logo from './logo.svg';
import './App.css';
import { useCallback, useEffect } from 'react';

const GUESSES = new Array(6).fill(null).map(row => new Array(5).fill(''))

const KEYBOARD = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['⌫', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Enter'],
]

function App() {
  useEffect(() => {
    const onkeydown = (evt) => {
      const key = evt.key.toUpperCase()
      const vkey = document.getElementsByClassName(`key-${key}`)[0]
      vkey.classList.add('key-active')
      console.log(evt)
    }
    const onkeyup = (evt) => {
      const key = evt.key.toUpperCase()
      const vkey = document.getElementsByClassName(`key-${key}`)[0]
      vkey.classList.remove('key-active')
    }

    window.addEventListener('keyup', onkeyup)
    window.addEventListener('keydown', onkeydown)

    return () => {
      window.removeEventListener('keydown', onkeydown)
      window.removeEventListener('keydown', onkeyup)
    }
  }, [])

  return (
    <div className="App">
      <table className="wordgrid">
        <tbody>
          {GUESSES.map((guess, i) => {
            return (
              <tr key={i}>
                {guess.map((cell, j) => {
                  return (
                    <td key={j}>
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
                return <div className={`key key-${key}`} key={key}>{key}</div>
              })}
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
