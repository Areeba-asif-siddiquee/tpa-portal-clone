import React from 'react'

const AdminDashboard = () => (
  <div style={{border: "2px solid #2e58cc", borderRadius: "5px"}}>
    <header style={{background: "#4661e3", color: "#fff", padding: "20px 0", textAlign: "center", fontSize:"1.6rem", fontWeight: "bold"}}>
      <span style={{float:"left",marginLeft:"16px"}}>LOGO</span>
      EMPLOYEE TRAINING PORTAL
    </header>
    <div style={{display:"flex"}}>
      <nav style={{width: "250px", borderRight: "1px solid #444", padding:"32px 0", background:"#fff"}}>
        <div style={{padding:"10px 32px",fontWeight:"bold",fontSize:"1.2rem"}}>Departments &gt;</div>
        <div style={{padding:"10px 32px",fontWeight:"bold",fontSize:"1.2rem"}}>Training &gt;</div>
        <div style={{padding:"10px 32px",fontWeight:"bold",fontSize:"1.2rem"}}>Certifications</div>
        <button style={{marginTop: "45px",width: "70%",marginLeft:"10%",padding:"10px",background:"linear-gradient(90deg, #fdc7e9, #fffcb9)",borderRadius:"20px",border:"1px solid #ccc",fontWeight:"bold"}}>Create New +</button>
      </nav>
      <main style={{flex:1,padding:"16px"}}>
        {/* KPIs */}
        <div style={{display:"flex",gap:"16px",marginBottom:"20px"}}>
          <div style={{border:"2px solid #222",padding:"16px",borderRadius:"50%",width:"130px",height:"130px",display:"flex",alignItems:"center",justifyContent:"center"}}>Total Courses</div>
          <div style={{border:"3px solid #ffd400",background:"linear-gradient(90deg, #fdc7e9, #fffcb9)",padding:"16px",borderRadius:"50%",width:"130px",height:"130px",display:"flex",alignItems:"center",justifyContent:"center"}}>Active Courses</div>
          <div style={{border:"2px solid #222",padding:"16px",borderRadius:"50%",width:"130px",height:"130px",display:"flex",alignItems:"center",justifyContent:"center"}}>Total Enrolled Members</div>
          <div style={{border:"2px solid #222",padding:"16px",borderRadius:"50%",width:"130px",height:"130px",display:"flex",alignItems:"center",justifyContent:"center"}}>Total Requests</div>
          <div style={{marginLeft:"auto"}}>
            {/* Budget Infographic Bar Graph */}
            <div>Budget Infographic</div>
            <div style={{width:"250px",height:"120px",background:"#eee",borderRadius:"8px",marginTop:"8px"}}></div>
          </div>
        </div>
        {/* Table and Pie Chart */}
        <div style={{display:"flex",gap:"32px"}}>
          <div style={{flex:2}}>
            <div>
              <div style={{display:"flex",gap:"0"}}>
                <div style={{background:"#b76ae6",color:"#fff",textAlign:"center",flex:1,padding:"8px"}}>TITLE</div>
                <div style={{background:"#fd7ca3",color:"#fff",textAlign:"center",flex:1,padding:"8px"}}>TITLE</div>
                <div style={{background:"#16b0fa",color:"#fff",textAlign:"center",flex:1,padding:"8px"}}>TITLE</div>
              </div>
              {[1,2,3,4,5].map(i=>(
                <div style={{display:"flex"}} key={i}>
                  <div style={{flex:1,textAlign:"center",padding:"8px",border:"1px solid #eee"}}>DATA 1</div>
                  <div style={{flex:1,textAlign:"center",padding:"8px",border:"1px solid #eee"}}>100</div>
                  <div style={{flex:1,textAlign:"center",padding:"8px",border:"1px solid #eee"}}>100</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{flex:1}}>
            {/* Donut chart placeholder */}
            <div style={{marginLeft:"40px"}}>
              <svg width={180} height={180}>
                <circle r={70} cx={90} cy={90} fill="#fff"/>
                <path d="M90,90 m-70,0 a70,70 0 1,0 140,0 a70,70 0 1,0 -140,0" fill="none" stroke="#b76ae6" strokeWidth="22"/>
                <path d="M90,90 m0,-70 a70,70 0 0,1 70,70" fill="none" stroke="#2ecc71" strokeWidth="22"/>
                <path d="M90,90 m-70,0 a70,70 0 0,1 70,-70" fill="none" stroke="#f7b731" strokeWidth="22"/>
                {/* Add more as desired */}
              </svg>
            </div>
            <div style={{marginTop:"8px"}}>
              <div><span style={{color:"#b76ae6"}}>■</span> Chrome</div>
              <div><span style={{color:"#2ecc71"}}>■</span> IE</div>
              <div><span style={{color:"#f7b731"}}>■</span> Firefox</div>
              <div><span style={{color:"#fc5c65"}}>■</span> Safari</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
)
export default AdminDashboard


// import React from 'react'

// const AdminDashboard = () => {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-secondary-900">Admin Dashboard</h1>
//         <p className="mt-1 text-sm text-secondary-600">
//           System administration and management console
//         </p>
//       </div>
      
//       <div className="bg-white shadow rounded-lg p-6">
//         <div className="text-center py-12">
//           <h3 className="mt-2 text-sm font-medium text-secondary-900">Admin Dashboard</h3>
//           <p className="mt-1 text-sm text-secondary-500">
//             System statistics, user management, and administrative controls
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AdminDashboard

