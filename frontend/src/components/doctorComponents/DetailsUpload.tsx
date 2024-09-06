import { FileUploadSectionProps } from "../../interfaces/doctorinterface";

function DetailsUpload({
  id,
  label,
  name,
  onChange,
  onBlur,
  error,
  previewUrl
}: FileUploadSectionProps) {

  console.log('Preview URL:', previewUrl);

  return (
    <div className="flex justify-center items-center mb-6">
      <div className="max-w-xs w-full mx-auto p-4 bg-white dark:bg-gray-800 rounded-md shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-4 dark:text-white">{label}</h2>
        <div className={`relative border-2 border-dashed ${error ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 rounded-md px-4 py-6 text-center`}>
          <input
            type="file"
            id={id}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            className="hidden"
          />
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 17l-4 4m0 0l-4-4m4 4V3" />
          </svg>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Drag & Drop your files here or{' '}
            <label htmlFor={id} className="cursor-pointer text-blue-500 hover:underline">
              browse
            </label>{' '}
            to upload.
          </p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {previewUrl && (
        <div className="mt-4">
          <img src={previewUrl} alt="Preview" className="max-h-40 rounded-md shadow-sm" />
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

export default DetailsUpload;
