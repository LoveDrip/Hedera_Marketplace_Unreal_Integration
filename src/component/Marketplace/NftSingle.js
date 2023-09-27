import { motion } from "framer-motion";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { HaschconnectContext } from "../../App";
import { AccountId, TokenMintTransaction, TransactionId, TransactionReceipt } from "@hashgraph/sdk";

const tokenId = "0.0.2699545"

/// 2023.9.27 - Milos - NFT Card 
const NftSingle = ({ name, creator, description, image, accountId, topic, cid }) => {
  const { hash, minted, setMinted } = useContext(HaschconnectContext)


// 2023.9.27 - Milos -  Mint Token

  async function handleClickMint(tokenId, cid)  {
    const tokenMinTx =  mintToken(tokenId, accountId, cid);

    const tokenMintResponse = await sendTransaction(tokenMinTx);
    console.log("tokenMintResponse: ", tokenMintResponse);
    if(tokenMintResponse) {
      
      setMinted(!minted)
    }
  }
   
  // Get Mint Transaction
  function mintToken(tokenId, accountId, cids) {
    const txID = TransactionId.generate(accountId); 

    const mintTx = new TokenMintTransaction()
      .setTransactionId(txID)
      .setTokenId(tokenId)
      .setNodeAccountIds([new AccountId(3)])
      .setMetadata([Buffer.from(cids)])
      .freeze();

    return mintTx;
  }
 
  // Make Send Transaction
  async function sendTransaction(tx, sign = false) {
    let response, hashConnectTxBytes;
    console.log(tx)
    hashConnectTxBytes = sign ? (
      makeBytes(tx, accountId)
    ) : (
      tx.toBytes()
    );
    response = await hash?.sendTransaction(
      topic,
      {
        topic: topic,
        byteArray: hashConnectTxBytes,
        metadata: {
          accountToSign: accountId,
          returnTransaction: false,
        }
      }
    )
    if(response?.receipt) {
      return TransactionReceipt.fromBytes(
        response.receipt
      )
    } else {
      throw new Error("No transaction recipt found")
    }
  }
  
  // Get Sign
  function makeBytes(trans, signingAcctId) {
    const transId = TransactionId.generate(signingAcctId);

    trans.setTransactionId(transId);
    trans.setNodeAccountIds([new AccountId(3)]);

    trans.freeze();

    const transBytes = trans.toBytes();

    return transBytes
  }






  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, delay: 1 }}
      transition={{
        ease: "easeInOut",
        duration: 0.7,
        delay: 0.15,
      }}
    >
      <Link 
        aria-label="Single Project"
      >
        <div
          className="bg-secondary-light cursor-pointer dark:bg-ternary-dark
                        hover:shadow-xl mb-10 rounded-xl shadow-lg sm:mb-0 m-1"
        >
          <div>
            <img
              src={image}
              className="2xl:h-72 h-36 lg:h-44 md:h-48 object-cover rounded-t-xl sm:h-62 w-full xl:h-56"
              alt="Single Project"
            />
          </div>
          <div className="px-4 py-2">
            <p
              className="dark:text-white font-bold font-general-medium mb-2
                            md:text-sm text-left text-sm text-ternary-dark"
            >
              {name}
            </p>
            <span className="dark:text-white font-bold text- text-left text-ternary-dark">
              Creator : {creator}{" "}
            </span>
            {accountId ? (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  ease: "easeInOut",
                  duration: 0.9,
                  delay: 0.1,
                }}
                className="cursor-pointer bg-transparent bg-gradient-to-r from-purple-700 to-pink-600
              hover:text-gray-300 px-8 rounded-md"
              onClick={() => handleClickMint(tokenId, cid)}
              >
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    ease: "easeInOut",
                    duration: 0.9,
                    delay: 0.1,
                  }}
                  className="font-general-regular 
                            text-center text-ternary-dark
                            dark:text-white
                            font-bold mt-1  
                            "
                >
                  Mint
                </motion.h1>
              </motion.button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default NftSingle;
