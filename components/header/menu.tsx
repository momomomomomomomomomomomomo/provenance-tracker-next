import { EllipsisVertical, ShoppingCart, User, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

import UserButton from "./user-button";
import { ModeToggle } from "./mode-toggle";
import { getServerSession } from "next-auth";

const Menu = async () => {
  const session = await getServerSession();

  return (
    <>
      <div className="flex justify-end gap-3">
        <nav className="md:flex hidden w-full max-w-xs gap-6">
          <ModeToggle  />
         
          <UserButton />
        </nav>
        <nav className="md:hidden">
          <Sheet>
            <SheetTrigger className="align-middle">
              <EllipsisVertical />
            </SheetTrigger>
            <SheetContent className="flex flex-col items-start p-6">
              <SheetTitle>Menu</SheetTitle>
              <ModeToggle />
             {!session? <SheetClose asChild><UserButton/></SheetClose>  :<UserButton />}
              
              
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </>
  );
};

export default Menu;
