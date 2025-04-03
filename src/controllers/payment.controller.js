import StripeIntegration from "../utils/StripeIntegration.js";

class PaymentController {

  async stripePayment(req, res) {
    const { name, email, amount, currency } = req.body;
    console.log(name, email, amount, currency, "stripe order");
    try {
      const stripe_order = {
        name: name,
        email: email,
        amount: amount,
        currency: currency,
      };
      console.log(stripe_order, "stripe_order");
      const order = await StripeIntegration.paymentSheet(stripe_order);
      res.send(order);
    } catch (error) {
      throw error;
    }
  }

  async idealPayment(req, res) {
    const { email, amount } = req.body;
    console.log(email, amount, "iDEAL order");
    try {
      const payment = await StripeIntegration.idealPayment({ email, amount });
      res.send(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
}

export default new PaymentController();
