import ItemCount from "./ItemCount";
import Error from "../errors_&_timeout/Error";
import React, { useState, useContext } from "react";
import Swal from 'sweetalert2';
import { CartContext } from "../carts/CartContext";
import { ItemsContext } from "./ItemsContext";
import { Link } from "react-router-dom";
import { MDBCardBody, MDBCardText,MDBCardTitle,MDBCardImage, MDBCard, MDBIcon } from "mdb-react-ui-kit";


const ItemDetail = ({product}) => 
{
    const {addItem} = useContext(CartContext);
    const {editProduct, deleteProduct} = useContext(ItemsContext)
    const [sold, setSold] = useState(false);
    const onAdd = async (quantity, stock) => {
        if((stock > 0) && (quantity <= stock)) {
            const result = await addItem(product, quantity);
            setSold(result);
        }
        else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Lo sentimos! No contamos con más stock para este item!',
                showConfirmButton: false,
                timer: 2000
            })
        }
    }
    const onEdit = async () => {
        await editProduct(product._id)
    }
    const onDelete = async () => {
        await deleteProduct(product._id)
    }
    if(product !== null) {
        if(!Array.isArray(product)) {
            return(
                <div className="row justify-content-center">
                   <div className="product col-md-4 ">
                        
                        <MDBCard>
                            <MDBIcon></MDBIcon>
                            <MDBCardImage src={product.thumbnail} position='top' alt={product.name} />
                            <MDBCardBody>
                                <MDBCardTitle>{product.title}</MDBCardTitle>
                                <MDBCardText>
                                    {"Precio: $ " + product.price}
                                </MDBCardText>
                                <MDBCardText>
                                    {"Descripción: " + product.description}
                                </MDBCardText>
                                <MDBCardText>
                                    {"Stock: " + product.stock}
                                </MDBCardText>
                                {!sold ? 
                                    <ItemCount stock={product.stock} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete}/>
                                    :
                                    <Link className="btn btn-outline-primary" to={"/cart"}>Terminar Compra</Link>
                                }
                            </MDBCardBody>
                        </MDBCard>
                           
                    </div>
                </div>
            );
        }
        return(
            <Error status={"wait"} quantity={1}/>
        );
    }
    else {
        return(
            <Error status={"empty"} quantity={1}/>
        )
    }
    
}
export default ItemDetail;