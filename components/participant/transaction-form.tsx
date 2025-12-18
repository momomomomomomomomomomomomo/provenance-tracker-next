"use client";
import { BACKEND_URL } from "@/lib/config"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import FieldSwitch from "./Switch"
import { useEffect, useState } from "react"
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { error } from "console";

export default function CreateTransactionForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
      const {data:session,status} = useSession();
        useEffect(() => {
          if (status === 'loading') {
            return; 
          }
          if ( !session?.user?.roles?.includes('Participant')) {
            router.replace("/")
          }
        }, [ status,router,session]) 
  const [isChecked, setIsChecked] = useState(false) 
  const [productStatus, setProductStatus] = useState("") 
  const [description, setDescription] = useState("") 
  const [location, setLocation] = useState("") 
  const [productId, setProductId] = useState("") 
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try{const res = await fetch(`${BACKEND_URL}/api/participant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.backendToken}`,
      },
      body: JSON.stringify({
        productId:isChecked?crypto.randomUUID():productId,
        status:productStatus,
        description,
        location,
        firstTransaction:isChecked,
      }),
    });

    console.log(res);
    console.log(res.text());
    if(!res.ok){
      throw new Error("Wrong Product Id.");
    }
    setIsLoading(false);
    toast.success("Transaction created successfully!")
    router.push("/transactions");}
    catch(err){
      setIsLoading(false); 
      toast.error((err as Error).message);
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSwitch isChecked={isChecked} setIsChecked={setIsChecked}/>
            <Field className={cn(
    "transition-all duration-300 ease-in-out overflow-hidden",
    isChecked ? "max-h-0 opacity-0 mt-0" : "max-h-96 opacity-100"
  )}>
              <FieldLabel htmlFor="productId">Product ID</FieldLabel>
              <Input  id="productId"
              type="text"
                  placeholder="123e4567-e89b-12d3-a456-426614174000"
                  required={!isChecked}
                  value={productId} 
                  onChange={(e) => setProductId(e.target.value)} 
                  disabled={isLoading}/>
            </Field>
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Input  id="status"
              type="text"
                  placeholder="Enter your product status"
                  required
                  value={productStatus} 
                  onChange={(e) => setProductStatus(e.target.value)} 
                  disabled={isLoading}/>
            </Field>
            <Field>
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <Input  id="location"
              type="text"
                  placeholder="Enter your transaction location"
                  required
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  disabled={isLoading}/>
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                  placeholder="Enter your transaction description"
                  required
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  disabled={isLoading} 
              />
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Create Transaction</Button>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
