
import DoctorsWithSpecialization from '../../components/userComponents/DoctorsWithSpecialization';
import Footer from '../../components/common/userCommon/Footer';
import Navbar from '../../components/common/userCommon/Navbar';
import { useParams } from 'react-router-dom';

function DoctorsWithSpecializationPage() {
  const { id } = useParams();
  
  return (
    <>
      <Navbar />
      <DoctorsWithSpecialization specializationId={id} /> 
      <Footer />
    </>
  );
}

export default DoctorsWithSpecializationPage;

