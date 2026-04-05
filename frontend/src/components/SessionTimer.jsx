import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../store/slices/uiSlice';

function SessionTimer() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(null);
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    if (!user?.sessionExpires) {
      console.log('SessionTimer: No sessionExpires found');
      return;
    }

    // Parse session expiry once at the start
    let expiresAt;
    if (typeof user.sessionExpires === 'string' && user.sessionExpires.match(/^\d+$/)) {
      // It's a milliseconds timestamp string
      expiresAt = parseInt(user.sessionExpires, 10);
    } else {
      // It's an ISO date string
      expiresAt = new Date(user.sessionExpires).getTime();
    }
    
    // Check if date parsing was successful
    if (isNaN(expiresAt)) {
      console.error('SessionTimer: Invalid session expiry date:', user.sessionExpires);
      return;
    }

    const now = new Date().getTime();
    const initialDiff = expiresAt - now;
    
    console.log('SessionTimer: Initialized', {
      sessionExpires: user.sessionExpires,
      expiresAt: new Date(expiresAt).toISOString(),
      now: new Date(now).toISOString(),
      initialDiffMinutes: Math.floor(initialDiff / 60000),
      initialDiffSeconds: Math.floor(initialDiff / 1000)
    });

    // If already expired, don't start the timer
    if (initialDiff <= 0) {
      console.log('SessionTimer: Session already expired on mount');
      if (!hasLoggedOut.current) {
        hasLoggedOut.current = true;
        dispatch(logout());
        dispatch(showToast({ 
          message: 'Session expired. Please login again.', 
          type: 'warning' 
        }));
        navigate('/login');
      }
      return;
    }

    hasLoggedOut.current = false;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = expiresAt - now;

      if (diff <= 0 && !hasLoggedOut.current) {
        console.log('SessionTimer: Session expired, logging out');
        hasLoggedOut.current = true;
        clearInterval(interval);
        dispatch(logout());
        dispatch(showToast({ 
          message: 'Session expired. Please login again.', 
          type: 'warning' 
        }));
        navigate('/login');
      } else if (diff > 0) {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => {
      console.log('SessionTimer: Cleaning up interval');
      clearInterval(interval);
    };
  }, [user?.sessionExpires, dispatch, navigate]);

  if (!timeLeft) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isWarning = minutes < 5;

  return (
    <div className={`text-sm ${isWarning ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
      <span className="hidden md:inline">Session: </span>
      {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}

export default SessionTimer;
