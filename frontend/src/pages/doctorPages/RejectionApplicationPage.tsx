import React from 'react';
import RejectedApplication from '../../components/doctorComponents/rejectedApplication';

interface RejectionApplicationPageProps {
  reason: string;
}

const RejectionApplicationPage: React.FC<RejectionApplicationPageProps> = ({reason}) => {
  
  

  return (
    <RejectedApplication reason={reason} />
  );
}

export default RejectionApplicationPage;

