"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { toast } from "sonner";

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export const stripePromise = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : null;

interface StripeCheckoutPaymentProps {
  clientSecret: string;
  onSuccess: () => void;
}

function StripePaymentForm({ clientSecret, onSuccess }: StripeCheckoutPaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) {
      toast.error("تجهيز الدفع لم يكتمل بعد، حاول مرة أخرى.");
      return;
    }
    setIsPaying(true);
    try {
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/account`,
        },
        redirect: "if_required",
      });
      if (result.error) {
        toast.error(result.error.message || "فشل إتمام الدفع.");
        return;
      }
      if (result.paymentIntent?.status === "succeeded") {
        toast.success("تم الدفع بنجاح.");
        onSuccess();
        return;
      }
      toast.info("الدفع قيد المعالجة، قد يستغرق بضع ثوانٍ.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      <Button type="button" onClick={handlePay} isLoading={isPaying || !stripe} className="w-full">
        ادفع الآن
      </Button>
    </div>
  );
}

export function StripeCheckoutPayment({ clientSecret, onSuccess }: StripeCheckoutPaymentProps) {
  if (!stripePromise || !clientSecret) {
    return (
      <p className="text-xs text-red-600 font-bold">
        لم يتم إعداد الدفع بالبطاقة بعد — أضف NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY إلى ملف .env أمام الواجهة.
      </p>
    );
  }
  return (
    <Elements stripe={stripePromise} options={{ clientSecret, locale: "ar" }}>
      <StripePaymentForm clientSecret={clientSecret} onSuccess={onSuccess} />
    </Elements>
  );
}