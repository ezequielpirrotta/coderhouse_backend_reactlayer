import React, {useEffect, useState} from "react";
import { useContext } from "react";
import { CartContext } from "../carts/CartContext";
import { UserContext } from "../users/UserContext";
import Order from "./Order";
import Swal from 'sweetalert2';

function Checkout () {
    const {totalPrice, purchaseCart} = useContext(CartContext);
    const [created, setCreated] = useState(false)
    const [order, setOrder] = useState({})
    const [paymentMethod, setPaymentMethod] = useState('')

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'payment-method') {
            setPaymentMethod(value);
        } 
        /*else if (name === 'password') {
            setPassword(value);
        } */
    };

    useEffect(() => {

        let forms = document.querySelectorAll('.needs-validation')
       
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    if (!form.checkValidity()) {
                        event.preventDefault()
                        event.stopPropagation()
                    }
            
                    form.classList.add('was-validated')
                }, false)
            });
            
    },[created])
    const generateOrder = async (e) => {
        e.preventDefault()
        const result = await purchaseCart(paymentMethod)
        if(result){
            setOrder(result.order)
            setCreated(result)
        }
        else {
            console.log(result)
            Swal.fire({
                title:"Error comprando carrito",
                icon:"error",
                text: result.message?result.message:"Intente de nuevo más tarde"
            })
        }
        console.log(order)
    };           
                   
    if(!created) {

        return(

            <div className="container-fluid m-3 d-flex justify-content-center">
                
                <div className="card d-flex justify-content-center">
                    <h5 className="card-title">Su compra</h5>        
                    <h6 className ="card-subtitle mb-2 text-muted">Total: ${totalPrice()}</h6>
                    
                    
                    <div className="shadow-lg bg-body rounded">
        
                        <form className="card-body row g-3 justify-content-center needs-validation" onSubmit={generateOrder} noValidate>
                            <div class="input-group mb-3">
                                <label class="input-group-text" for="inputGroupSelect01">Metodos de Pago</label>
                                <select class="form-select" onChange={handleInputChange} name="payment-method" id="inputGroupSelect01">
                                    <option value="debit">Debito</option>
                                    <option value="credit">Credito</option>
                                    <option value="cash">Efectivo</option>
                                </select>
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