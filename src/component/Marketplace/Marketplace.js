import Banner from "../Banner";

/// 2023.9.22 - Milos - NFT Collection
const Marketplace = (props) => {
  return (
    <div className="container mx-auto">
      <Banner accountId={props.accountId}  weaponNfts={weaponNfts} setWeaponNfts={setWeaponNfts}  /> 
    </div>
  );
};

export default Marketplace;
