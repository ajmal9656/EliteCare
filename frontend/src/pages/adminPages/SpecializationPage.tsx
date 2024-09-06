import Sidebar from "../../components/common/adminCommon/Sidebar";
import Specialization from "../../components/adminComponents/Specialization";

function SpecializationPage() {
  return (
    <>
      <Sidebar />
      <main className="ml-4 p-4"> 
        <Specialization/>
        
      </main>
    </>
  );
}

export default SpecializationPage;
