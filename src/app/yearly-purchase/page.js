"use client";

import {useRouter} from "next/navigation";

import {useState,useEffect} from "react";

import styles from "./page.module.css";

export default function YearlyReport() {
     const router = useRouter();

     const [role,setRole] = useState("");

     const [isLoading,setIsLoading] = useState(true);

     const [purchaseData,setPurchaseData] = useState([]);

     useEffect(() => {

     const storedRole = localStorage.getItem("role");
     const token = localStorage.getItem("coconut_token");

     if (!token || storedRole !== "admin"){
          alert("Access Denied. Please Login as admin");
          router.push('/');
          return;
     }
     setRole(storedRole);

     fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/yearly-purchase`, {
          method         : "GET",
          mode           : "cors",
          credentials    : "omit",
          headers        : {
               "Content-Type" : "application/json",
               "Authorization": "Bearer " + token,
               "Accept"       : "application/json"
          }
     })
     .then((response) => (response.json()))

     .then((data) => {
          if (data.status === "success"){
               alert("Successfully fetched Yearly Purchase.");
               setPurchaseData(data.report);
          } else{
               alert("Error: " + data.message);
          }
          setIsLoading(false);
     })
     .catch((error) => {
          alert(error.message);
          setIsLoading(false);
     })
     }, []);

     const handleLogoutButton = () => {
          const token = localStorage.getItem("coconut_token");

          if (!token){
               alert("Session expired. Please Login again.")
               router.push('/')
               return;
          }
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout/admin`, {
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
                    alert("Successfully Loged out");
                    localStorage.removeItem("coconut_token");
                    localStorage.removeItem("role");
                    router.push('/');
               } else{
                    alert("Error: " + data.message);
               }
          })
          .catch((error) => {
               alert(error.message);
          })
     }
     return (
          <div className={styles.pageWrapper}>
               
               <div className={styles.headerSection}>
                    <div>
                         <h2 className={styles.pageTitle}>📈 Yearly Purchase Report (2025)</h2>
                         <p className={styles.pageSubtitle}>Month-wise revenue breakdown per seller</p>
                    </div>
                    <div className={styles.headerBtnGroup}>
                         <button onClick={() => router.push('/manage-report')} className={styles.backBtn}>
                              🔙 Back to Analytics
                         </button>
                         <button onClick={handleLogoutButton} className={styles.logoutBtn}>
                              Logout 🚪
                         </button>
                    </div>
               </div>

               <div className={styles.tableCard}>
                    
                    {isLoading ? (
                         <div className={styles.loadingState}>
                              <h3>Loading Pivot Report... ⏳</h3>
                         </div>
                    ) : (
                         <div className={styles.tableResponsive}>
                              <table className={styles.dataTable}>
                                   <thead>
                                        <tr>
                                             <th>ID</th>
                                             <th>Seller Name</th> 
                                             <th className={styles.statusHeader}>Status</th>
                                             <th className={styles.monthHeader}>Jan</th>
                                             <th className={styles.monthHeader}>Feb</th>
                                             <th className={styles.monthHeader}>Mar</th>
                                             <th className={styles.monthHeader}>Apr</th>
                                             <th className={styles.monthHeader}>May</th>
                                             <th className={styles.monthHeader}>Jun</th>
                                             <th className={styles.monthHeader}>Jul</th>
                                             <th className={styles.monthHeader}>Aug</th>
                                             <th className={styles.monthHeader}>Sep</th>
                                             <th className={styles.monthHeader}>Oct</th>
                                             <th className={styles.monthHeader}>Nov</th>
                                             <th className={styles.monthHeader}>Dec</th>
                                             <th className={styles.totalHeader}>Yearly Total (₹)</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {purchaseData.length > 0 ? (
                                             purchaseData.map((row, index) => (
                                                  <tr key={index}>
                                                       <td className={styles.idColumn}>#{row.seller_id}</td>
                                                       <td className={styles.nameColumn}>{row.seller_name}</td> 
                                                       <td className={styles.activeColumn}>
                                                            {row.is_active ? (
                                                                 <span className={styles.badgeActive}>Active</span>
                                                                 ) : (
                                                                 <span className={styles.badgeInactive}>Inactive</span>
                                                                 )}
                                                       </td>
                                                       <td className={styles.monthColumn}>{row.jan_25}</td>
                                                       <td className={styles.monthColumn}>{row.feb_25}</td>
                                                       <td className={styles.monthColumn}>{row.mar_25}</td>
                                                       <td className={styles.monthColumn}>{row.apr_25}</td>
                                                       <td className={styles.monthColumn}>{row.may_25}</td>
                                                       <td className={styles.monthColumn}>{row.jun_25}</td>
                                                       <td className={styles.monthColumn}>{row.jul_25}</td>
                                                       <td className={styles.monthColumn}>{row.aug_25}</td>
                                                       <td className={styles.monthColumn}>{row.sep_25}</td>
                                                       <td className={styles.monthColumn}>{row.oct_25}</td>
                                                       <td className={styles.monthColumn}>{row.nov_25}</td>
                                                       <td className={styles.monthColumn}>{row.dec_25}</td>
                                                       
                                                       <td className={styles.totalColumn}>
                                                            ₹{row.yearly_total}
                                                       </td>
                                                  </tr>
                                             ))
                                        ) : (
                                             <tr>
                                                  <td colSpan="15" className={styles.emptyState}>
                                                       No yearly purchase data available.
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