import React, {useEffect, useState} from "react";
import { useContext } from "react";
import { CartContext } from "./carts/CartContext";
//import { collection, addDoc } from "firebase/firestore";
import Order from "./Order";
import Swal from 'sweetalert2';

function Checkout () {
    const {cart, totalPrice, clearCart, purchaseCart} = useContext(CartContext);
    const [created, setCreated] = useState(false)
    const [order, setOrder] = useState({})

    const [email, setEmail] = useState("")
    const [verifyEmail, setVerifyEmail] = useState("")
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [cellNumber, setCellNumber] = useState("")

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
            
        if(Object.keys(order).length === 0) {

            setOrder({
                "user_info": {
                    "email": email,
                    "name": name,
                    "lastname": lastName,
                    "cell_number": cellNumber
                },
                "items": 
                    cart.products.map(product => {
                        return(
                            {
                                "id": product.id,
                                "desc": product.description,
                                "name": product.name,
                                "quantity": product.quantity,
                                "price": product.price  
                            }
                        )
                    })
                ,
                "state": "generado",
                "date": new Date().toLocaleDateString('es-es', { weekday:"long", year:"numeric", month:"short", day:"numeric"}),
                "total": totalPrice()
                
            });
        }
        else {
            console.log('orden lista')
        }
    },[created])
    const generateOrder = async (e) => {
        e.preventDefault()
        const result = await purchaseCart()
        if(result){
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
        //const ordersCollection = collection(db, "orders");
        /*addDoc(ordersCollection, order)
        .then(({id}) => {
            setOrder({ id: id, ...order })
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Orden '+id+' generada con éxito',
                showConfirmButton: false,
                timer: 2000
            })

        })
        .catch((e) => {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Lo sentimos, no pudimos generar su orden',
                text: 'Disculpe las molestias.',
                showConfirmButton: false,
                timer: 2000
            })
            console.log(e)
        });*/

    };           
                   
    if(!created) {

        return(

            <div className="container-fluid m-3 d-flex justify-content-center">
                
                <div className="card d-flex justify-content-center">
                    <h5 className="card-title">Su compra</h5>        
                    <h6 className ="card-subtitle mb-2 text-muted">Total: ${totalPrice()}</h6>
                    
                    
                    <div className="shadow-lg bg-body rounded">
        
                        <form className="card-body row g-3 justify-content-center needs-validation" onSubmit={generateOrder} noValidate>
                            
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