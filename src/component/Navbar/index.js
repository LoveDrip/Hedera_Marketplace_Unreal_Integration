import { useContext } from "react"; 
import { motion } from "framer-motion"; 
import { HashConnect } from "hashconnect";

import { AccountContext } from "../../App";    
import walletIcon from "../../assets/images/walletIcon.svg";

/// 2023.9.21 - Milos - HashPack Connect Wallet 
let appMetadata = {
  name: "Unreal Integration NFT marketplace",
  description: "Unreal Integration NFT marketplace",
  icon: "https://ipfs.io/ipfs/QmWaYa4TdA67fmr2NrPeiincWFTeLEY7phKwND1pkneGVP"
}

let hashconnect = new HashConnect();

const Navbar = () => { 

  const {accountId, setAccountId, setTopic} = useContext(AccountContext);
 

  //Conenct Hashpack wallet

  async function connectHedera() {
    let initData = await hashconnect.init(appMetadata, "testnet", false);
    console.log(initData)
    setTopic(initData.topic)
    hashconnect.foundExtensionEvent.once((walletMetadata) => {
      hashconnect.connectToLocalWallet(initData.pairingString, walletMetadata);
    }) 

    hashconnect.pairingEvent.once((pairingData) => {
      setAccountId(pairingData.accountIds[0])
    })

    setHash(hashconnect)
  }  

 

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      id="nav"
      className="sm:container sm:mx-auto">
      <div className="block py-6 sm:flex sm:items-center sm:justify-between xl:max-w-screen-xl z-10">
        <div className="flex items-center justify-between px-4 sm:px-0">
        </div>

        
        <div className="flex-col hidden items-center justify-between md:flex-row sm:flex">
          <div className="hidden md:flex">
            <span
              className="bg-transparent bg-gradient-to-r from-purple-700 to-pink-600
                          hover:text-gray-300
                          duration-300 font-general-medium 
                          ml-8 px-6 py-2.5 rounded-md shadow-sm text-md text-white
                        "
              aria-label="connect-btn">
              {!accountId ? (
                <button className="flex font-bold" onClick={() => connectHedera()}>
                  <img
                    src={walletIcon}
                    alt="walletSVG"
                    className="max-w-sm mr-2 w-5"
                  />
                  Connect Wallet
                </button>
              ) : (
                <button
                  className="flex font-bold"
                  onClick={() => openModal(accountId)}>
                  <img
                    src={walletIcon}
                    alt="walletSVG"
                    className="max-w-sm mr-2 w-5"
                  /> 
                  {accountId.toString()}
                </button>
              )}
            </span>
          </div>
        </div>
      </div>
      
    </motion.nav>
  );
};

export default Navbar;