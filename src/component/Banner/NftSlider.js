import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AccountId } from "@hashgraph/sdk";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const uri = `https://testnet.mirrornode.hedera.com/api/v1`;
const instance = axios.create({
  baseURL: uri,
});

/// 2023.9.22 - Milos - NFT Slider

const NftSlider = (props) => { 

  // Slider Settings.
  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 1500,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1160,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 470,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 370,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true,
        },
      },
    ],
  };
 
  const [weaponNfts, setWeaponNfts] = useState([]);
  const accountId = AccountId.fromString(props.accountId);
  const [ip, setIp] = useState();
  let value = [],
    metadata = [];

  // 2023.9.23 - Milos - Get Users IP for Unreal integration
  const getIp = async () => {
    // Connect ipapi.co with fetch()
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    // Set the IP address to the constant `ip`
    setIp(data.ip);
  };

  // Run `getIP` function above just once when the page is rendered
  useEffect(() => {
    getIp();
  }, []);

  // 2023.9.23 - Milos - Socket between React and Unreal
  useEffect(() => {
    if (ip) {
      const ws = new WebSocket(`ws://${ip}:9000`);

      ws.onopen = function () {
        console.log("Connected to WebSocket server");
      };

      ws.onmessage = function (event) {
        console.log("Message received:", event.data);
        if (accountId) {
          ws.send([accountId, balance]);
        }
      };

      ws.onclose = function () {
        console.log("Disconnected from WebSocket server");
      };

      return () => {
        ws.close();
      };
    }
  }, [accountId, ip]);

  // 2023.9.22 - Milos - Get Weapon NFTS in user wallet
  useEffect(() => {
    const load = async () => {
      if (weaponNfts.length > 0) {
        console.log("Already imported");
      } else {
        // Get Weapon NFT infos using Rest API
        let nftaccounts = await instance.get(`accounts/${accountId}/nfts`);
        let nfts = nftaccounts.data.nfts;

        for (var i = 0; i < nfts.length; i++) {

          // Convert Base64 to buffer
          const currentvalue = nfts[i].metadata;
          const newValue = Buffer.from(currentvalue, "base64");

          const res = await fetch(`https://ipfs.io/ipfs/${newValue}`);
          const meta = await res.json();
          meta.image = meta.image.slice(7);
          value[i] = "https://ipfs.io/ipfs/" + meta.image;
          metadata.push(meta);
        }
        setWeaponNfts(value);
      }
      Sendnft(metadata, accountId)
    };

    load();
  }, [accountId, balance, minted]);


  // 2023.9.23 - Milos -  Send Weapon NFTS to Backend
  const Sendnft = (metadata, accountId) => {
    var arr = {
      accountId: accountId.toString(),
      metadata: metadata,
    };

    axios.post("/users/nftsave", arr).then((res) => {
      if (res.data === "success") alert("success");
      else if (res.data === "Already send") alert("Already send");
    });
  };

  return (
    <>
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
                      text-3xl
                      sm:text-4xl
                      pt-20
                      font-bold
                      "
      >
        My NFT Collections
      </motion.h1>
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
          NFT Send
        </motion.h1>
      </motion.button>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
        className="flex flex-col items-center md:mt-12 mx-auto sm:flex-row sm:justify-between"
      >
        <motion.div
          initial={{ opacity: 0, y: -180 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
          className="float-right mt-8 sm:mt-0 sm:w-full text-right w-full"
        >
          <Slider {...settings} className="mx-3 my-10 slider">
            {weaponNfts.map((nft, index) => {
              return (
                <div className="px-3" key={index}>
                  <div className="bg-white dark:bg-ternary-dark rounded-xl shadow-lg slider-card">
                    <div className="slider-img w-full">
                      <img
                        src={nft}
                        alt=""
                        className="2xl:h-290 h-290 lg:h-186 md:h-203 object-cover rounded-t-xl sm:h-4 w-full xl:h-242"
                      />
                    </div>
                    <h1 className="dark:text-white font-bold p-3 text-black text-center">
                      @SpaceKitty
                    </h1>
                  </div>
                </div>
              );
            })}
          </Slider>
        </motion.div>
      </motion.section>
    </>
  );
};
export default NftSlider;
