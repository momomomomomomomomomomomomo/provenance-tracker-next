import CreateTransactionForm from "@/components/participant/transaction-form";


export default function CreateTransactionPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <CreateTransactionForm/>
      </div>
    </div>
  )
}
