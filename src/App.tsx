import React, { useState } from 'react';
import * as problems from './problems';
import './App.css';

const App: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState(
    '' as keyof typeof problems | ''
  );
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  return (
    <>
      <header>
        <h1>Advent of Code 2019</h1>
      </header>
      <main>
        <form
          onSubmit={e => {
            e.preventDefault();
            selectedProblem && setOutput(problems[selectedProblem](input));
          }}
        >
          <label htmlFor="problem">Problem</label>
          <select
            id="problem"
            onChange={e =>
              setSelectedProblem(e.target.value as keyof typeof problems)
            }
            value={selectedProblem}
          >
            <option value="">Select a problem</option>
            {Object.keys(problems).map(problem => (
              <option key={problem} value={problem}>
                {problem}
              </option>
            ))}
          </select>
          <label htmlFor="input">Input</label>
          <textarea
            id="input"
            disabled={!selectedProblem}
            wrap="off"
            rows={30}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type="submit" disabled={!selectedProblem || !input}>
            Submit
          </button>
        </form>
        <h2>Output</h2>
        <div>{output}</div>
      </main>
    </>
  );
};

export default App;
