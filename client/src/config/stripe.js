import { loadStripe } from "@stripe/stripe-js";

// Stripe publishable key from environment
const stripePublishableKey =
  "pk_test_51S6FlVQg4BXMauysYGfgPUFR0XRVYxespEng4NQoFr9OKQcBJ0pz3XVspEiGrCtMftbpIs3pnvl052QbqavWfDKW00OtJymeIB";

// Initialize Stripe
let stripePromise;
if (typeof window !== "undefined") {
  stripePromise = loadStripe(stripePublishableKey);
}

export { stripePromise };
export default stripePromise;
