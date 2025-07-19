import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

export default function LugeQueueApp() {
  const [queue, setQueue] = useState([]);
  const [name, setName] = useState("");
  const [adults, setAdults] = useState(1);
  const [doubling, setDoubling] = useState(0);
  const [rides, setRides] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const savedQueue = localStorage.getItem("lugeQueue");
    if (savedQueue) {
      setQueue(JSON.parse(savedQueue));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lugeQueue", JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToQueue = () => {
    if (!name || adults < 1) return;
    const newEntry = {
      id: Date.now(),
      name,
      adults: parseInt(adults),
      doubling: parseInt(doubling),
      rides: parseInt(rides),
      called: false,
    };
    setQueue([...queue, newEntry]);
    setName("");
    setAdults(1);
    setDoubling(0);
    setRides(1);
  };

  const handleCall = (id) => {
    setQueue(queue.map(entry => entry.id === id ? { ...entry, called: true } : entry));
  };

  const waitingQueue = queue.filter(entry => !entry.called);
  const totalAdults = waitingQueue.reduce((sum, entry) => sum + entry.adults, 0);
  const totalDoubling = waitingQueue.reduce((sum, entry) => sum + entry.doubling, 0);

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-bold">Luge Queue Check-In</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Guest Name</label>
            <Input
              placeholder="Guest Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="block text-sm font-medium">Number of Adults</label>
            <Input
              type="number"
              min="1"
              placeholder="Number of Adults"
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
            />

            <label className="block text-sm font-medium">Number of Doubling (Kids)</label>
            <Input
              type="number"
              min="0"
              placeholder="Number of Doubling (Kids)"
              value={doubling}
              onChange={(e) => setDoubling(e.target.value)}
            />

            <label className="block text-sm font-medium">Number of Rides</label>
            <Input
              type="number"
              min="1"
              placeholder="Number of Rides"
              value={rides}
              onChange={(e) => setRides(e.target.value)}
            />

            <Button onClick={handleAddToQueue}>Check In Group</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-4">
          <h2 className="text-xl font-bold">Queue Status</h2>
          <p className="text-sm text-gray-500">{currentTime.toLocaleString()}</p>
          <p>Total Groups Waiting: {waitingQueue.length}</p>
          <p>Total Adults (Luge Carts): {totalAdults}</p>
          <p>Total Doubling: {totalDoubling}</p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {waitingQueue.map((entry, index) => (
          <Card key={entry.id} className="bg-white">
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <p className="font-semibold">#{index + 1}: {entry.name}</p>
                <p>{entry.adults} Adult(s), {entry.doubling} Doubling, {entry.rides} Ride(s)</p>
              </div>
              <Button onClick={() => handleCall(entry.id)}>Call</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
