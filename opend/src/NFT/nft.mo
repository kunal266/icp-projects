import Debug  "mo:base/Debug";
import Principal "mo:base/Principal";
actor class NFT (name:Text,owner:Principal,content:[Nat8]) = this {
    let itenName = name;
    let nftOwner = owner;
    let imageBytes = content;

    public query func getName(): async Text{
        return itenName;
    };
    public query func getOwner(): async Principal{
        return nftOwner;
    };
    public query func getAsset(): async [Nat8]{
        return imageBytes;
    };
    //this is return the canister id of the NFT
    public query func getCanisterId(): async Principal{
        return Principal.fromActor(this);
    }

}