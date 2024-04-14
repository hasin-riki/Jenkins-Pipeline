const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const checkout = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({ 
            payment_method_types: ["card"], 
            line_items: [{
                price: req.params.price,
                quantity: req.params.quantity
            }],
            mode: "payment", 
            success_url: "http://127.0.0.1:3000/success", 
            cancel_url: "http://127.0.0.1:3000/cancel", 
          }); 

        res.status(200).json({message: "Checkout successfully processed!"}, session.id);
    } catch (error) {
        res.status(500).json({message: error})
    }
}

module.exports=checkout;