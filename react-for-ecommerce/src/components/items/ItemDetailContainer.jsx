import React, {useState, useEffect, useContext} from "react";
import ItemDetail from "./ItemDetail";
import { useParams, Link } from "react-router-dom";
import { BookmarkFillIcon, BookmarkIcon } from "@primer/octicons-react";
import {MDBIcon} from "mdb-react-ui-kit"
import { UserContext } from "../users/UserContext";



function ItemDetailContainer() 
{
    const {serverEndpoint} = useContext(UserContext);
    const [product, setProduct] = useState([]);
    const {id} = useParams();
    
    useEffect( () => 
    {
        const getProduct = async () => {
            let result = await fetch(serverEndpoint+'/api/products/'+id,{credentials:"include"})
                .then( (response) => response.json());
            setProduct(result)
        }
        getProduct()
     
    },[]);
    
    return (
        <div id="product" className="container-fluid justify-content-center">
            <div className="row m-2 d-flex justify-content-center">
                <div className="col-md-4 justify-content-start">
                    <Link to={`/products`} className="btn-primary">
                        <MDBIcon className='ms-1' icon="arrow-circle-left" size='2x' />
                    </Link>
                </div>
            </div>
            <ItemDetail product={product}/>
        </div>
    );
}

export default ItemDetailContainer;