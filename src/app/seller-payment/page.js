"use client";

import {useState,useEffect} from "react";
import {useRouter} from "next/navigation";
import SpinnerLoader from "@/components/SpinnerLoader";
import styles from "./page.module.css";
import toast from 'react-hot-toast';

export default function SellerPayment() {
     const router = useRouter();

     const [sellerPayment,setSellerPayment]  = useState([]);

     const [isLoading,setIsLoading] = useState(true);

     useEffect(() =>{
          const token = localStorage.getItem("coconut_token");

          if (!token){
               toast.error("Session expired. Please log in again.");
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
                    toast.success("Payment history loaded successfully. 💳");
                    setSellerPayment(data.data);
               } else{
                    toast.error(data.message || "Failed to fetch payment details.");
               }
               setIsLoading(false);
          })
          .catch((error) => {
               toast.error("Network error. Please try again.");
               setIsLoading(false);
          });
     },[router])

     const handleLogoutButton = () => {
          const token = localStorage.getItem("coconut_token");
          const role = localStorage.getItem("role");

          if (!token){
               toast.error("Session expired. Please log in again.");
               router.push('/');
               return;
          }
          
          const apiUrl = role === 'admin' 
               ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout/admin`
               : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout/seller`;

          fetch(apiUrl, {
               method         : "POST",
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
                    toast.success("Successfully logged out. 👋");
                    localStorage.removeItem("coconut_token");
                    localStorage.removeItem("role");
                    router.push('/');
               } else{
                    toast.error(data.message || "Logout failed.");
               }
          })
          .catch((error) => {
               toast.error("Network error. Please try again.");
          })
     }

     return (
          <div className={styles.pageWrapper}>
               <div className={styles.contentContainer}>

                    <div className={styles.headerSection}>
                         <div>
                              <h2 className={styles.pageTitle}>💳 My Payments</h2>
                              <p className={styles.pageSubtitle}>Track all your received payments</p>
                         </div>
                         <div className={styles.headerBtnGroup}>
                              <button onClick={() => router.push('/dashboard')} className={styles.backBtn}>
                                   🔙 Back to Dashboard
                              </button>
                              <button onClick={handleLogoutButton} className={styles.logoutBtn}>
                                   Logout 🚪
                              </button>
                         </div>
                    </div>

                    <div className={styles.tableCard}>
                         
                         {isLoading ? (
                              <SpinnerLoader text="Loading Payment History... ⏳" />
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