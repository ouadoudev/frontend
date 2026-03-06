/* eslint-disable react/prop-types */
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('your_publishable_key');

const CheckoutForm = ({ totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const { data: { clientSecret } } = await axios.post('/api/payments/create-payment-intent', {
      amount: totalPrice * 100,
    });

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      console.error(error);
    } else if (paymentIntent.status === 'succeeded') {
      console.log('Payment successful');
      // Redirect or show success message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay ${totalPrice}
      </button>
    </form>
  );
};

const Checkout = ({ totalPrice }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm totalPrice={totalPrice} />
  </Elements>
);

export default Checkout;
