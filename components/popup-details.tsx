import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "./ui/badge"
interface PopupDetailsProps {
  children: React.ReactNode 
  description?: string
  date?: string
  reactElement?: React.ReactElement
  productId?: string
  confirmationStatus?: string
}

export function PopupDetails({children,description,date,productId,reactElement,confirmationStatus}:PopupDetailsProps) {
  const myDate = new Date(date + 'Z');
  return (
    <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] px-4 pt-16">
          <DialogHeader>{

            reactElement?<DialogTitle>{reactElement}</DialogTitle>:<><DialogTitle className="flex flex-between"><div>{myDate.toLocaleDateString()}</div> {confirmationStatus==="Cancelled"? <Badge  variant={"destructive"}>{confirmationStatus}</Badge>:<Badge  variant={"default"}>{confirmationStatus}</Badge>}</DialogTitle>
            <DialogDescription className="pt-8 px-6">
             {description}
            </DialogDescription>
            <DialogDescription className="text-xs pt-16 flex justify-start">
              Product ID: {productId}
            </DialogDescription>
            </>}
          </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}
