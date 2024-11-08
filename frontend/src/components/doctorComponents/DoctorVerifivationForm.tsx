import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DetailsUpload from '../../components/doctorComponents/DetailsUpload';
import axiosUrl from '../../utils/axios';
import { Specializations } from '../../interfaces/doctorinterface';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Validation schema for the form
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  gender: Yup.string().required('Select your gender'),
  dob: Yup.date()
    .required('Date of Birth is required')
    .test('age', 'You must be at least 18 years old', function (value) {
      if (!value) return false; // handle empty date input
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const isBirthdayPassedThisYear =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
      return isBirthdayPassedThisYear ? age >= 18 : age - 1 >= 18;
    }),
  department: Yup.string().required('Department is required'),
  fees: Yup.number().required('Fees are required').positive('Fees must be positive'),
  aadhaarNumber: Yup.string()
    .matches(/^\d{12}$/, 'Aadhaar Number must be exactly 12 digits')
    .required('Aadhaar Number is required'),
  image: Yup.mixed().required('Image is required'),
  aadhaarFrontImage: Yup.mixed().required('Aadhaar Front Image is required'),
  aadhaarBackImage: Yup.mixed().required('Aadhaar Back Image is required'),
  certificateImage: Yup.mixed().required('Certificate Image is required'),
  qualificationImage: Yup.mixed().required('Qualification Image is required'),
});


function DoctorVerifivationForm() {
  const navigate = useNavigate()
  const [specializations, setSpecializations] = React.useState<Specializations[]>([]);
  const [imagePreviews, setImagePreviews] = React.useState({
    image: null,
    aadhaarFrontImage: null,
    aadhaarBackImage: null,
    certificateImage: null,
    qualificationImage: null,
  });
  

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
    
  
    if (file) {
      
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews((prev) => ({
        ...prev,
        [fieldName]: previewUrl,
      }));
      
    }
  };

  
  

  React.useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axiosUrl.get('/admin/getSpecializations');
        setSpecializations(response.data.response);
      } catch (error) {
        console.error('Failed to fetch specializations:', error);
      }
    };
    
    fetchSpecializations();
  }, []);
  
  const formik = useFormik({
    initialValues: {
      name: '',
      gender: '',
      dob: '',
      department: '',
      fees: '',
      aadhaarNumber: '',
      image: null,
      aadhaarFrontImage: null,
      aadhaarBackImage: null,
      certificateImage: null,
      qualificationImage: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const docData:string | null = localStorage.getItem('doctorInfo');
      if(!docData){
        throw new Error("Email not found..!Login again")
      }
      const parseData = JSON.parse(docData)
      
      
      const email = parseData.email;
      
      
      const formData = new FormData();

      formData.append('email', email);
      formData.append('name', values.name);
      formData.append('gender', values.gender);
      formData.append('dob', values.dob);
      formData.append('department', values.department);
      formData.append('fees', values.fees);
      formData.append('aadhaarNumber', values.aadhaarNumber);
  
      if (values.image) {
        formData.append('image', values.image);
      }
      if (values.aadhaarFrontImage) {
        formData.append('aadhaarFrontImage', values.aadhaarFrontImage);
      }
      if (values.aadhaarBackImage) {
        formData.append('aadhaarBackImage', values.aadhaarBackImage);
      }
      if (values.certificateImage) {
        formData.append('certificateImage', values.certificateImage);
      }
      if (values.qualificationImage) {
        formData.append('qualificationImage', values.qualificationImage);
      }
  
      try {
        
        const response = await axiosUrl.post('/doctor/uploadDoctorData', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Form submitted successfully', response.data);
        navigate("/doctor/verificationProcessing")
        
      } catch (error:any) {
        console.error('Failed to submit the form', error);
        if(error.message==="Email not found..!Login again"){
          toast.error("Email not found..!Login again")
        }
      }
    },
  });
  

  return (
    <div className="flex flex-col md:flex-row">
  <main className="flex-1 p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Welcome... Please submit your details</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={`mt-1 block w-full px-4 py-2 border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
            />
            {formik.touched.name && formik.errors.name ? (
              <p className="text-red-500 text-sm">{formik.errors.name}</p>
            ) : null}
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
            <select
              name="gender"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.gender}
              className={`mt-1 block w-full px-4 py-2 border ${formik.touched.gender && formik.errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {formik.touched.gender && formik.errors.gender ? (
              <p className="text-red-500 text-sm">{formik.errors.gender}</p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
            <input
              type="date"
              name="dob"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.dob}
              className={`mt-1 block w-full px-4 py-2 border ${formik.touched.dob && formik.errors.dob ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
            />
            {formik.touched.dob && formik.errors.dob ? (
              <p className="text-red-500 text-sm">{formik.errors.dob}</p>
            ) : null}
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Department
            </label>
            <select
              name="department"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.department}
              className={`mt-1 block w-full px-4 py-2 border ${formik.touched.department && formik.errors.department ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
            >
              <option value="">Select Department</option>
              {specializations
                .filter((specialization) => specialization.isListed)
                .map((specialization) => (
                  <option key={specialization._id} value={specialization._id}>
                    {specialization.name}
                  </option>
                ))}
            </select>
            {formik.touched.department && formik.errors.department ? (
              <p className="text-red-500 text-sm">{formik.errors.department}</p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fees</label>
            <input
              type="number"
              name="fees"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fees}
              className={`mt-1 block w-full px-4 py-2 border ${formik.touched.fees && formik.errors.fees ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
            />
            {formik.touched.fees && formik.errors.fees ? (
              <p className="text-red-500 text-sm">{formik.errors.fees}</p>
            ) : null}
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aadhaar Number</label>
            <input
              type="text"
              name="aadhaarNumber"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.aadhaarNumber}
              className={`mt-1 block w-full px-4 py-2 border ${formik.touched.aadhaarNumber && formik.errors.aadhaarNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
            />
            {formik.touched.aadhaarNumber && formik.errors.aadhaarNumber ? (
              <p className="text-red-500 text-sm">{formik.errors.aadhaarNumber}</p>
            ) : null}
          </div>
        </div>

        {/* File upload sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <DetailsUpload
            id="fileInput"
            label="Image"
            name="image"
            onChange={(event) => {
              const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
              formik.setFieldValue('image', file);
              handleImageChange(event, 'image');
            }}
            onBlur={formik.handleBlur as unknown as () => void} 
            error={formik.touched.image && formik.errors.image ? formik.errors.image : undefined}
            previewUrl={imagePreviews['image']}
          />
          <DetailsUpload
            id="aadhaarFrontInput"
            label="Aadhaar Front Image"
            name="aadhaarFrontImage"
            onChange={(event) => {
              const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
              formik.setFieldValue('aadhaarFrontImage', file);
              handleImageChange(event, 'aadhaarFrontImage');
            }}
            onBlur={formik.handleBlur as unknown as () => void} 
            error={formik.touched.aadhaarFrontImage && formik.errors.aadhaarFrontImage ? formik.errors.aadhaarFrontImage : undefined}
            previewUrl={imagePreviews['aadhaarFrontImage']}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <DetailsUpload
            id="aadhaarBackInput"
            label="Aadhaar Back Image"
            name="aadhaarBackImage"
            onChange={(event) => {
              const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
              formik.setFieldValue('aadhaarBackImage', file);
              handleImageChange(event, 'aadhaarBackImage');
            }}
            onBlur={formik.handleBlur as unknown as () => void} 
            error={formik.touched.aadhaarBackImage && formik.errors.aadhaarBackImage ? formik.errors.aadhaarBackImage : undefined}
            previewUrl={imagePreviews['aadhaarBackImage']}
          />
          <DetailsUpload
            id="certificateInput"
            label="Certificate Image"
            name="certificateImage"
            onChange={(event) => {
              const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
              formik.setFieldValue('certificateImage', file);
              handleImageChange(event, 'certificateImage');
            }}
            onBlur={formik.handleBlur as unknown as () => void} 
            error={formik.touched.certificateImage && formik.errors.certificateImage ? formik.errors.certificateImage : undefined}
            previewUrl={imagePreviews['certificateImage']}
          />
        </div>
        <div className="grid grid-cols-1 mb-6">
          <DetailsUpload
            id="qualificationInput"
            label="Qualification Image"
            name="qualificationImage"
            onChange={(event) => {
              const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
              formik.setFieldValue('qualificationImage', file);
              handleImageChange(event, 'qualificationImage');
            }}
            onBlur={formik.handleBlur as unknown as () => void} 
            error={formik.touched.qualificationImage && formik.errors.qualificationImage ? formik.errors.qualificationImage : undefined}
            previewUrl={imagePreviews['qualificationImage']}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Submit
        </button>
      </form>
    </div>
  </main>
</div>

  );
}

export default DoctorVerifivationForm;
