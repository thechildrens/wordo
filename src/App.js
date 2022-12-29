import logo from './logo.svg';
import './App.css';

const GUESSES = new Array(6).fill(null).map(row => new Array(5).fill(''))

const KEYBOARD = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['⌫', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Enter'],
]

function App() {
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
                return <div className="key" key={key}>{key}</div>
              })}
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
