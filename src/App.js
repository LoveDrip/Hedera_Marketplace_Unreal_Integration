import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";

import Marketplace from "./component/Marketplace/Marketplace";
import AppHeader from "./component/Navbar";
import AppFooter from "./component/Footer";
import Banner from "./component/Banner";
import { HashConnect } from "hashconnect";

import { AnimatePresence } from "framer-motion";

import "./App.css";
import HederaNFTGrid from "./component/Marketplace/HederaNFTGrid";

export const AccountContext = createContext(null);
export const HaschconnectContext = createContext(null);

/// 2023.9.20 - Milos - Hedera MarketPlace Integration
function App() {
  const [accountId, setAccountId] = useState("");
  const [hash, setHash] = useState(new HashConnect(true)); 
  const [topic, setTopic] = useState(""); 

  return (
    <AnimatePresence>
      <div
        className="bg-white dark:bg-blue-black duration-300 transition"
        style={{ minHeight: "1024px" }}
      >
        <Router>

          {/* Connect Wallet  */}
          <AccountContext.Provider value={{ accountId, setAccountId, setHash, setTopic }} >
            <AppHeader />
          </AccountContext.Provider>

          {/* Display My NFT Collection */}
          <Routes>
            <Route path="/" element={ <Marketplace accountId={accountId} setAccountId={setAccountId} /> } />
            <Route path="/" element={<Banner />} />
          </Routes>

          {/* Mint Collection */}
          <HaschconnectContext.Provider value={{ hash }}>
            <HederaNFTGrid accountId={accountId} topic={topic} />
          </HaschconnectContext.Provider>
          <AppFooter />
        </Router>
        
      </div>
    </AnimatePresence>
  );
}

export default App;
