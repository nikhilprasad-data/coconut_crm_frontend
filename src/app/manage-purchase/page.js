"use client";

import {useState,useEffect} from "react";
import {useRouter} from "next/navigation";
import SpinnerLoader from "@/components/SpinnerLoader";
import styles  from "./page.module.css";
import toast from 'react-hot-toast';

export default function ManagePurchase() {

     const router                            = useRouter();
     const [isLoading,setIsLoading]          = useState(true);
     const [role,setRole]                    = useState("");
     const [purchaseData,setPurchaseData]    = useState([]);

     const [selectedSellerId,setSelectedSellerId]      = useState(null);
     const [selectedPurchaseId,setSelectedPurchaseID]  = useState(null);

     const [sellerId,setSellerId]            = useState("");
     const [purchaseDate,setPurchaseDate]    = useState("");
     const [totalBags,setTotalBags]          = useState("");
     const [wastePieces,setWastePieces]      = useState("");
     const [ratePerPiece,setRatePerPiece]    = useState("");
     const [totalAmount,setTotalAmount]      = useState("");
     const [actionType,setActionType]        = useState("");

     const [openAddModal,setOpenAddModal]         = useState(false);
     const [openActionModal,setOpenActionModal]   = useState(false);

     useEffect(() => {
          const storedRole    = localStorage.getItem("role");
          const token         = localStorage.getItem("coconut_token");

          if (!token || storedRole !== "admin"){
               toast.error("Access Denied. Please log in as admin.");
               router.push('/');
               return;
          }
          setRole(storedRole);

          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchase/all`, {
               method         : "GET",
               mode           : "cors",
               credentials    : "omit",
               headers        : {
                    "Content-Type" : "application/json",
                    "Authorization": "Bearer "+ token,
                    "Accept"       : "application/json"
               }
          })
          .then((response) => response.json())
          .then((data) => {
               if (data.status === "success"){
                    toast.success("Purchase records loaded successfully. 📦");
                    setPurchaseData(data.data);
               } else{
                    toast.error(data.message || "Failed to load records.");
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

          if (!token){
               toast.error("Session expired. Please log in again.");
               router.push('/');
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

     const handleSearchButton = (selectedSellerId) => {
          const storedRole    = localStorage.getItem("role");
          const token         = localStorage.getItem("coconut_token");

          if (!token || storedRole !== "admin"){
               toast.error("Access Denied. Please log in as admin.");
               router.push('/');
               return;
          }
          if(!selectedSellerId){
               toast.error("Please enter a Seller ID to search.");
               return;
          }
          setRole(storedRole);

          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchase/data/${selectedSellerId}`, {
               method         : "GET",
               mode           : "cors",
               credentials    : "omit",
               headers        : {
                    "Content-Type" : "application/json",
                    "Authorization": "Bearer "+ token,
                    "Accept"       : "application/json"
               }
          })
          .then((response) => response.json())
          .then((data) => {
               if (data.status === "success"){
                    toast.success(`Purchase records for Seller #${selectedSellerId} filtered successfully. 🔍`);
                    setPurchaseData(data.purchase_data);
               } else{
                    toast.error(data.message || "No records found.");
               }
               setIsLoading(false);
          })
          .catch((error) => {
               toast.error("Network error. Please try again.");
               setIsLoading(false);
          });
     };

     const handleClearSearchButton = () => {
          const token = localStorage.getItem("coconut_token")
          setSelectedSellerId("");
          
          if (!token){
               toast.error("Session expired. Please log in again.");
               router.push('/');
               return;
          }

          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchase/all`, {
               method         : "GET",
               mode           : "cors",
               credentials    : "omit",
               headers        : {
                    "Content-Type" : "application/json",
                    "Authorization": "Bearer "+ token,
                    "Accept"       : "application/json"
               }
          })
          .then((response) => response.json())
          .then((data) => {
               if (data.status === "success"){
                    setPurchaseData(data.data);
               } else{
                    toast.error(data.message || "Failed to reload records.");
               }
               setIsLoading(false);
          })
          .catch((error) => {
               toast.error("Network error. Please try again.");
               setIsLoading(false);
          });
     };

     const handleAddButton = () => {
          setActionType("");
          setSellerId("");
          setPurchaseDate("");
          setTotalBags("");
          setWastePieces("");
          setRatePerPiece("");
          setTotalAmount("");

          setOpenAddModal(true);
     };

     const handleAddSubmit = () => {
          const token         = localStorage.getItem("coconut_token");
          const storedRole    = localStorage.getItem("role")

          if(!token || storedRole !== "admin"){
               toast.error("Access Denied. Please log in as admin.");
               router.push('/');
               return;
          }
          if (sellerId ==="" || purchaseDate=== "" || totalBags === "" || wastePieces === "" || ratePerPiece === ""){
               toast.error("All fields are required to add a purchase.");
               return;
          }
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchase/add`, {
               method         : "POST",
               mode           : "cors",
               credentials    : "omit",
               headers        : {
                    "Content-Type" : "application/json",
                    "Authorization": "Bearer " + token,
                    "Accept"       : "application/json"
               },
               body           : JSON.stringify({
                    "seller_id"         : sellerId,
                    "purchase_date"     : purchaseDate,
                    "total_bags"        : totalBags,
                    "waste_pieces"      : wastePieces,
                    "rate_per_piece"    : ratePerPiece
               })
          })
          .then((response) => response.json())
          .then((data) => {
               if (data.status === "success"){
                    toast.success("Purchase added successfully! 🛒");
                    setOpenAddModal(false);
                    handleClearSearchButton();
               } else{
                    toast.error(data.message || "Failed to add purchase.");
               }
          })
          .catch((error) => {
               toast.error("Network error. Please try again.");
               setOpenAddModal(false);
          });
     };

     const handleActionButton = (purchase,action) => {

          setSelectedPurchaseID(purchase.purchase_id);
          setActionType(action);

          setSellerId(purchase.seller_id);
          setPurchaseDate(purchase.purchase_date);
          setTotalBags(purchase.total_bags);
          setWastePieces(purchase.waste_pieces);
          setRatePerPiece(purchase.rate_per_piece);
          setTotalAmount(purchase.total_amount);

          setOpenActionModal(true);
     };

     const handleActionSubmitButton = () => {
          const token         = localStorage.getItem("coconut_token");
          const storedRole    = localStorage.getItem("role");

          if (!token || storedRole !== "admin"){
               toast.error("Access Denied. Please log in as admin.");
               router.push('/');
               return;
          }
          const apiUrl = actionType === "UPDATE" ? `${process.env.NEXT_PUBLIC_API_URL}/api/purchase/update/${selectedPurchaseId}`
                                       : `${process.env.NEXT_PUBLIC_API_URL}/api/purchase/replace/${selectedPurchaseId}`;

          const method = actionType === "UPDATE"  ? "PATCH" : "PUT" ;
          
          fetch(apiUrl, {
               method              : method,
               mode                : "cors",
               credentials         : "omit",
               headers             : {
                    "Content-Type" : "application/json",
                    "Authorization": "Bearer " + token,
                    "Accept"       : "application/json"
               },
               body                : JSON.stringify({
                    "seller_id"         : sellerId,
                    "purchase_date"     : purchaseDate,
                    "total_bags"        : totalBags,
                    "waste_pieces"      : wastePieces,
                    "rate_per_piece"    : ratePerPiece,
                    "total_amount"      : totalAmount
               })
          })
          .then((response) => response.json())
          .then((data) => {
               if (data.status === "success"){
                    toast.success(`Purchase #${selectedPurchaseId} ${actionType === "UPDATE" ? "updated" : "replaced"} successfully. ✅`);
                    setOpenActionModal(false)
                    handleClearSearchButton();
               } else{
                    toast.error(data.message || "Operation failed.");
               }
          })
          .catch((error) => {
               toast.error("Network error. Please try again.");
               setOpenActionModal(false);
          });
     }

     return (
          <div className={styles.pageWrapper}>
              
               <div className={styles.headerSection}>
                    <div>
                         <h2 className={styles.pageTitle}>🛒 Admin: All Purchases</h2>
                         <p className={styles.pageSubtitle}>Manage system-wide inventory intake</p>
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

               <div className={styles.toolbar}>
                    <div className={styles.searchGroup}>
                         <label className={styles.searchLabel}>🔍 Filter by Seller ID:</label>
                         <input 
                              type="number" 
                              value={selectedSellerId || ""} 
                              onChange={(e) => setSelectedSellerId(e.target.value)} 
                              placeholder="e.g. 5" 
                              className={styles.searchInput}
                         />
                    </div>
                    
                    <button onClick={() => handleSearchButton(selectedSellerId)} className={styles.searchBtn}>
                         Search 🚀
                    </button>
                    
                    <button onClick={handleClearSearchButton} className={styles.clearBtn}>
                         Clear ❌
                    </button>

                    <button onClick={handleAddButton} className={styles.addBtn}>
                         ➕ Add Purchase
                    </button>
               </div>

               <div className={styles.tableCard}>
                    
                    {isLoading ? (
                         <SpinnerLoader text="Loading All Purchases... ⏳" />
                    ) : (
                         <div className={styles.tableResponsive}>
                              <table className={styles.dataTable}>
                                   <thead>
                                        <tr>
                                             <th>Purchase ID</th>
                                             <th>Seller ID</th> 
                                             <th>Date</th>
                                             <th>Total Bags</th>
                                             <th>Waste Pcs</th>
                                             <th>Rate/Pc (₹)</th>
                                             <th>Net Amount (₹)</th>
                                             <th className={styles.textCenter}>⚙️ Actions</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {purchaseData.length > 0 ? (
                                             purchaseData.map((purchase, index) => (
                                                  <tr key={index}>
                                                       <td className={styles.idColumn}>#{purchase.purchase_id}</td>
                                                       <td className={styles.sellerIdColumn}>Seller #{purchase.seller_id}</td> 
                                                       <td>{purchase.purchase_date}</td>
                                                       <td>{purchase.total_bags}</td>
                                                       <td className={styles.wasteColumn}>{purchase.waste_pieces}</td>
                                                       <td>₹{purchase.rate_per_piece}</td>
                                                       <td className={styles.amountColumn}>₹{purchase.total_amount}</td>
                                                       
                                                       <td className={styles.textCenter}>
                                                            <div className={styles.actionBtnGroup}>
                                                                 <button onClick={() => handleActionButton(purchase, "UPDATE")} className={styles.updateBtn}>
                                                                      Update
                                                                 </button>
                                                                 <button onClick={() => handleActionButton(purchase, "REPLACE")} className={styles.replaceBtn}>
                                                                      Replace
                                                                 </button>
                                                            </div>
                                                       </td>
                                                  </tr>
                                             ))
                                        ) : (
                                             <tr>
                                                  <td colSpan="8" className={styles.emptyState}>
                                                       No purchase records found.
                                                  </td>
                                             </tr>
                                        )}
                                   </tbody>
                              </table>
                         </div>
                    )}
               </div>

               {openAddModal && (
                    <div className={styles.modalOverlay}>
                         <div className={styles.modalCard}>
                              <h3 className={styles.modalTitle}>➕ Add New Purchase</h3>
                              
                              <div className={styles.modalGrid}>
                                   <div className={styles.inputGroup}>
                                        <label className={styles.label}>Seller ID:</label>
                                        <input type="number" value={sellerId} onChange={(e) => setSellerId(e.target.value)} className={styles.inputField} />
                                   </div>
                                   <div className={styles.inputGroup}>
                                        <label className={styles.label}>Date:</label>
                                        <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className={styles.inputField} />
                                   </div>
                                   
                                   <div className={styles.inputRow}>
                                        <div className={styles.inputGroup}>
                                             <label className={styles.label}>Total Bags:</label>
                                             <input type="number" value={totalBags} onChange={(e) => setTotalBags(e.target.value)} className={styles.inputField} />
                                        </div>
                                        <div className={styles.inputGroup}>
                                             <label className={styles.label}>Waste Pcs:</label>
                                             <input type="number" value={wastePieces} onChange={(e) => setWastePieces(e.target.value)} className={styles.inputField} />
                                        </div>
                                   </div>
                                   
                                   <div className={styles.inputGroup}>
                                        <label className={styles.label}>Rate per Piece (₹):</label>
                                        <input type="number" step="0.01" value={ratePerPiece} onChange={(e) => setRatePerPiece(e.target.value)} className={styles.inputField} />
                                   </div>
                              </div>
                              
                              <div className={styles.modalActions}>
                                   <button onClick={() => setOpenAddModal(false)} className={styles.cancelBtn}>Cancel</button>
                                   <button onClick={handleAddSubmit} className={styles.submitBtn}>Add Purchase ✔️</button>
                              </div>
                         </div>
                    </div>
               )}

               {openActionModal && (
                    <div className={styles.modalOverlay}>
                         <div className={styles.modalCard}>
                              <h3 className={styles.modalTitle}>
                                   {actionType === "UPDATE" ? "✏️ Update Purchase" : "🔄 Replace Purchase"} #{selectedPurchaseId}
                              </h3>
                              
                              <div className={styles.modalGridScrollable}>
                                   <div className={styles.inputGroup}>
                                        <label className={styles.label}>Seller ID:</label>
                                        <input type="number" value={sellerId} onChange={(e) => setSellerId(e.target.value)} className={styles.inputField} />
                                   </div>
                                   <div className={styles.inputGroup}>
                                        <label className={styles.label}>Date:</label>
                                        <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className={styles.inputField} />
                                   </div>
                                   
                                   <div className={styles.inputRow}>
                                        <div className={styles.inputGroup}>
                                             <label className={styles.label}>Total Bags:</label>
                                             <input type="number" value={totalBags} onChange={(e) => setTotalBags(e.target.value)} className={styles.inputField} />
                                        </div>
                                        <div className={styles.inputGroup}>
                                             <label className={styles.label}>Waste Pcs:</label>
                                             <input type="number" value={wastePieces} onChange={(e) => setWastePieces(e.target.value)} className={styles.inputField} />
                                        </div>
                                   </div>
                                   
                                   <div className={styles.inputGroup}>
                                        <label className={styles.label}>Rate per Piece (₹):</label>
                                        <input type="number" step="0.01" value={ratePerPiece} onChange={(e) => setRatePerPiece(e.target.value)} className={styles.inputField} />
                                   </div>
                                   <div className={styles.inputGroup}>
                                        <label className={styles.label}>Net Amount (₹):</label>
                                        <input type="number" step="0.01" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} className={styles.inputField} />
                                   </div>
                              </div>
                              
                              <div className={styles.modalActions}>
                                   <button onClick={() => setOpenActionModal(false)} className={styles.cancelBtn}>Cancel</button>
                                   <button 
                                        onClick={handleActionSubmitButton} 
                                        className={actionType === "UPDATE" ? styles.submitBtnUpdate : styles.submitBtnReplace}
                                   >
                                        {actionType === "UPDATE" ? "Save Changes ✔️" : "Replace Data 🔄"}
                                   </button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}