import React, { useContext, useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import './checkoutForm.css'
import { AuthContext } from '../../providers/AuthProvider';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { bookingStatus } from '../../api/bookings';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ImSpinner9 } from 'react-icons/im'
const CheckoutForm = ({ closeModal, bookingInfo }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState('')
    const { user } = useContext(AuthContext)
    const [clientSecret, setClientSecret] = useState('')
    const [axiosSecure] = useAxiosSecure()
    const navigate = useNavigate()
    const [processing, setProcessing] = useState(false)
    useEffect(() => {
        axiosSecure.post('/create-payment-intent', { price: bookingInfo.price })
            .then(data => {
                console.log(data.data.clientSecret)
                setClientSecret(data.data.clientSecret)
            })
    }, [axiosSecure, bookingInfo])

    const handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        // Use your card Element with other Stripe.js APIs
        setCardError('')
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            console.log('[error]', error);
            setCardError(error.message)
        } else {
            console.log('[PaymentMethod]', paymentMethod);
        }

        setProcessing(true)
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: user?.displayName || 'unknown',
                    email: user?.email || 'anonymous'
                },
            },
        })

        console.log('paymentIntent', paymentIntent)

        if (confirmError) {
            console.log(confirmError)
            setCardError(confirmError.message)
        }

        if (paymentIntent) {
            const paymentInfo = {
                ...bookingInfo,
                transactionId: paymentIntent.id,
                date: new Date()
            }

            axiosSecure.post('/bookings', paymentInfo)
                .then(res => {
                    console.log(res.data)
                    if (res.data.insertedId) {
                        bookingStatus(bookingInfo.roomId, true)
                            .then(data => {
                                console.log('bookingStatus', data)
                                toast.success('Booking Successful!')
                                setProcessing(false)
                                closeModal()
                                navigate('/dashboard/my-bookings')
                            })
                            .catch(error => {
                                setProcessing(false)
                                closeModal()
                                console.log(error)
                            })
                    }
                })
                .catch(error => {
                    setProcessing(false)
                    closeModal()
                    console.log(error)
                })
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
                {cardError && <p className='text-red-500'>{cardError}</p>}
                <hr className='mt-8 ' />
                <div className='flex mt-2 justify-around'>
                    <button
                        type='button'
                        className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit" disabled={!stripe || processing}
                        className='inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2'
                    // onClick={modalHandler}
                    >
                        {processing ? <ImSpinner9 className='animate-spin mx-auto'></ImSpinner9> : `Pay ${bookingInfo.price}$`}
                    </button>
                </div>
            </form>
        </>
    );
};


export default CheckoutForm;