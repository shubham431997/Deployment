import Stripe from "stripe";

// Initialize Stripe with your secret key and API version
const _stripe = new Stripe(process.env.STRIPE_SECRETE_KEY, {
  apiVersion: "2022-11-15",
});

class StripeIntegration {
  // Method to create a customer
  async createCustomer(name, email) {
    try {
      const customer = await _stripe.customers.create({
        name: name,
        email: email,
      });
      console.log(customer.id);
      return customer;
    } catch (error) {
      throw error;
    }
  }

  // Method to create a payment sheet
  async paymentSheet(data) {
    try {
      // Call createCustomer on the instance (use `this`)
      const customer = await this.createCustomer(data.name, data.email);
      
      // Corrected method to create an ephemeral key with the API version in a separate options hash
      const ephemeralKey = await _stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2022-11-15' } // Pass apiVersion as part of the options hash
      );

      // Create a payment intent for the customer
      const paymentIntent = await _stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency,
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      const response = {
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async idealPayment(data) {
    try {
      const paymentIntent = await _stripe.paymentIntents.create({
        amount: data.amount,
        currency: "eur",
        payment_method_types: ["ideal"],
        receipt_email: data.email, 
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      throw error;
    }
  }
  
}

export default new StripeIntegration();
