import React, {useState, useContext, useEffect} from "react";
import { Link } from "react-router-dom";
import Order from "./Order";
import Error from "../errors_&_timeout/Error";
import { OrdersContext } from "./OrdersContext";
import { UserContext } from "../users/UserContext";
//import { UserContext } from "../users/UserContext";

function Orders () {
    //const {user} = useContext(UserContext)
    const {getOrders} = useContext(OrdersContext)
    const {user} =  useContext(UserContext)
    const [orders, setOrders] = useState([])
    useEffect(()=>{
        if(user){
            if(user.username){
                getOrders().then( async (ordersData) => { 
                    setOrders(ordersData);
                })
            }
        }
    },[user,setOrders])
    
    const [search, setSearch] = useState("")
    
    return(
        <>
        {
            (orders && orders.length >= 0)?
            <div className="row justify-content-center">
                <form className="d-flex" role="search" >
                    <input className="form-control me-2" type="search" placeholder="Buscar" onChange={
                        e => setSearch(e.target.value)
                    } name="search" aria-label="Buscar"/>
                    <Link to={"/orders/"+search} className="btn btn-outline-success" type="submit">Buscar</Link>
                </form>
                {
                    orders.length > 0?
                        orders.map(order =>
                        {
                            return(
                                <div key = {order.id} className={orders.length >= 3?"product col-sm-4 col-md-3":"product col"}>
                                    <Order order={order}></Order>
                                </div>
                            );
                        })
                        :
                        <div id="products" className="container-fluid justify-content-center">
                            <Error status={"wait"} quantity={2}/>
                        </div>
                }
            </div>
            :
            <div id="products" className="container-fluid justify-content-center">
            <Error status={"empty"} quantity={2}/>
        </div>
        }
        </>
    );

}
export default Orders;