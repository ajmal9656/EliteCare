
import DoctorsWithSpecialization from '../../components/userComponents/DoctorsWithSpecialization';
import { useParams } from 'react-router-dom';

function DoctorsWithSpecializationPage() {
  const { id } = useParams();
  
  return (
    <>
      
      <DoctorsWithSpecialization specializationId={id} /> 
      
    </>
  );
}

export default DoctorsWithSpecializationPage;

