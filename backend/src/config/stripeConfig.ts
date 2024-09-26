import Stripe from "stripe";
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20', // Make sure this is the correct version
});

async function makeThePayment(
  data: any,appointmentId:any
) {
  // Ensure doctorName, doctorId, fees, and imageUrl are present in data
  const doctorName = data.doctor.name || "Unknown Doctor"; // Fallback to a default value
  const doctorId = data.doctor._id || "Unknown Doctor ID"; // Fallback to a default value
  const amount = data.doctor.fees || 0; // Ensure there's a valid amount
  const imageUrl = data.doctor.signedImageUrl || "https://via.placeholder.com/150"; // Fallback to placeholder image if not provided

  // Build line items
  const line_items = [
    {
      price_data: {
        currency: 'inr', // Specify the currency
        product_data: {
          name: doctorName, // Use doctorName
          images: [imageUrl], // Include the image URL
          description: `Consultation with Dr. ${doctorName}`, // Add a description (optional)
          // metadata: {
          //   doctorId: doctorId, // Include doctorId as metadata
          // },
        },
        unit_amount: amount * 100, // Convert amount to smallest currency unit (paisa)
      },
      quantity: 1,
    },
  ];

  try {
    const session = await stripe.checkout.sessions.create({
      success_url: `http://localhost:5173/confirmPayment/${appointmentId}/${doctorId}`, // Replace with your actual frontend URL
      cancel_url: `http://localhost:5000/paymentFailed`, // Replace with your actual frontend URL
      line_items: line_items,
      mode: 'payment',
    });

    
    return session;
  } catch (error: any) {
    console.log("Error in payment", error);
    throw new Error(`Payment failed: ${error.message}`);
  }
}

export default makeThePayment;
