import React, { useEffect, useState } from 'react';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Itinerary from './pages/Itinerary';
import { auth, signInAnon } from './firebase/services';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    signInAnon();
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  return (
    <>
      {/* header with buttons that setActiveTab */}
      {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
      {activeTab === 'explore' && <Explore user={user} />}
      {activeTab === 'itinerary' && <Itinerary user={user} />}
    </>
  );
}

export default App;
