import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[CREATE-CHECKOUT] Starting checkout session creation')
    
    const { planType, userEmail, deviceMode, totalPrice } = await req.json()
    console.log('[CREATE-CHECKOUT] Request data:', { planType, userEmail, deviceMode, totalPrice })
    
    // Check if Stripe secret key is configured
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      console.error('[CREATE-CHECKOUT] STRIPE_SECRET_KEY not configured')
      throw new Error('STRIPE_SECRET_KEY not configured')
    }
    
    // Initialize Stripe
    const stripe = new (await import('https://esm.sh/stripe@13.0.0')).default(
      stripeKey,
      {
        apiVersion: '2023-10-16',
      }
    )

    console.log('[CREATE-CHECKOUT] Creating Stripe checkout session')
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `InterviewAce ${planType} Plan`,
              description: `${deviceMode} device mode`,
            },
            unit_amount: totalPrice, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/payment`,
      metadata: {
        plan_type: planType,
        device_mode: deviceMode,
        user_email: userEmail,
      },
    })

    console.log('[CREATE-CHECKOUT] Checkout session created:', session.id)

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('[CREATE-CHECKOUT] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})