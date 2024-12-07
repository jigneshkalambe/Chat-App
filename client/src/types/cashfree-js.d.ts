declare module "@cashfreepayments/cashfree-js" {
    interface CashfreeOptions {
        mode: "sandbox" | "production";
    }

    interface CheckoutOptions {
        paymentSessionId: string;
        redirectTarget?: "_self" | "_blank";
    }

    export function load(options: CashfreeOptions): Promise<{
        checkout: (options: CheckoutOptions) => void;
    }>;
}
