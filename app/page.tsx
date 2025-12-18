"use client";

import ProvenanceCarousel from '@/components/provenance-carousel';
import { BACKEND_URL } from '@/lib/config';
import { useSession } from 'next-auth/react';
import ChangelogProduct from '@/components/ChangeLogProduct';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';



export default function Home() {
  const [productId,setProductId] = useState("");
  const [transactions,setTransactions] = useState([]);
  const searchParams = useSearchParams();
  const productIdLink = searchParams.get('productId');
  const{data:session} = useSession();
  console.log(session)
  
  const fetchProductTransactions = async (productId: string) => {
    try {
      console.log(productId);
      const res = await fetch(`${BACKEND_URL}/api/transaction/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error('Product not found');
      
      const data = await res.json();
      if (!data.chainValid) throw new Error('Product compromised');
      console.log(data);
      setTransactions(data.transactions);
     
    } catch (error) {
      toast.error((error as Error).message);
      setTransactions([]);
    } 
  };
  const onSubmit = (e:React.FormEvent)=>{
    e.preventDefault();
    fetchProductTransactions(productId);
    
  }
  useEffect(() => {
    
      if (productIdLink) {
  
        fetchProductTransactions(productIdLink);
      }
    }, [productIdLink]); 
    useEffect(() => {
      if(transactions.length>0){

        const targetElement = document.getElementById("change-log");
       if (targetElement) {
         targetElement.scrollIntoView({
           behavior: 'smooth',
           block: 'start',
         });
       }
      }

  }, [transactions]);
  console.log(transactions.length);
  return (
    <div className='w-full'>
     
      <ProvenanceCarousel productId={productId} setProductId={setProductId} onSubmit={onSubmit}/> 
      <div id='change-log' >
      {transactions.length>0 && <ChangelogProduct entries={transactions} />}
      </div>
    </div>
  );
}

