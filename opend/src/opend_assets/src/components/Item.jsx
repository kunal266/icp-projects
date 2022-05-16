import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import {Actor,HttpAgent} from '@dfinity/agent';
import {idlFactory} from '../../../declarations/nft';
import {Principal} from "@dfinity/principal"
import Button from "./Button";
function Item(props) {
  const[Owner,setowner] = useState();
  const [name,setName] = useState();
  const [image,setImage] = useState();
  const [button,setButton] = useState();
  const [priceInput,setpriceInput] = useState();

  const id = props.id;

  const localhost = "http://localhost:8080/"
  const agent = new HttpAgent({host:localhost});
  
  async function loadNFT() {
    const NFTActor = await Actor.createActor(idlFactory,{
      agent,
      canisterId:id,

    });
    const name = await NFTActor.getName();
    setName(name);

    const owner = await NFTActor.getOwner();
      
    setowner(owner.toText());
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
      new Blob([imageContent.buffer],{type:"image/png"})
      );
    setImage(image);

    setButton(<Button handleClick={handleSell} text={"Sell"}/>)
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
      console.log("confirmed clicked")
  } 
  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
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
