import ClientHeader from "./clientPage/ClientHeader";
import HomeHeader from "../components/HomeHeader";
import React from "react";
import {useSelector} from "react-redux";
import HomeFooter from "../components/HomeFooter";
import CompletePaymentForm from "../components/CompletePaymentForm";

const PaymentPage = ()=>{
    const {id: userId} = useSelector(state=>state.user);
    const {items,total} = useSelector(state=>state.cart);
     return <>
         {userId ? <ClientHeader currentUser={userId}/> : <HomeHeader/>}
         <CompletePaymentForm
             selectedVariants={items}
             total={total}
             onSubmit={()=>{

             }}
         />
         <HomeFooter/>
     </>

}

export default PaymentPage;