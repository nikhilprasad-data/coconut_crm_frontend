"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import SpinnerLoader from "@/components/SpinnerLoader";
import styles from "./page.module.css";
import toast from 'react-hot-toast';

export default function ManageSellers() {

     const router = useRouter();

     const [sellers,setSellers] = useState([]);
     const [isLoading,setIsLoading] = useState(true);

     useEffect(() => {

          const token = localStorage.getItem("coconut_token");

          if (!token){
               toast.error("Session expired. Please log in again.");
               router.push('/');
               return;
          }
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/data`,
               {
                    method         : "GET",
                    mode           : "cors",
                    credentials    : "omit",
                    headers        : {
                         "Content-Type" : "application/json",
                         "Accept"       : "application/json",
                         "Authorization": "Bearer " + token
                    },
               })
               .then((response) => response.json())
               .then((data) => {
                    if (data.status == "success"){
                         toast.success("Seller details loaded successfully. 👥");
                         setSellers(data.data);
                    } else{
                         toast.error(data.message || "Failed to load seller data.");
                    }
                    setIsLoading(false);
               })
               .catch((error) => {
                    toast.error("Network error. Please try again.");
                    setIsLoading(false);
               });
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

     const addSellerButton = () => router.push('/add-seller');

     const deleteSellerButton = (seller_id) =>{

          const token = localStorage.getItem("coconut_token");

          if (!token){
               toast.error("Session expired. Please log in again.");
               router.push('/');
               return;
          }

          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/delete/${seller_id}`, {
                    method         : "DELETE",
                    mode           : "cors",
                    credentials    : "omit",
                    headers        : {
                         "Content-Type"      : "application/json",
                         "Authorization"     : "Bearer " + token,
                         "Accept"            : "application/json"
                    }
               }
          )
          .then((response) => response.json())
          .then((data) => {
               if (data.status == "success"){
                    toast.success("Seller deleted successfully. 🗑️");
                    setSellers(sellers.filter(seller => seller.seller_id !== seller_id))
               } else{
                    toast.error(data.message || "Failed to delete seller.");
               }
          })
          .catch((error)=>{
               toast.error("Network error. Please try again.");
          });
     }

     return (
          <div className={styles.pageWrapper}>
               
               <div className={styles.headerSection}>
                    <div>
                         <h2 className={styles.pageTitle}>📦 Manage Sellers</h2>
                         <p className={styles.pageSubtitle}>View and manage your active sellers</p>
                    </div>
                    <div className={styles.headerButtons}>
                         <button onClick={() => router.push('/dashboard')} className={styles.backBtn}>
                              🔙 Back to Dashboard
                         </button>
                         <button onClick={addSellerButton} className={styles.addBtn}>
                              ➕ Add New Seller
                         </button>
                         <button onClick={handleLogoutButton} className={styles.logoutBtn}>
                              Logout 🚪
                         </button>
                    </div>
               </div>


               <div className={styles.tableCard}>
                    
                    {isLoading ? (
                         <SpinnerLoader text="Loading Sellers Data... ⏳" />
                    ) : (
                         <div className={styles.tableResponsive}>
                              <table className={styles.dataTable}>
                                   <thead>
                                        <tr>
                                             <th>ID</th>
                                             <th>Seller Name</th>
                                             <th>Contact Number</th>
                                             <th>City</th>
                                             <th>State</th>
                                             <th className={styles.textCenter}>Action</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                      
                                        {sellers.length > 0 ? (
                                             sellers.map((seller) => (
                                                  <tr key={seller.seller_id}>
                                                       <td className={styles.idColumn}>#{seller.seller_id}</td>
                                                       <td className={styles.nameColumn}>{seller.seller_name}</td>
                                                       <td>{seller.contact_number}</td>
                                                       <td>{seller.city}</td>
                                                       <td>{seller.state}</td>
                                                       <td className={styles.textCenter}>
                                                            <button 
                                                                 onClick={() => {
                                                                      if(window.confirm(`Are you sure you want to delete ${seller.seller_name}?`)) {
                                                                           deleteSellerButton(seller.seller_id);
                                                                      }
                                                                 }} 
                                                                 className={styles.deleteBtn}
                                                            >
                                                                 🗑️ Delete
                                                            </button>
                                                       </td>
                                                  </tr>
                                             ))
                                        ) : (
                                             <tr>
                                                  <td colSpan="6" className={styles.emptyState}>
                                                       No active sellers found.
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