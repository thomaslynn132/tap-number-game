import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const useTimer = (isPlaying, points, setIsPlaying) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isPlaying && points.length > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (points.length === 0) {
      clearInterval(timer);
      setIsPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isPlaying, points, setIsPlaying]);

  const resetTime = () => setTime(0);
  return { time, resetTime };
};

const usePoints = (containerRef) => {
  const [points, setPoints] = useState([]);
  const [pointsBeforePlaying, setPointsBeforePlaying] = useState(0);

  const generatePoints = (numPoints) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const newPoints = Array.from({ length: numPoints }, (_, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        number: i + 1,
        x: Math.random() * containerWidth,
        y: Math.random() * containerHeight,
      }));

      setPoints(newPoints);
    }
  };

  const clearPoint = (id) => {
    setPoints((prevPoints) => prevPoints.filter((point) => point.id !== id));
  };

  useEffect(() => {
    if (containerRef.current) {
      const pointsArray = containerRef.current.querySelectorAll(".point");
      pointsArray.forEach((point, index) => {
        point.style.left = `${points[index].x}px`;
        point.style.top = `${points[index].y}px`;
      });
    }
  }, [points]);

  const startGame = () => {
    setPointsBeforePlaying(points.length);
    generatePoints(points.length);
  };

  return {
    points,
    pointsBeforePlaying,
    generatePoints,
    clearPoint,
    startGame,
  };
};

function App() {
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { points, pointsBeforePlaying, generatePoints, clearPoint, startGame } =
    usePoints(containerRef);

  const { time, resetTime } = useTimer(isPlaying, points, setIsPlaying);

  const formatTime = (time) => {
    const seconds = (time / 1000).toFixed(2);
    return `${seconds} s`;
  };

  const handlePlayRestart = () => {
    setIsPlaying(true);
    resetTime();
    startGame();
  };

  const handlePointsInput = (e) => {
    generatePoints(Number(e.target.value));
  };

  return (
    <div className="App">
      <header>
        <h1>Let's Play</h1>

        <div>
          Points:{" "}
          <input
            type="number"
            onChange={handlePointsInput}
            value={points.length}
          />
        </div>
        <div>Time: {formatTime(time)}</div>
        <button onClick={handlePlayRestart}>
          {isPlaying ? "Restart" : "Play"}
        </button>
      </header>

      <div className="container" ref={containerRef}>
        {points.length === 0 ? (
          <div style={{ textAlign: "left" }}>
            <h2>All Cleared!</h2>
            <p>
              You cleared {pointsBeforePlaying} points in {formatTime(time)}{" "}
              seconds.
            </p>
          </div>
        ) : (
          points.map((point) => (
            <div
              key={point.id}
              className="point"
              onClick={() => clearPoint(point.id)}>
              {point.number}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
