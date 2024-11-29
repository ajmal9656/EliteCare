import Stripe from "stripe";
import dotenv from "dotenv";
import { log } from "util";

dotenv.config();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

async function makeThePayment(data: any, appointmentId: any) {
  // Ensure doctorName, doctorId, fees, and imageUrl are present in data
  const doctorName = data.doctor.name || "Unknown Doctor"; // Fallback to a default value
  const doctorId = data.doctor._id || "Unknown Doctor ID"; // Fallback to a default value
  const amount = data.doctor.fees || 0; // Ensure there's a valid amount
  const imageUrl =
    data.doctor.signedImageUrl || "https://via.placeholder.com/150"; // Fallback to placeholder image if not provided

  // Build line items
  const line_items = [
    {
      price_data: {
        currency: "inr",
        product_data: {
          name: doctorName,
          images: [imageUrl],
          description: `Consultation with Dr. ${doctorName}`,
          // metadata: {
          //   doctorId: doctorId, // Include doctorId as metadata
          // },
        },
        unit_amount: amount * 100,
      },
      quantity: 1,
    },
  ];

  try {
    const session = await stripe.checkout.sessions.create({
      success_url: `https://ajmals.site/confirmPayment/${appointmentId}/${doctorId}`,
      cancel_url: `https://ajmals.site/paymentFailed`,
      line_items: line_items,
      mode: "payment",
    });

    return session;
  } catch (error: any) {
    console.log("Error in payment", error);
    throw new Error(`Payment failed: ${error.message}`);
  }
}

export async function refund(paymentId: string, status: string): Promise<any> {
  try {
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(paymentId);
    console.log("session", session);
    console.log("payID", paymentId);

    // Ensure the paymentIntentId exists and is of the correct type
    const paymentIntentId = session.payment_intent as string | null;
    if (!paymentIntentId) {
      throw new Error("No payment intent found in the session.");
    }

    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const chargeId = paymentIntent.latest_charge as string | null;
    if (!chargeId) {
      throw new Error("No charge found in the payment intent.");
    }
    let refundAmount;
    if (status == "cancelled by user") {
      refundAmount = Math.round(paymentIntent.amount * 0.95);
    }
    if (status == "cancelled by doctor") {
      refundAmount = paymentIntent.amount;
    }

    // Create the refund
    const refund = await stripe.refunds.create({
      charge: chargeId,
      amount: refundAmount, // Amount should be in cents
    });

    console.log("refund", refund);

    return refund; // Return the refund details
  } catch (error: any) {
    console.error("Error in processing refund:", error.message);
    throw new Error(`Failed to process refund: ${error.message}`);
  }
}

export default makeThePayment;
