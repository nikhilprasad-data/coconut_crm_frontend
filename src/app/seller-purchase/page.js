"use client";

import {useState,useEffect} from "react";

import {useRouter} from "next/navigation";

import styles from "./page.module.css";

export default function SellerPurchase() {
     const router = useRouter();

     const [isLoading,setIsLoading] = useState(true);

     const [sellerPurchase,setSellerPurchase] = useState([]);

     useEffect(() => {
          const token = localStorage.getItem("coconut_token");

          if (!token){
               alert("Session expired. Please login again.");
               router.push('/');
               return;
          }
          fetch("http://127.0.0.1:5000/api/purchase/my-purchase", {
               method         : "GET",
               mode           : "cors",
               credentials    : "omit",
               headers        : {
                    "Content-Type" : "application/json",
                    "Authorization": "Bearer " + token,
                    "Accept"       : "application/json"
               },
          })
          .then((response) => response.json())

          .then((data) => {
               if (data.status === "success"){
                    alert("Successfully fetched all your purchase details");
                    setSellerPurchase(data.data);
               } else {
                    alert("Error: " + data.message);
               }
               setIsLoading(false);
          })
          .catch((error) => {
               alert(error.message);
               setIsLoading(false);
          })
     }, []);

     return (
          <div className={styles.pageWrapper}>
               
               <div className={styles.headerSection}>
                    <div>
                         <h2 className={styles.pageTitle}>🛒 My Purchases</h2>
                         <p className={styles.pageSubtitle}>Track all your stock inward details</p>
                    </div>
                    <button onClick={() => router.push('/dashboard')} className={styles.backBtn}>
                         🔙 Back to Dashboard
                    </button>
               </div>
               <div className={styles.tableCard}>
                    
                    {isLoading ? (
                         <div className={styles.loadingState}>
                              <h3>Loading Purchase History... ⏳</h3>
                         </div>
                    ) : (
                         <div className={styles.tableResponsive}>
                              <table className={styles.dataTable}>
                                   <thead>
                                        <tr>
                                             <th>ID</th>
                                             <th>Date</th>
                                             <th>Total Bags</th>
                                             <th className={styles.wasteHeader}>Waste Pcs</th>
                                             <th>Rate/Pc (₹)</th>
                                             <th className={styles.amountHeader}>Total Amount (₹)</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {sellerPurchase.length > 0 ? (
                                             sellerPurchase.map((purchase, index) => (
                                                  <tr key={index}>
                                                       <td className={styles.idColumn}>#{purchase.purchase_id}</td>
                                                       <td>{purchase.purchase_date}</td>
                                                       <td className={styles.boldText}>{purchase.total_bags} Bags</td>
                                                       <td className={styles.wasteColumn}>{purchase.waste_pieces} Pcs</td>
                                                       <td>₹{purchase.rate_per_piece}</td>
                                                       <td className={styles.amountColumn}>₹{purchase.total_amount}</td>
                                                  </tr>
                                             ))
                                        ) : (
                                             <tr>
                                                  <td colSpan="6" className={styles.emptyState}>
                                                       No purchase history found yet. 🥥
                                                  </td>
                                             </tr>
                                        )}
                                   </tbody>
                              </table>
                         </div>
                    )}
               </div>
          </div>
     );

}