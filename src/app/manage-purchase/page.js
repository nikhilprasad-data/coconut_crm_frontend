"use client";

import {useRouter} from "next/navigation";

import {useState,useEffect} from "react";

import styles from "./page.module.css";

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
               alert("Access Denied. Please login as admin");
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
                    alert("Successfully fetched all Purchase records");
                    setPurchaseData(data.data);
               } else{
                    alert("Error: " + data.message);
               }
               setIsLoading(false);
          })
          .catch((error) => {
               alert(error.message);
               setIsLoading(false);
          });
     }, []);

     const handleSearchButton = (selectedSellerId) => {
          const storedRole    = localStorage.getItem("role");
          const token         = localStorage.getItem("coconut_token");

          if (!token || storedRole !== "admin"){
               alert("Access Denied. Please login as admin");
               router.push('/');
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
                    alert(`Successfully fetched all Purchase records of Seller Id ${selectedSellerId}`);
                    setPurchaseData(data.purchase_data);
               } else{
                    alert("Error: " + data.message);
               }
               setIsLoading(false);
          })
          .catch((error) => {
               alert(error.message);
               setIsLoading(false);
          });
     };

     const handleClearSearchButton = () => {
          const token = localStorage.getItem("coconut_token")
          setSelectedSellerId("");
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
                    alert("Error: " + data.message);
               }
               setIsLoading(false);
          })
          .catch((error) => {
               alert(error.message);
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
               alert("Access Denied. Please login as admin");
               router.push('/');
               return;
          }
          if (sellerId ==="" || purchaseDate=== "" || totalBags === "" || wastePieces === "" || ratePerPiece === "" || totalAmount === ""){
               alert("All fields are required for add Purchase.");
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
                    alert("Purchase Added Successfullly");
                    setOpenAddModal(false);
                    handleClearSearchButton();
               } else{
                    alert("Error: " + data.message);
               }
          })
          .catch((error) => {
               alert(error.message);
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
               alert("Acces Denied. Please login as admin");
               router.push('/');
               return;
          }
          const apiUrl = actionType === "UPDATE" ? `${process.env.NEXT_PUBLIC_API_URL}/api/purchase/update/${selectedPurchaseId}`
                                       : `${process.env.NEXT_PUBLIC_API_URL}/api/purchase/replace/${selectedPurchaseId}`;

          const method = actionType === "UPDATE"  ? "PATCH"
                                                  : "PUT" ;
          
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
                    alert(`Successfully ${actionType === "UPDATE" ? "updated" : "replaced"} Purchase id ${selectedPurchaseId}`);
                    setOpenActionModal(false)
                    handleClearSearchButton();
               } else{
                    alert("Error: " + data.message);
               }
          })
          .catch((error) => {
               alert(error.message);
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
                    <button onClick={() => router.push('/dashboard')} className={styles.backBtn}>
                         🔙 Back to Dashboard
                    </button>
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
                         <div className={styles.loadingState}>
                              <h3>Loading All Purchases... ⏳</h3>
                         </div>
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