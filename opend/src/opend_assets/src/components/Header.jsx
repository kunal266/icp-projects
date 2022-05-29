import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { BrowserRouter,Link,Switch,Route } from "react-router-dom";
import homeImage from "../../assets/home-img.png";
import Minter from "./Minter";
import Gallery from "./Gallery";
import {opend} from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";
function Header() {
  const [walletBalane,setwalletBalance] = useState();
  // const [walletConnected,setWalletConnected] = useState();
    const walletConnect = async () => {
    // Canister Ids
    const nftCanisterId = 'ryjl3-tyaaa-aaaaa-aaaba-cai'
    const openDCanisterId = 'r7inp-6aaaa-aaaaa-aaabq-cai'
    const openDAssetId = 'rkp4c-7iaaa-aaaaa-aaaca-cai'
    // Whitelist
    const whitelist = [
      // nftCanisterId,
      // openDAssetId,
      openDCanisterId
    ];
  
    // Host
    const host = "http://127.0.0.1:8000/";
  
    // Make the request
    try {
      const publicKey = await window.ic.plug.requestConnect({
        whitelist,
        host,
        timeout: 50000
      });
      console.log(`The connected user's public key is:`, publicKey);
      const principalId = await window.ic.plug.agent.getPrincipal();

      console.log("principal is ",principalId.toString())
      const result = await window.ic.plug.requestBalance();
      console.log(result[0].amount);
      setwalletBalance(result[0].amount)
    } catch (e) {
      console.log(e);
    }
  }
  const [userOwnerGallery,setOwnedGallery] = useState();
  const [listingGallery,setlistingGallery] = useState();

  
  async function getNFTs(){
    const result = await window.ic.plug.isConnected();
    console.log("the site is connected: ",result)
    if (result){
      // const pId = await window.ic.plug.agent.getPrincipal();
    const userNFTIds = await opend.getOwnedNFTs(CURRENT_USER_ID);
    console.log("your nfts are: ",userNFTIds);
    setOwnedGallery(<Gallery title="My NFT" ids={userNFTIds} role="collection"/>);
    }
    else{
      console.log("Please Connect")
    }
    const listedNFTIds =await opend.getListedNFTs();
    console.log("listed nfts are: ",listedNFTIds);
    setlistingGallery(<Gallery title="Discover" ids={listedNFTIds} role="discover"/>)
    
  };
  useEffect(()=>{
    getNFTs();
  },[]);
  
  return (
    <BrowserRouter forceRefresh={true}>
    <div className="app-root-1">
      <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
        <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
          <div className="header-left-4"></div>
          <img className="header-logo-11" src={logo} />
          <div className="header-vertical-9"></div>
          <Link to="/">
          <h5 className="Typography-root header-logo-text">OpenD</h5>
          </Link>
          <div className="header-empty-6"></div>
          <div className="header-space-8"></div>
          
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/discover">
              Discover
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to ="/minter">
            Minter</Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
          <Link to = "/collection">
            My NFTs</Link>
          </button>
          <span className=" Button-root header-navButtons-3 Button-border bg-color" >
            {walletBalane==null?0.0:walletBalane} ICP
          </span>
          <button className=" Button-root header-navButtons-3 Button-border bg-color" onClick={walletConnect}>
            Wallet
          </button>
        </div>
      </header>
    </div>
    <Switch>
      <Route exact path="/">
      <img className="bottom-space" src={homeImage} />
      </Route>
      <Route path="/discover">
        {listingGallery}
      </Route>
      <Route path="/minter">
      <Minter/>
      </Route>
      <Route path="/collection">
        {userOwnerGallery}
      </Route>
    </Switch>
    </BrowserRouter>
  );
}

export default Header;
