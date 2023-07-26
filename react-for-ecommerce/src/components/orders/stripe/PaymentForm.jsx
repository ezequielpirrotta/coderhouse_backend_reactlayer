import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
//import { useEffect } from 'react';
import Swal from 'sweetalert2';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required'
        })
        if (!error) {
            Swal.fire({
                icon:'success',
                title:'¡Pago completado!',
                text:'El pago ha sido procesado con éxito',
                timer:3000,
                showConfirmButton:false
            }).then(()=>window.location.replace('/orders'))
        } else {
            Swal.fire({
                icon:'error',
                title:'Error al procesar el pago',
                text: error.message,
                timer:3000,
                showConfirmButton:false
            }).then(()=>window.location.replace('/orders'))
        }
    }
    return <>
        <form>
            <PaymentElement />
            <div className='buttonPanel'>
                <button className='genericButton' onClick={handleSubmit}>Pagar</button>
            </div>
        </form>
    </>
}
export default PaymentForm;