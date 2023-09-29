import React, { useState, useEffect, useContext } from "react";
import NftSingle from "./NftSingle";
import { MetroSpinner } from "react-spinners-kit";
import { HaschconnectContext } from "../../App";



/// 2023.9.26 - Milos - NFT Mint Collection // 2023.9.29 - Milos - Update

//Cids
const cids = [
  "bafkreibkkdluwr2njbcgg5tuekayujrrvi3ssdmiyv25nmeft7hwr7xbdq",
  "bafkreielqgr4yguxj6clpdwgrk5ll2nbp5nljyskmgr2fpehtdoxjysleq",
  "bafkreigumnzpttfktpeyv7yyflyki72gqauhnwbi3pmy6ni57r4sndntoq",
  "bafkreibiir43b3yvjc6maeykdircg5w36fkwheamwvenkxc45cnmadn4qy",
  "bafkreigugt7kkgqzp2ftefxk6bqedm54quer6uehgqigeaizabn7jy6tq4",
  "bafkreiebvaxpedqvj4n6n2jshxfosm5dmkhrqyh3s3n2xb4a6zfbic6niq",
  "bafkreiheys476tnkn2slmlpzrrnmv4zfapwqopwf5env5537qgmbg6efmy",
  "bafkreic3nwf2zcwpmbkpvr63yywvmdzlhk5au3prkzblaap3rwowqkqcdq",
  "bafkreig3mc6i7qdmttskyegu4pgtvuwe4grkkcsqv5itdwfadope4djyuq",
  "bafkreiant4jjitb6sz57hqyivxrrxfkyo5pkxoiu227tty2gywgndfi2gu",
  "bafkreib2as22hd2bbdrqenic7ccn63jyj3wvhvq7e7b3noxzor4ivpigqa",
  "bafkreibiwkhpxphpyc3ruowx4wdbw2g7ia6sotgyrxqdss7ysip6nci4da",
  "bafkreig5vix7ithwvks46ysfrywhmayijuerzmcij7g5st3m6gvqak35i4",
  "bafkreibajegzx7wvmmlght4kz2mr7ifkpy4x7dnu7j4kwflxzzqc3vfhbm",
  "bafkreibdeu7gohveppttxjhox7g7jyyojaq6jg3cwpjv2q7w7stz3rd6zu",
  "bafkreigyndjulsrn7k6jbf76la5rfaplrljzx2ty2vnfg2lco5pjeh3kbm",
];


function HederaNFTGrid(props) {
  const [getDataLoading, setGetDataLoading] = useState(false);
  const [metadata, setMetadata] = useState([]);
  const { hash, minted, setMinted } = useContext(HaschconnectContext);

  let metas = [];
  // 2023.9.29 - Milos - Get NFTS from server(inventory)

  useEffect(() => {
    console.log(weaponCids.length)
    if(weaponCids.length > 0) {
      console.log("cidssd")
    } 
    else {
      getCIDs()

    }
  }, [])

  function getCIDs() {
    axios.get("http://144.76.105.15:8000/users/getcids").then(res => {
      setWeaponCids(res.data)
    })
  }

  useEffect(() => {
    const load = async () => {
      for (var i = 0; i < weaponCids.length; i++) {
        const res = await fetch(`https://ipfs.io/ipfs/${weaponCids[i]}`);
        const meta = await res.json();
        meta.image = "https://ipfs.io/ipfs/" + meta.image.slice(7);
        meta.cid = weaponCids[i];
        metas.push(meta);
      }
      setMetadata(metas);
    };
    if (metadata.length > 0) {
    } else {
      load();
    }
  });

  return (
    <section className="mt-5 py-15 sm:mt-10 sm:py-10">
      <div className="text-center">
        <p
          className="dark:text-white
                          font-bold
                          font-general-medium
                          mb-1 sm:text-4xl
                          text-2xl
                          text-ternary-dark
                          "
        >
          Buying Collections
        </p>
      </div>

      <div className="mt-7 sm:mt-7">
        <h3
          className="font-general-regular 
                        text-center text-ternary-dark
                        dark:text-white
                        text-md
                        sm:text-xl
                        mb-10
                        font-bold
                        "
        >
          Search nfts by name or filter by collection
        </h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 mt-6 p-3 sm:gap-10 sm:grid-cols-3">
        {getDataLoading ? (
          <div className="flex justify-center mt-10 w-full">
            <MetroSpinner color="#00ff89" />
          </div>
        ) : metadata.length > 0 ? (
          metadata.map((metadata, index) => (
            <HaschconnectContext.Provider value={{hash, minted, setMinted}}>
              <NftSingle
                creator={metadata.creator}
                name={metadata.name}
                cid={metadata.cid}
                image={metadata.image}
                description={metadata.description}
                accountId={props.accountId}
                topic={props.topic}
                key={index}
              />
            </HaschconnectContext.Provider>
          ))
        ) : (
          "There is no NFT"
        )}
      </div>
    </section>
  );
}

 

export default HederaNFTGrid;
