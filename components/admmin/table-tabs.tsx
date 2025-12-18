"use client";

import { useRouter } from "next/navigation";
import { Tabs } from "../ui/tabs";
import PendingTransactionsTable from "./pending-transactions-table";
import PendingUsersTable from "./pending-users-table";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function TableTabs() {
  const router = useRouter()
      const {data:session,status} = useSession();
        useEffect(() => {
          if (status === 'loading') {
            return; 
          }
          if ( !session?.user?.roles?.includes('Admin')) {
            router.replace("/")
          }
        }, [status, router,session]) 
  const tabs = [
    {
      title: "Pending Users",
      value: "pendingUsers",
      content: (
        <div className="w-full overflow-y-scroll relative h-full md:rounded-2xl sm:rounded-sm  md:p-10 text-xl md:text-4xl font-bold  bg-card">
          <p>Pending Users</p>
          <PendingUsersTable/>
        </div>
      ),
    },
    {
      title: "Pending Transactions",
      value: "pendingTransactions",
      content: (
        <div className="w-full overflow-y-scroll relative h-full md:rounded-2xl sm:rounded-sm  md:p-10 text-xl md:text-4xl font-bold  bg-card">
          <p>Pending Transactions</p>
          <PendingTransactionsTable />
        </div>
      ),
    }
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col md:max-w-7xl md:min-w-7xl sm:min-w-full mx-auto w-full  items-start justify-start my-8">
      <Tabs tabs={tabs} />
    </div>
  );
}


