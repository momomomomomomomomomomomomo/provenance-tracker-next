"use client";
import { PopupDetails } from "./popup-details";
import { Button } from "./ui/button";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import QRCodeGenerator from "./QRCodeGenerator";



export function VanishInput( {onSubmit,productId,setProductId}:{onSubmit:(e:React.FormEvent)=>void,productId:string,setProductId:React.Dispatch<React.SetStateAction<string>>}) {
  
  const placeholders = [
    "Enter Product ID",
    "Create QRCODE to The Product",
    "Join Us and become a Participant"
  
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductId(e.target.value);
  };
  
  return (
    <div className="w-full flex flex-col justify-center  items-center px-4">
      <h2 className="mb-10 md:mb-20 text-xl text-center md:text-5xl  dark:text-white text-black">
        Track Your Product
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
      <PopupDetails reactElement={<QRCodeGenerator id={productId}/>}>

      <Button className="mt-20" variant={"default"} >Create Product QRCODE</Button>
      </PopupDetails>
    </div>
  );
}
