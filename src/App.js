import React from 'react';
import './App.css';

const App = () => {
  const useState = React.useState;
  const [clockState, setClockState] = useState('stopped');
  const [session, setSession] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [clockId, setClockId] = useState('');
  const [previousSession, setPreviousSession] = useState('break');

  const clearAlert = () => {
    document.getElementById('beep').currentTime = 0;
  }

  const alert = () => {
    document.getElementById('beep').play();
    clearAlert();
  }

  // Calculates remaining time for clock
  const getTimeRemaining = (endTime) => {
    const t = Date.parse(endTime) - Date.parse(new Date());
    const seconds = Math.floor((t / 1000) % 60);
    let minutes = Math.floor((t / 1000 / 60) % 60);
    const hours = Math.floor((t / (1000 * 60 * 60)) % 24);

    if (hours === 1) {
      minutes = '60'
    }

    return {
      'total': t,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  // Starts clock with sent values
  const initializeClock = (endTime) => {

    // updates clock data every second
    function updateClock() {
      const t = getTimeRemaining(endTime);
      setMinutes(('0' + t.minutes).slice(-2));
      setSeconds(('0' + t.seconds).slice(-2));
      setTimeLeft(t.total);
      if (t.total <= 0) {
        alert();
        clearInterval(timeInterval);
        setTimeout(() => {
          previousSession === 'break' ? setPreviousSession('session') : setPreviousSession('break');
        }, 1000);

      }
    }

    updateClock();
    let timeInterval = setInterval(updateClock, 1000);
    return timeInterval;
  }

  // controls clock operations like pause and play
  const runClock = (endTime) => {
    if (clockState === 'running' && clockId !== '' && timeLeft !== 0) {
      setClockState('paused');
      clearInterval(clockId);
    } else if (clockState === 'paused' && timeLeft > 0) {
      const id = initializeClock(new Date(Date.parse(new Date()) + (minutes * 60 * 1000) + (seconds * 1000)));
      setClockId(id);
      setClockState('running');
    } else {
      const id = initializeClock(new Date(Date.parse(new Date()) + endTime * 60 * 1000))
      // const id = initializeClock(previousSession === 'break' ? new Date(Date.parse(new Date()) + session * 60 * 1000) : new Date(Date.parse(new Date()) + breakLength * 60 * 1000));
      setClockId(id);
      setClockState('running');
    }
  }

  React.useEffect(() => {
    setMinutes(session < 10 ? "0" + session : session);
    setSeconds('00');

    if (clockState === 'running') {
      runClock(breakLength);
    }
    // eslint-disable-next-line
  }, [session, breakLength, previousSession]);

  return (
    <React.Fragment>
      <h1>pomodoro clock</h1>
      <div id="subheadings">
        <div>
          <h3 id="break-label">break length</h3>
          <div className="length-values">
            <button
              id="break-decrement"
              onClick={() => clockState === 'stopped' && breakLength > 1 && setBreakLength(parseInt(breakLength) - 1)}
            >
              &minus;
						</button>
            <span id="break-length">{breakLength}</span>
            <button
              id="break-increment"
              onClick={() => clockState === 'stopped' && breakLength < 60 && setBreakLength(parseInt(breakLength) + 1)}
            >
              &#43;
						</button>
          </div>
        </div>
        <div>
          <h3 id="session-label">session length</h3>
          <div className="length-values">
            <button id="session-decrement" onClick={() => clockState === 'stopped' && session > 1 && setSession(parseInt(session) - 1)}>
              &minus;
						</button>
            <span id="session-length">{session}</span>
            <button
              id="session-increment"
              onClick={() => clockState === 'stopped' && session < 60 && setSession(parseInt(session) + 1)}
            >
              &#43;
						</button>
          </div>
        </div>
      </div>
      <div id="clock">
        <h3 id="timer-label">{previousSession === 'break' ? 'session' : 'break'}</h3>
        <p id="time-left" style={(timeLeft < 60000 && timeLeft > 0) ? { color: 'red' } : {}}>
          <span id="minutes">{clockState === 'stopped' ? (session < 10 ? '0' + session : session) : minutes}</span>
          :
          <span id="seconds">{clockState === 'stopped' ? '00' : seconds}</span>
        </p>
        <span>
          <button id="start_stop" onClick={() => {
            runClock(session);
          }}>
            {
              clockState === 'running' ? <>&#10074;&#10074;</> :
                <>&#9654;</>
            }
          </button>{' '}
          <button
            id="reset"
            onClick={() => {
              document.getElementById('beep').pause();
              setClockState('stopped');
              clearInterval(clockId);
              setPreviousSession('break');
              setSession('25');
              setBreakLength('5');
              setTimeLeft(0);
              clearAlert();

            }}
          >
            &#10226;
          </button>
        </span>
        <audio id="beep" preload="auto"
          src="https://goo.gl/65cBl1"
        />
      </div>
      <footer>
        designed & coded by <a href="https://www.github.com/kumarvaibhav45">kumar vaibhav</a>
      </footer>
    </React.Fragment>
  );
};

export default App;
