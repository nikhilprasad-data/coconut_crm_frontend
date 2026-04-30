"use client";

import {useState,useEffect} from "react";
import {useRouter} from "next/navigation";
import SpinnerLoader from "@/components/SpinnerLoader";
import styles from "./page.module.css";
import toast from 'react-hot-toast';

export default function SellerPurchase() {
     const router = useRouter();

     const [isLoading,setIsLoading] = useState(true);

     const [sellerPurchase,setSellerPurchase] = useState([]);

     useEffect(() => {
          const token = localStorage.getItem("coconut_token");

          if (!token){
               toast.error("Session expired. Please log in again.");
               router.push('/');
               return;
          }
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchase/my-purchase`, {
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
                    toast.success("Purchase history loaded successfully. 📦");
                    setSellerPurchase(data.data);
               } else {
                    toast.error(data.message || "Failed to load purchase details.");
               }
               setIsLoading(false);
          })
          .catch((error) => {
               toast.error("Network error. Please try again.");
               setIsLoading(false);
          })
     }, [router]);

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
               
               <div className={styles.headerSection}>
                    <div>
                         <h2 className={styles.pageTitle}>🛒 My Purchases</h2>
                         <p className={styles.pageSubtitle}>Track all your stock inward details</p>
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
                         <SpinnerLoader text="Loading Purchase History... ⏳" />
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