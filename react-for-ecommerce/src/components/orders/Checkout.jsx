import React, {useEffect, useState} from "react";
import { useContext } from "react";
import { CartContext } from "../carts/CartContext";
import Order from "./Order";
import Swal from 'sweetalert2';

function Checkout () {
    const {totalPrice, purchaseCart} = useContext(CartContext);
    const [created, setCreated] = useState(false)
    const [order, setOrder] = useState({})
    const [paymentMethod, setPaymentMethod] = useState('')
    const [errors, setErrors] = useState({});

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'payment-method') {
            setPaymentMethod(value);
        } 
    };
    const validateForm = () => {
        let errors = {};
        let isValid = true;
        if (!paymentMethod || paymentMethod==='') {
            isValid = false;
            errors['payment'] = 'Please enter a valid payment method.';
        }
        setErrors(errors);
        return isValid;
    }
    const generateOrder = async (e) => {
        e.preventDefault()
        if (validateForm()) {
            const result = await purchaseCart(paymentMethod)
            if(result){
                setOrder(result.order)
                setCreated(result)
            }
            else {
                Swal.fire({
                    title:"Error comprando carrito",
                    icon:"error",
                    text: result.message?result.message:"Intente de nuevo más tarde"
                })
            }
        }
    };           
                   
    if(!created) {

        return(

            <div className="container-fluid m-3 d-flex justify-content-center">
                
                <div className="card d-flex justify-content-center">
                    <h5 className="card-title">Su compra</h5>        
                    <h6 className ="card-subtitle mb-2 text-muted">Total: ${totalPrice()}</h6>
                    
                    
                    <div className="shadow-lg bg-body rounded">
        
                        <form className="card-body row g-3 justify-content-center needs-validation" onSubmit={generateOrder} noValidate>
                            <div className="input-group mb-3">
                                <label className="input-group-text" htmlFor="inputGroupSelect01">Metodos de Pago</label>
                                <select className={`form-control ${errors['payment'] ? 'is-invalid' : ''}`} onChange={handleInputChange} name="payment-method" id="inputGroupSelect01">
                                    <option disabled selected value> -- select an option -- </option>
                                    <option value="debit">Debito</option>
                                    <option value="credit">Credito</option>
                                    <option value="cash">Efectivo</option>
                                </select>
                                <div className="valid-feedback">
                                    ¡Se ve bien!
                                </div>
                                {errors['payment'] && <div className="invalid-feedback">{errors['payment']}</div>}
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" type="submit">Generar orden</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
    else {
        return(
            <Order order={order}></Order>
        );
    }
}
export default Checkout;