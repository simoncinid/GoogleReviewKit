import ReviewKit from './reviewkit';
export default function Page() { return <ReviewKit checkoutUrl={process.env.REVIEWKIT_CHECKOUT_URL || ''} />; }
