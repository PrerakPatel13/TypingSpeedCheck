import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const randomPhrases = [
    "The quick brown fox jumps over the lazy dog.",
    "To be or not to be, that is the question.",
    "In the middle of difficulty lies opportunity.",
    "Do what you can, with what you have, where you are.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts."
  ];
  const TypingSpeedCalculator = () => {
    const inputRef = useRef(null);
    const [text, setText] = useState("");
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [typingStarted, setTypingStarted] = useState(false);
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [completedSentence, setCompletedSentence] = useState(null);
    const [errorCount, setErrorCount] = useState(0);
  
    useEffect(() => {
      if (typingStarted) {
        const timerInterval = setInterval(() => {
          const currentTime = Date.now();
          const elapsedTime = (currentTime - inputRef.current.startTime) / 1000;
          setTimeElapsed(elapsedTime);
        }, 100);
        inputRef.current.timerInterval = timerInterval;
        const startTime = Date.now();
        inputRef.current.startTime = startTime;
      }
    }, [typingStarted]);
  
    useEffect(() => {
      if (completedSentence) {
        clearInterval(inputRef.current.timerInterval);
        const errors = calculateErrors(completedSentence, randomPhrases[currentPhraseIndex]);
        setErrorCount(errors);
      }
    }, [completedSentence, currentPhraseIndex]);
  
    const handleInputChange = (e) => {
      if (!typingStarted) {
        setTypingStarted(true);
      }
      setText(e.target.value);
      checkSentenceCompletion(e.target.value);
    };
  
    const checkSentenceCompletion = (text) => {
      if (text.trim() === randomPhrases[currentPhraseIndex]) {
        setCompletedSentence(text);
      }
    };
  
    const calculateErrors = (typedText, correctText) => {
      const typedWords = typedText.trim().split(/\s+/);
      const correctWords = correctText.trim().split(/\s+/);
      let errorCount = 0;
  
      typedWords.forEach((typedWord, index) => {
        if (typedWord !== correctWords[index]) {
          errorCount++;
        }
      });
  
      return errorCount;
    };
  
    const startTyping = () => {
      const randomIndex = Math.floor(Math.random() * randomPhrases.length);
      setCurrentPhraseIndex(randomIndex);
      setText("");
      setTimeElapsed(0);
      setTypingStarted(true);
      setCompletedSentence(null);
      setErrorCount(0);
    };
    
  
    const resetCalculator = () => {
      clearInterval(inputRef.current.timerInterval);
      setTypingStarted(false);
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % randomPhrases.length);
      setText("");
      setCompletedSentence(null);
      setErrorCount(0);
    };
  
    return (
      <div className="typing-speed-calculator">
        <h1>Typing Speed Calculator</h1>
        {!typingStarted && (
          <button onClick={startTyping}>Start</button>
        )}
        {typingStarted && (
          <>
            <p>{randomPhrases[currentPhraseIndex]}</p>
            <textarea
              ref={inputRef}
              placeholder="Start typing here..."
              value={text}
              onChange={handleInputChange}
            />
            {completedSentence && (
              <div className="stats">
                <p>Time Elapsed: {timeElapsed.toFixed(1)} seconds</p>
                <p>Typing Speed: {(completedSentence.trim().split(/\s+/).length / (timeElapsed / 60)).toFixed(2)} words per minute</p>
                <p>Errors: {errorCount}</p>
              </div>
            )}
            {completedSentence && (
              <button onClick={resetCalculator}>Restart</button>
            )}
          </>
        )}
      </div>
    );
  };
  
  export default TypingSpeedCalculator;
  