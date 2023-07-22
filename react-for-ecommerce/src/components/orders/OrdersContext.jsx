import React, {useContext, createContext} from "react";
import { UserContext } from "../users/UserContext";
import Swal from "sweetalert2";

export const OrdersContext = createContext();

function OrdersContextProvider({children}) {

    const {user,serverEndpoint} =  useContext(UserContext)
    const getOrders = async () => {
        
        let requestData = {
            method:"GET",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            credentials: 'include'
        }
        let url = serverEndpoint+'/api/tickets/'+user.username+'/orders'
        let request = new Request(url, requestData)
        const result = 
            await fetch(request)
            .then( async (response) => {
                if (!response.ok) {
                    const error = await response.json()
                    if(error){
                        Swal.fire({
                            title: error.message,
                            icon: 'error',
                            timer: 2000
                        })
                    }
                    else {
                        Swal.fire({
                            title: `Orden no encontrada`,
                            icon: 'error',
                            text: 'Ha ocurrido un error inesperado',
                            timer: 2000
                        })
                    }
                    return false
                }
                else {
                    try {
                        const tickets = await response.json()
                        return tickets.payload
                    }
                    catch(error) {
                        Swal.fire({
                            title: error.message?error.message:'Error desconocido',
                            icon:'error'
                        })
                    }
                }
            });
        return result
    }
    const purchaseOrder = async (order) => {
        console.log(order)
        let requestData = {
            method:"GET",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            credentials: 'include'
        }
        let request = new Request(serverEndpoint+'/api/tickets/'+order.id+'/resolve', requestData)
       
        fetch(request)
        .then( async (response) => {
            if (!response.ok) {
                const error = await response.json()
                if(error){
                    Swal.fire({
                        title: error.message,
                        icon: 'error',
                    })
                }
                else {
                    Swal.fire({
                        title: `No se pudo comprar el pedido`,
                        icon: 'error',
                        text: 'Ha ocurrido un error inesperado'
                    })
                }
            }
            else {
                Swal.fire({
                    icon: "success",
                    title: `Orden adquirida correctamente mediante el medio de pago ${order.paymentMethod}!`,
                    color: '#716add'
                }).then(()=>{window.location.reload();})
            }
        })

    }
    const deleteOrder = (order) => {
        
        Swal.fire({
            icon: "warning",
            title: 'Delete order',
            text: 'Esta acción eliminará la orden generada\n Desea continuar?',
            confirmButtonText: 'Delete',
            focusConfirm: false,
        }).then((result) => {
            if(result.isConfirmed){
                let requestData = {
                    method:"DELETE",
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    credentials: 'include'
                }
                const request = new Request(serverEndpoint+'/api/tickets/'+order.id, requestData)
                fetch(request)
                .then( async (response) => {
                    
                    if (!response.ok) {
                        const error = await response.json()
                        if(error.status === "WRONG") {
                            Swal.fire({
                                icon: "error",
                                title: `Error eliminando producto`,
                                text: error.message
                            })
                        }
                        else if(error.code === "Unauthorized"){
                            Swal.fire({
                                title: `No tienes permisos para eliminar`,
                                icon: "error"
                            })
                        }
                    } 
                    else {
                        Swal.fire({
                            icon: "success",
                            title: `Orden eliminada correctamente!`,
                            color: '#716add'
                        }).then(()=>{window.location.reload();})
                    }
                })
            }
        })
        
    }
    
    return(
        <OrdersContext.Provider 
            value={{
                getOrders,
                purchaseOrder,
                deleteOrder
            }}
            >
            {children}
        </OrdersContext.Provider>
    );
}

export default OrdersContextProvider;