import React, { Suspense } from "react";
import SuccessDetails from "./SuccessDetails";
import Loading from "@/app/loading";

export const metadata = {
  title: "Order Success | NextMart",
  description: "Your payment was completed successfully. Thank you for shopping with NextMart!",
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SuccessDetails />
    </Suspense>
  );
}
