"use client";

import {useState,useEffect} from "react";

import {useRouter} from "next/navigation";

import styles  from "./page.module.css";

export default function ManagePayment() {

     const router = useRouter();

     const [isLoading,setIsLoading]     = useState(true);

     const [searchId,setSearchId]       = useState("");
     const [allPayment,setAllPayment]   = useState([]);

     const [selectedPaymentId,setSelectedPaymentId]    = useState(null);
     const [showUpdateModal,setShowUpdateModal]        = useState(false);

     const [sellerId,setSellerId]            = useState("");
     const [paymentDate,setPaymentDate]      = useState("");
     const [amountPaid, setAmountPaid]       = useState("");
     const [paymentMethod,setPaymentMethod]  = useState("");

     const [actionType,setActionType]        = useState("");

     const [showAddModal,setShowAddModal]  = useState(false);

     const openAddModal = () =>{
          setSellerId("");
          setPaymentDate("");
          setAmountPaid("");
          setPaymentMethod("");
          setActionType("");
          setShowAddModal(true);
     }

     const handleAddButton = () => {
          const token = localStorage.getItem("coconut_token");

          if (!token){
               alert("Session expired. Please login again.");
               router.push('/');
               return;
          }
          if (sellerId === "" || paymentDate === "" || amountPaid === "" || paymentMethod === ""){
               alert("Please fill all the details to add a payment.");
               return;
          }
          fetch("http://127.0.0.1:5000/api/payment/add", {
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
                    "payment_date"      : paymentDate,
                    "amount_paid"       : amountPaid,
                    "payment_method"    : paymentMethod
               })
          })
          .then((response) => response.json())

          .then((data) => {
               if (data.status === "success"){
                    alert("Successfully added Payment");
                    setShowAddModal(false);
                    handleClearSearch();
               } else{
                    alert("Error: " + data.message);
               }
          })
          .catch((error) =>{
               alert(error.message);
          });
     }
 
     useEffect(() => {
         const token = localStorage.getItem("coconut_token");
         
         if (!token){
          alert("Session expired. Please login again");
          router.push('/');
          return;
         }
         fetch("http://127.0.0.1:5000/api/payment/all", {
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
               alert("Successfully fetched all Payment records");
               setAllPayment(data.data);
          } else{
               alert("Error: " + data.message);
          }
          setIsLoading(false)
         })
         
         .catch((error) => {
          alert(error.message);
          setIsLoading(false);
         });
     }, []);

     const handleSearchButton = () => {
          const token = localStorage.getItem("coconut_token");
          if (!token){
               alert("Session expired. Please login again.");
               router.push('/');
               return;
          }
          if (searchId === ""){
               alert("Please enter Seller Id");
               return;
          }
          if (searchId === "" || Number(searchId) <= 0){
               alert("Please enter a valid positive Seller ID");
               return; 
          }
          fetch("http://127.0.0.1:5000/api/payment/data/" + searchId, {
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
               alert("Successfully fetched all Payment records by Seller Id");
               setAllPayment(data.payment);
          } else{
               alert("Error: " + data.message);
               setAllPayment([])
          }
          setIsLoading(false)
         })
         
         .catch((error) => {
          alert(error.message);
          setIsLoading(false);
         })
     }

     const handleClearSearch = () =>{
          setSearchId("")
          setIsLoading(true);

         const token = localStorage.getItem("coconut_token");
         
         if (!token){
          alert("Session expired. Please login again");
          router.push('/');
          return;
         }
         fetch("http://127.0.0.1:5000/api/payment/all", {
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
               setAllPayment(data.data);
          } else{
               alert("Error: " + data.message);
          }
          setIsLoading(false)
         })
         
         .catch((error) => {
          alert(error.message);
          setIsLoading(false);
         });
     };

     const openModal = (payment, type) => {
          setSelectedPaymentId(payment.payment_id);

          setSellerId(payment.seller_id);
          setPaymentDate(payment.payment_date);
          setAmountPaid(payment.amount_paid);
          setPaymentMethod(payment.payment_method);

          setActionType(type);

          setShowUpdateModal(true);
     };

     const  handleSubmitButton = () => {
          const token = localStorage.getItem("coconut_token");

          if (!token){
               alert("Session expired. Please Login again.");
               router.push('/');
               return;
          }
          const apiUrl = actionType === "UPDATE"  ? "http://127.0.0.1:5000/api/payment/update/" + selectedPaymentId
                                                  : "http://127.0.0.1:5000/api/payment/replace/" + selectedPaymentId ;
          
          const method = actionType === "UPDATE"  ? "PATCH"
                                                  : "PUT" ;

          fetch(apiUrl, {
               method         : method,
               mode           : "cors",
               credentials    : "omit",
               headers        : {
                    "Content-Type" : "application/json",
                    "Authorization": "Bearer " + token,
                    "Accept"       : "application/json"
               },
               body                : JSON.stringify({
                    "seller_id"         : sellerId,
                    "payment_date"      : paymentDate,
                    "amount_paid"       : amountPaid,
                    "payment_method"    : paymentMethod 
               })
          })
          .then((response) => response.json())

          .then((data) => {
               if (data.status === "success"){
                    alert(`Successfully  ${actionType === "UPDATE" ? "updated" : "replaced"} Payment ID #${selectedPaymentId}`);
                    setShowUpdateModal(false);
                    handleClearSearch();
               } else{
                    alert("Error: "+ data.message)
               }
          })
          .catch((error) => {
               alert(error.message)
          })
     }

     return (
          <div className={styles.pageWrapper}>
               
               <div className={styles.headerSection}>
                    <div>
                         <h2 className={styles.pageTitle}>👑 Admin: All Payments</h2>
                         <p className={styles.pageSubtitle}>System-wide payment records</p>
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
                              value={searchId || ""} 
                              onChange={(e) => setSearchId(e.target.value)} 
                              placeholder="e.g. 5" 
                              className={styles.searchInput}
                         />
                    </div>
                    
                    <button onClick={handleSearchButton} className={styles.searchBtn}>
                         Search 🚀
                    </button>
                    
                    <button onClick={handleClearSearch} className={styles.clearBtn}>
                         Clear ❌
                    </button>

                    <button onClick={openAddModal} className={styles.addBtn}>
                         ➕ Add Payment
                    </button>
               </div>

               <div className={styles.tableCard}>
                    
                    {isLoading ? (
                         <div className={styles.loadingState}>
                              <h3>Loading All Payments... ⏳</h3>
                         </div>
                    ) : (
                         <div className={styles.tableResponsive}>
                              <table className={styles.dataTable}>
                                   <thead>
                                        <tr>
                                             <th>Payment ID</th>
                                             <th>Seller ID</th> 
                                             <th>Date</th>
                                             <th>Amount (₹)</th>
                                             <th>Payment Mode</th>
                                             <th className={styles.textCenter}>⚙️ Actions</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {allPayment.length > 0 ? (
                                             allPayment.map((payment, index) => (
                                                  <tr key={index}>
                                                       <td className={styles.idColumn}>#{payment.payment_id}</td>
                                                       <td className={styles.sellerIdColumn}>Seller #{payment.seller_id}</td> 
                                                       <td>{payment.payment_date}</td>
                                                       <td className={styles.amountColumn}>₹{payment.amount_paid}</td>
                                                       <td className={styles.methodColumn}>{payment.payment_method}</td>
                                                       
                                                       <td className={styles.textCenter}>
                                                            <div className={styles.actionBtnGroup}>
                                                                 <button onClick={() => openModal(payment, "UPDATE")} className={styles.updateBtn}>
                                                                      Update
                                                                 </button>
                                                                 <button onClick={() => openModal(payment, "REPLACE")} className={styles.replaceBtn}>
                                                                      Replace
                                                                 </button>
                                                            </div>
                                                       </td>
                                                  </tr>
                                             ))
                                        ) : (
                                             <tr>
                                                  <td colSpan="6" className={styles.emptyState}>
                                                       No payment records found.
                                                  </td>
                                             </tr>
                                        )}
                                   </tbody>
                              </table>
                         </div>
                    )}
               </div>

               {showAddModal && (
                    <div className={styles.modalOverlay}>
                         <div className={styles.modalCard}>
                              
                              <h3 className={styles.modalTitle}>
                                   ➕ Add New Payment
                              </h3>
                              
                              <div className={styles.modalGrid}>
                                   <div className={styles.inputGroup}>
                                        <label className={styles.label}>Seller ID:</label>
                                        <input type="number" value={sellerId} onChange={(e) => setSellerId(e.target.value)} placeholder="e.g. 5" className={styles.inputField} />
                                   </div>
                                   <div className={styles.inputGroup}>
                                        <label className={styles.label}>Payment Date:</label>
                                        <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className={styles.inputField} />
                                   </div>
                                   <div className={styles.inputGroup}>
                                        <label className={styles.label}>Amount Paid (₹):</label>
                                        <input type="number" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} placeholder="e.g. 5000" className={styles.inputField} />
                                   </div>
                                   <div className={styles.inputGroup}>
                                        <label className={styles.label}>Payment Method:</label>
                                        <select suppressHydrationWarning value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={styles.inputField}>
                                             <option value="">Select Method</option>
                                             <option value="Cash">Cash</option>
                                             <option value="Upi">UPI</option>
                                             <option value="Cheque">Cheque</option>
                                             <option value="Bank Transfer">Bank Transfer</option>
                                             <option value="Credit Card">Credit Card</option>
                                        </select>
                                   </div>
                              </div>
                              
                              <div className={styles.modalActions}>
                                   <button onClick={() => setShowAddModal(false)} className={styles.cancelBtn}>
                                        Cancel
                                   </button>
                                   <button onClick={handleAddButton} className={styles.submitBtn}>
                                        Add Payment ✔️
                                   </button>
                              </div>
                         </div>
                    </div>
               )}

               {showUpdateModal && (
                    <div className={styles.modalOverlay}>
                         <div className={styles.modalCard}>
                              
                              <h3 className={styles.modalTitle}>
                                   {actionType === "UPDATE" ? "✏️ Update Payment" : "🔄 Replace Payment"} #{selectedPaymentId}
                              </h3>
                              
                              <div className={styles.modalGrid}>
                                   <div className={styles.inputGroup}>
                                        <label className={styles.label}>Seller ID:</label>
                                        <input type="number" value={sellerId} onChange={(e) => setSellerId(e.target.value)} className={styles.inputField} />
                                   </div>
                                   <div className={styles.inputGroup}>
                                        <label className={styles.label}>Payment Date:</label>
                                        <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className={styles.inputField} />
                                   </div>
                                   <div className={styles.inputGroup}>
                                        <label className={styles.label}>Amount Paid (₹):</label>
                                        <input type="number" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} className={styles.inputField} />
                                   </div>
                                   <div className={styles.inputGroup}>
                                        <label className={styles.label}>Payment Method:</label>
                                        <select suppressHydrationWarning value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={styles.inputField}>
                                             <option value="">Select Method</option>
                                             <option value="Cash">Cash</option>
                                             <option value="Upi">UPI</option>
                                             <option value="Cheque">Cheque</option>
                                             <option value="Bank Transfer">Bank Transfer</option>
                                             <option value="Credit Card">Credit Card</option>
                                        </select>
                                   </div>
                              </div>
                              
                              <div className={styles.modalActions}>
                                   <button onClick={() => setShowUpdateModal(false)} className={styles.cancelBtn}>
                                        Cancel
                                   </button>
                                   <button 
                                        onClick={handleSubmitButton} 
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