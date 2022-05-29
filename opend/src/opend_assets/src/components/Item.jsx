import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import {Actor,HttpAgent} from '@dfinity/agent';
import {idlFactory} from '../../../declarations/nft';
import {idlFactory as tokenidlFactory} from '../../../declarations/token';
import {Principal} from "@dfinity/principal"
import {opend} from "../../../declarations/opend";
import Button from "./Button";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";
function Item(props) {
  const[Owner,setowner] = useState();
  const [name,setName] = useState();
  const [image,setImage] = useState();
  const [button,setButton] = useState();
  const [loaderHidden,setloaderHidden] = useState(true);
  const [priceInput,setpriceInput] = useState();
  const [blur,setBlur] = useState();
  const [sellStatus,setsellStatus] = useState("");
  const [Pricelabel,setPricelabel] = useState("");

  const id = props.id;

  const localhost = "http://localhost:8080/"
  const agent = new HttpAgent({host:localhost});
  agent.fetchRootKey()
  let NFTActor;
  
  async function loadNFT() {
    NFTActor = await Actor.createActor(idlFactory,{
      agent,
      canisterId:id,

    });
    const name = await NFTActor.getName();
    
    const owner = await NFTActor.getOwner();
    
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
      new Blob([imageContent.buffer],{type:"image/png"})
      );
    setName(name);
    setowner(owner.toText());
    setImage(image);


    if (props.role=="collection"){

      const nftIsListed = await opend.isListed(props.id);
      if (nftIsListed){
        setowner("OpenD");
        setBlur({filter:"blur(4px)"});
        setsellStatus("Listed")
      } else {
      setButton(<Button handleClick={handleSell} text={"Sell"}/>)
      }
    } else if (props.role=="discover"){

        const originalOwner = await opend.getOriginalOwner(props.id);
        if (originalOwner.toText() != CURRENT_USER_ID.toText()){
          setButton(<Button handleClick={handleBuy} text={"Buy"}/>);
        };
        const price = await opend.getListedNFTPrice(props.id);
        setPricelabel(<PriceLabel sellPrice={price.toString()}/>);

      
    }


}


  useEffect(()=>{

    loadNFT();
  },[]);
  let price;
  function handleSell(){
    console.log("sel button clicked");
    setpriceInput(<input
      placeholder="Price in DANG"
      type="number"
      className="price-input"
      value={price}
      onChange={(e)=>price=e.target.value}
    />)
    
    setButton(<Button handleClick={sellItem} text={"Confirm"}/>)
  }

  async function sellItem(){
    setBlur({filter:"blur(4px)"});
    setloaderHidden(false);
      console.log("confirmed clicked");
      const listingResult = await opend.listItem(CURRENT_USER_ID,props.id,Number(price));
      console.log("listing: "+listingResult);
      if (listingResult=="Success"){
        const openDId = await opend.getOpenDCanisterID();
        const transferResult = await NFTActor.transferOwnership(openDId);
        console.log("transfer: "+transferResult);
        if (transferResult=="Success"){
          setloaderHidden(true)
          setButton();
          setpriceInput();
          setowner("OpenD");
          setsellStatus("Listed");
        }
      }
  } 

  async function handleBuy(){
    console.log("Buy was triggered");
    setloaderHidden(false);
    const tokenActor = await Actor.createActor(tokenidlFactory,{
      agent,
      canisterId: Principal.fromText("qjdve-lqaaa-aaaaa-aaaeq-cai"),
    });

    const sellerId = await opend.getOriginalOwner(props.id);
    const itemPrice = await opend.getListedNFTPrice(props.id);
    const result = await tokenActor.transfer(sellerId,itemPrice);
    console.log(result)
    if (result=="Success"){
      const transferResult = await opend.completePurchase(props.id,sellerId,CURRENT_USER_ID);
      console.log("purchase: "+ transferResult);
      setloaderHidden(true)
    }
  }
  return (
    <div style={{display:"block"}} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div hidden={loaderHidden} className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
        <div className="disCardContent-root">
          {Pricelabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {Owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
