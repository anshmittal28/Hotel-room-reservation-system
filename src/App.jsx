import { useState, useCallback } from 'react';
import { buildRooms, findBestRooms } from './hotelUtils';
import './App.css';

const STATUS_CLASS = {
  available: 'room room-available',
  occupied: 'room room-occupied',
  booked: 'room room-booked',
};

const STATUS_LABEL = {
  available: 'Available',
  occupied: 'Occupied',
  booked: 'Just booked',
};

function RoomCell({ room }) {
  return (
    <div
      title={`Room ${room.id} - ${STATUS_LABEL[room.status]}`}
      className={STATUS_CLASS[room.status]}
    >
      {room.id}
    </div>
  );
}

function Legend() {
  return (
    <div className="legend">
      {Object.entries(STATUS_LABEL).map(([status, label]) => (
        <div key={status} className="legend-item">
          <span className={`legend-swatch room-${status}`} />
          {label}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [rooms, setRooms] = useState(() => buildRooms());
  const [numRooms, setNumRooms] = useState(1);
  const [lastBooking, setLastBooking] = useState(null);
  const [error, setError] = useState('');

  const floorNumbers = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const byFloor = (floor) => rooms.filter((r) => r.floor === floor);

  const handleBook = useCallback(() => {
    setError('');
    const n = parseInt(numRooms, 10);
    if (isNaN(n) || n < 1 || n > 5) {
      setError('Enter a number from 1 to 5.');
      return;
    }

    const result = findBestRooms(rooms, n);
    if (!result) {
      setError(`Not enough free rooms for ${n} room(s).`);
      return;
    }

    const bookedIds = new Set(result.selected.map((r) => r.id));
    setRooms((prev) =>
      prev.map((r) => {
        if (r.status === 'booked') return { ...r, status: 'occupied' };
        if (bookedIds.has(r.id)) return { ...r, status: 'booked' };
        return r;
      })
    );
    setLastBooking({
      roomIds: result.selected.map((r) => r.id),
      travelTime: result.travelTime,
    });
  }, [rooms, numRooms]);

  const handleRandomOccupancy = useCallback(() => {
    setError('');
    setLastBooking(null);
    setRooms((prev) =>
      prev.map((r) => ({
        ...r,
        status: Math.random() < 0.4 ? 'occupied' : 'available',
      }))
    );
  }, []);

  const handleReset = useCallback(() => {
    setError('');
    setLastBooking(null);
    setRooms(buildRooms());
  }, []);

  const availableCount = rooms.filter((r) => r.status === 'available').length;
  const occupiedCount = rooms.filter((r) => r.status === 'occupied').length;
  const bookedCount = rooms.filter((r) => r.status === 'booked').length;

  return (
    <div className="wrap">
      <h1>Hotel room reservation</h1>
      <p className="sub">
        97 rooms, 10 floors (floors 1-9: 10 rooms each; floor 10: 7 rooms). Lift
        and stairs on the left; room 1 is closest to the lift.
      </p>

      <div className="panel">
        <div className="controls">
          <div className="field">
            <label htmlFor="nrooms">How many rooms to book (max 5)</label>
            <input
              id="nrooms"
              type="number"
              min={1}
              max={5}
              value={numRooms}
              onChange={(e) => setNumRooms(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={handleBook}>
            Book
          </button>
          <button type="button" className="btn" onClick={handleRandomOccupancy}>
            Random occupancy
          </button>
          <button type="button" className="btn" onClick={handleReset}>
            Reset
          </button>
        </div>
        {error ? <p className="err">{error}</p> : null}
      </div>

      {lastBooking ? (
        <div className="msg">
          <p>
            Booked {lastBooking.roomIds.length} room(s):{' '}
            <strong>{lastBooking.roomIds.join(', ')}</strong>
          </p>
          <p>
            Total travel time (first to last room in order):{' '}
            <strong>
              {lastBooking.travelTime}{' '}
              minute{lastBooking.travelTime === 1 ? '' : 's'}
            </strong>
          </p>
        </div>
      ) : null}

      <div className="stats">
        <div className="stat">
          <div className="stat-num">{availableCount}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat">
          <div className="stat-num">{occupiedCount}</div>
          <div className="stat-label">Occupied</div>
        </div>
        <div className="stat">
          <div className="stat-num">{bookedCount}</div>
          <div className="stat-label">Just booked</div>
        </div>
      </div>

      <div className="panel">
        <div className="floor-head">
          <h2>Building view</h2>
          <Legend />
        </div>
        <p className="lift-note">
          <span>Lift</span>
          Rooms on the left are closer to the lift/stairs.
        </p>

        {floorNumbers.map((floor) => (
          <div key={floor} className="floor-row">
            <div className="floor-label">
              Floor {floor}
              {floor === 10 ? <small>top floor</small> : null}
            </div>
            <div className="stairs">|</div>
            <div className="rooms">
              {byFloor(floor).map((room) => (
                <RoomCell key={room.id} room={room} />
              ))}
            </div>
          </div>
        ))}

        <div className="ground">Ground</div>
      </div>
    </div>
  );
}
