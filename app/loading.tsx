import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-32 animate-spin", className)}
      {...props}
    />
  )
}

export default function LoadingPage() {
  return (
    <div className="flex justify-center items-center w-screen h-screen ">
      <Spinner />
    </div>
  )
}
