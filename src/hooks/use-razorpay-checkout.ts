"use client";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(params: {
  keyId: string;
  orderId: string;
  amount: number;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
  onSuccess: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  onDismiss?: () => void;
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error("Failed to load Razorpay checkout script");
  }

  const razorpay = new window.Razorpay({
    key: params.keyId,
    order_id: params.orderId,
    amount: params.amount,
    currency: "INR",
    name: params.name,
    description: params.description,
    prefill: params.prefill,
    theme: { color: "#caa24b" },
    handler: params.onSuccess,
    modal: { ondismiss: params.onDismiss },
  });

  razorpay.open();
}
