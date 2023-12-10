"use client";

import { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToOrgPayLoad } from "@/lib/validators/organization";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggleProps {
  orgId: string;
  orgName: string;
  isSubscribed: boolean;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  orgId,
  isSubscribed,
  orgName,
}) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isOrgLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToOrgPayLoad = {
        orgId,
      };

      const { data } = await axios.post("/api/organization/subscribe", payload);

      return data as string;
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "There was a problem",
        description: "Something went wrong",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Subscribed",
        description: `You joined org/${orgName}`,
      });
    },
  });

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToOrgPayLoad = {
        orgId,
      };

      const { data } = await axios.post(
        "/api/organization/unsubscribe",
        payload
      );

      return data as string;
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "There was a problem",
        description: "Something went wrong",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Unsubscribed",
        description: `You have left the org/${orgName}`,
      });
    },
  });

  return isSubscribed ? (
    <Button onClick={() => unsubscribe()} className="w-full mt-1 mb-4">
      Leave Organization
    </Button>
  ) : (
    <Button
      isLoading={isOrgLoading}
      onClick={() => subscribe()}
      className="w-full mt-1 mb-4"
    >
      Join Organization
    </Button>
  );
};

export default SubscribeLeaveToggle;
