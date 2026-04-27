"use client";

import {useState, useEffect} from "react";

import {useRouter} from "next/navigation";

import styles from "./page.module.css";

export default function ManageSellers() {

     const router = useRouter();

     const [sellers,setSellers] = useState([]);

     const [isLoading,setIsLoading] = useState(true);

     useEffect(() => {

          const token = localStorage.getItem("coconut_token");

          if (!token){
               router.push('/');
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
                         alert("Successfully fetched all seller's details");
                         setSellers(data.data);
                    } else{
                         alert("Error " + data.message);
                    }
                    setIsLoading(false);
               })
               .catch((error) => {
                    alert(error.message);
               });
     }, []);

     const addSellerButton = () => router.push('/add-seller');

     const deleteSellerButton = (seller_id) =>{

          const token = localStorage.getItem("coconut_token");

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
                    alert("Seller deleted successfully");
                    setSellers(sellers.filter(sellers=> sellers.seller_id !== seller_id))
               } else{
                    alert(data.message);
               }
          })
          .catch((error)=>{
               alert(error.message)
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
                    </div>
               </div>


               <div className={styles.tableCard}>
                    
                    {isLoading ? (
                         <div className={styles.loadingState}>
                              <h3>Loading Sellers Data... ⏳</h3>
                         </div>
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