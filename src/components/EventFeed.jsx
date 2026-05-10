import { useEffect, useState } from 'react';

const EVENT_POOL = [
  { tag: 'FUEL', level: 'warn', msg: 'Suction event detected · TRK-2204 · -42L in 90s' },
  { tag: 'ENGINE', level: 'ok', msg: 'Idle anomaly cleared · TRK-1108' },
  { tag: 'ROUTE', level: '', msg: 'Geofence exit logged · BUS-554 · São Paulo Hub' },
  { tag: 'TEMP', level: 'warn', msg: 'Coolant +12°C above baseline · TRK-3340' },
  { tag: 'ALERT', level: 'warn', msg: 'Driver behavior · harsh braking · 4× / 10min' },
  { tag: 'BATTERY', level: 'ok', msg: 'Voltage stabilized · 13.8V · TRK-2090' },
  { tag: 'FUEL', level: 'warn', msg: 'Tank delta exceeds threshold · TRK-1740' },
  { tag: 'PRED', level: 'ok', msg: 'Injector wear forecast · 14d to service · TRK-2204' },
  { tag: 'GEOF', level: '', msg: 'Re-entry · authorized depot · 03:14:22' },
  { tag: 'DIAG', level: 'ok', msg: 'OBD handshake · 142 nodes online' },
];

const timeFmt = (offset) => {
  const d = new Date(Date.now() - offset * 1000);
  return d.toTimeString().slice(0, 8);
};

export function EventFeed() {
  const [items, setItems] = useState(() =>
    EVENT_POOL.slice(0, 6).map((e, i) => ({ ...e, id: i, time: timeFmt(i * 17) }))
  );

  useEffect(() => {
    let n = 100;
    const id = setInterval(() => {
      const e = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
      setItems((arr) => [{ ...e, id: n++, time: timeFmt(0) }, ...arr.slice(0, 7)]);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="event-feed">
      {items.map((e) => (
        <div key={e.id} className={'event ' + e.level}>
          <span className="time">{e.time}</span>
          <span className="msg">
            <span className={'tag ' + (e.level === 'warn' ? 'danger' : e.level === 'ok' ? 'ok' : '')}>{e.tag}</span>
            {e.msg}
          </span>
          <span className="level"></span>
        </div>
      ))}
    </div>
  );
}
