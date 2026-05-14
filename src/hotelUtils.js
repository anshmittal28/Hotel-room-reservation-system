export function buildRooms() {
  const rooms = [];
  for (let floor = 1; floor <= 9; floor++) {
    for (let pos = 1; pos <= 10; pos++) {
      const id = floor * 100 + pos;
      rooms.push({ id, floor, pos, status: 'available' });
    }
  }
  for (let pos = 1; pos <= 7; pos++) {
    const id = 1000 + pos;
    rooms.push({ id, floor: 10, pos, status: 'available' });
  }
  return rooms;
}

function timeBetween(a, b) {
  if (a.floor === b.floor) {
    return Math.abs(a.pos - b.pos);
  }
  return (a.pos - 1) + Math.abs(a.floor - b.floor) * 2 + (b.pos - 1);
}

export function totalTravelTime(rooms) {
  if (rooms.length <= 1) return 0;
  let total = 0;
  for (let i = 1; i < rooms.length; i++) {
    total += timeBetween(rooms[i - 1], rooms[i]);
  }
  return total;
}

function combinations(arr, k) {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [first, ...rest] = arr;
  const withFirst = combinations(rest, k - 1).map(c => [first, ...c]);
  const withoutFirst = combinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

function sortRooms(rooms) {
  return [...rooms].sort((a, b) => a.floor !== b.floor ? a.floor - b.floor : a.pos - b.pos);
}

export function findBestRooms(allRooms, n) {
  if (n < 1 || n > 5) return null;

  const available = allRooms.filter(r => r.status === 'available');
  if (available.length < n) return null;

  const byFloor = {};
  for (const r of available) {
    (byFloor[r.floor] = byFloor[r.floor] || []).push(r);
  }

  let best = null;

  for (const floorKey of Object.keys(byFloor).map(Number).sort((a, b) => a - b)) {
    const floorRooms = byFloor[floorKey];
    if (floorRooms.length < n) continue;

    const sorted = [...floorRooms].sort((a, b) => a.pos - b.pos);
    for (let i = 0; i <= sorted.length - n; i++) {
      const candidate = sorted.slice(i, i + n);
      const tt = totalTravelTime(candidate);
      if (best === null || tt < best.travelTime) {
        best = { selected: candidate, travelTime: tt };
      }
    }
  }

  if (best !== null) return best;
  const floors = Object.keys(byFloor).map(Number).sort((a, b) => a - b);

  for (let windowSize = 2; windowSize <= floors.length; windowSize++) {
    for (let start = 0; start <= floors.length - windowSize; start++) {
      const windowFloors = floors.slice(start, start + windowSize);
      const windowRooms = windowFloors.flatMap(f => byFloor[f]);
      if (windowRooms.length < n) continue;

      const combos = combinations(windowRooms, n);
      for (const combo of combos) {
        const sorted = sortRooms(combo);
        const tt = totalTravelTime(sorted);
        if (best === null || tt < best.travelTime) {
          best = { selected: sorted, travelTime: tt };
        }
      }
    }
    if (best !== null) break;
  }

  return best;
}
