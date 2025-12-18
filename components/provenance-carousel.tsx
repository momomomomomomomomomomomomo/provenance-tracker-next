"use client";

import * as React from "react";
import { Hash, QrCode, UserStar, ArrowLeftRight, LogInIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import { BACKEND_URL } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { DockItem, FloatingDock } from "./ui/floating-dock";
import { useSession } from "next-auth/react";
import { VanishInput } from "./vanish-input";
import { FileUpload } from "@/components/ui/file-upload";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProvenanceCarousel({
  onSubmit,
  productId,
  setProductId,
}: {
  onSubmit: (e: React.FormEvent) => void;
  productId: string;
  setProductId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const router = useRouter();
  const { data: session, update } = useSession();

  useEffect(() => {
    if (session?.user?.roles?.includes("Admin")) {
      router.replace("/admin");
    }
  }, [router, session]);
  const handleNavigateToTransactions = () => {
    router.push("/transactions");
  };

  const handleParticipantRequest = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/user/participant-approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.backendToken}`,
        },
      });

      if (res.ok) {
        const apiData = await res.json();
        toast.success("Success! You're participant request in review.");

        const newRoles = [...(session?.user?.roles || []), "Participant"];
        const uniqueRoles = [...new Set(newRoles)];

        await update({
          user: {
            ...session?.user,
            roles: uniqueRoles,
          },
        });
      } else {
        const errorData = await res.json();
        const firstError = errorData.errors?.[0]?.description || errorData.message;
        toast.error(`Error: ${firstError}`);
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    }
  };

  const [api, setApi] = useState<CarouselApi>();
  const [files, setFiles] = useState<File[]>([]);

  const participantRole = session?.user?.roles?.includes("Participant");
  const isApproved = session?.user?.isApproved;

  const links: DockItem[] = [
    { title: "Product ID", icon: <Hash />, onClick: () => api?.scrollTo(0) },
    { title: "QRCODE", icon: <QrCode />, onClick: () => api?.scrollTo(1) },
    session?.user
      ? {
          title: participantRole
            ? isApproved
              ? "transactions"
              : "In Review"
            : "become Participant",
          icon: participantRole ? <ArrowLeftRight /> : <UserStar />,
          onClick: participantRole && isApproved?handleNavigateToTransactions : handleParticipantRequest,
          disabled: participantRole && !isApproved,
        }
      : { title: "login", icon: <LogInIcon />, href: "/login" },
  ];

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  return (
    <div className="flex flex-col mt-8 justify-center bg-background font-sans">
      <FloatingDock items={links} />
      <div className="mx-auto mt-16">
        <Carousel
          setApi={setApi}
          opts={{ watchDrag: false }}
          className="max-w-xs md:max-w-full"
        >
          <CarouselContent>
            <CarouselItem className="mt-10">
              <VanishInput productId={productId} setProductId={setProductId} onSubmit={onSubmit} />
            </CarouselItem>
            <CarouselItem>
              <FileUpload onChange={handleFileUpload} />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
