import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  
  const transition = (newMode, replace = false) => {
    setMode(newMode);
    const newHistory = history.slice(0, history.length - 1);
    newHistory.push(newMode);
    if (replace) {
      setHistory(newHistory);
    } else {
      setHistory(prevHistory => [...prevHistory, newMode]);
    }
  };

  const back = () => {
    if (history.length === 1) return;
    history.pop();
    setMode(history[history.length - 1]);
  };


  return { mode, transition, back };
}