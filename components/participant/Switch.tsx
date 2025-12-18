"use client"

import * as React from "react"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export default function FieldSwitch({isChecked,setIsChecked}:{isChecked:boolean,setIsChecked:React.Dispatch<React.SetStateAction<boolean>>}) {
  console.log("The switch is currently:", isChecked ? "ON" : "OFF")

  return (
    <div className="w-full max-w-md">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="2fa">First Transaction</FieldLabel>
        </FieldContent>

        <Switch 
          id="2fa" 
          checked={isChecked}
          onCheckedChange={setIsChecked}
        />
      </Field>
    </div>
  )
}