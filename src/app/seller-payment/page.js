"use client";

import {useState,useEffect} from "react";

import {useRouter} from "next/navigation";

import styles from "./page.module.css";

export default function SellerPayment() {
     const router = useRouter();

     const [sellerPayment,setSellerPayment]  = useState([]);

     const [isLoading,setIsLoading] = useState(true);

     useEffect(() =>{
          const token = localStorage.getItem("coconut_token");

          if (!token){
               alert("Session expired. Please login again.");
               router.push('/')
               return;
          }

          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/my-payment`, {
               method         : "GET",
               mode           : "cors",
               credentials    : "omit",
               headers        : {
                    "Content-Type" : "application/json",
                    "Authorization": "Bearer " + token,
                    "Accept"       : "application/json"
               }
          })
          .then((response) => response.json())

          .then((data) => {
               if (data.status === "success"){
                    alert("Successfully fetched your all payment details");
                    setSellerPayment(data.data);
               } else{
                    alert("Error: " + data.message);
               }
               setIsLoading(false);
          })
          .catch((error) => {
               alert(error.message);
          });
     },[])

     return (
          <div className={styles.pageWrapper}>
               <div className={styles.contentContainer}>

                    <div className={styles.headerSection}>
                         <div>
                              <h2 className={styles.pageTitle}>💳 My Payments</h2>
                              <p className={styles.pageSubtitle}>Track all your received payments</p>
                         </div>
                         <button onClick={() => router.push('/dashboard')} className={styles.backBtn}>
                              🔙 Back to Dashboard
                         </button>
                    </div>

                    <div className={styles.tableCard}>
                         
                         {isLoading ? (
                              <div className={styles.loadingState}>
                                   <h3>Loading Payment History... ⏳</h3>
                              </div>
                         ) : (
                              <div className={styles.tableResponsive}>
                                   <table className={styles.dataTable}>
                                        <thead>
                                             <tr>
                                                  <th>Payment ID</th>
                                                  <th>Date</th>
                                                  <th className={styles.amountHeader}>Amount (₹)</th>
                                                  <th>Payment Mode</th>
                                                  <th className={styles.textCenter}>Status</th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {sellerPayment.length > 0 ? (
                                                  sellerPayment.map((payment, index) => (
                                                       <tr key={index}>
                                                            <td className={styles.idColumn}>#{payment.payment_id}</td>
                                                            <td>{payment.payment_date}</td>                 
                                                           
                                                            <td className={styles.amountColumn}>₹{payment.amount_paid}</td>                   

                                                            <td className={styles.methodColumn}>{payment.payment_method}</td>
                                                            
                                                            <td className={styles.textCenter}>
                                                                 <span className={styles.statusBadgeCompleted}>
                                                                      Completed
                                                                 </span>
                                                            </td>
                                                       </tr>
                                                  ))
                                             ) : (
                                                  <tr>
                                                       <td colSpan="5" className={styles.emptyState}>
                                                            No payment history found yet. 💸
                                                       </td>
                                                  </tr>
                                             )}
                                        </tbody>
                                   </table>
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
}