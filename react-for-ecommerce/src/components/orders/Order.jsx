import React, { useContext } from "react";
import Error from "../errors_&_timeout/Error";
import {MDBBtn} from "mdb-react-ui-kit"
import { OrdersContext } from "./OrdersContext";


const Order = ({order}) => 
{
    const {deleteOrder, purchaseOrder} = useContext(OrdersContext)

    const handleDelete = () => {
        console.log(order)
        deleteOrder(order)
    }
    const handlePurchase = async () => {
        purchaseOrder(order)
    }
    let count = 0;
    if(order !== null && order !== undefined){
        if(typeof order === 'object' && !Array.isArray(order)){
            return (
                
                <div  key = {order._id} className={"card justify-content-center"} width= "18rem" >
                    
                    <div className="card-body">
                        <h5 className="card-title">{"Orden n° "+order.id} 
                            <span className={`m-2 badge ${order.status?'bg-success':'bg-warning'}`}>{order.status?'Comprada':'Pendiente'}</span>
                        </h5>
                        <p className="card-subtitle mb-2">Fecha de creación: {order.purchase_datetime}</p>
                        <div className="card-text">
                            <h6><b>Detalle del pedido</b></h6>
                            <ul>
                                {
                                    order.products.map((item) => {
                                        count++
                                        return(
                                            <li>
                                                <p className={"col-sm "+count} id="accordionExample">{item.product.title+' ===> '+item.quantity} x ${item.product.price}</p>      
                                            </li>
                                        )  
                                    })
                                } 
                            </ul>
                        </div>
                        <p className="card-text">{"Total: $" + order.amount}</p>
                        {
                            !order.status?
                            <>
                            <MDBBtn rounded onClick={handlePurchase}>Comprar pedido</MDBBtn>
                            <MDBBtn rounded color='danger' onClick={handleDelete}>Cancelar</MDBBtn>
                            </>
                            :
                            <>
                            <MDBBtn rounded color='danger' onClick={handleDelete}>Eliminar</MDBBtn>
                            </>
                        }
                    </div>
                </div>
            );
        }
        else if(order === undefined){
            return(
                <Error status={"wait"} quantity={2}/>
            )  
        }
    }
    
    else
    {
        return(
            <Error status={"empty"} quantity={2}/>
        );
    }
    
}
export default Order;
