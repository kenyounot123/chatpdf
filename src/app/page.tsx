import ClientFileUploader from '@/components/ClientFileUploader';
export default function Homepage() {
  return (
    <>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-primary">
          Upload PDF
        </h1>
        {/* Render the client-side file uploader */}
        <ClientFileUploader />
      </div>
    </>
  );
}
