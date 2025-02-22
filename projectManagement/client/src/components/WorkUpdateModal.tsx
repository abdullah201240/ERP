
import { useState } from 'react';

interface WorkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportingDate: string, workUpdate: string) => void;
}

export default function WorkUpdateModal({ isOpen, onClose, onSubmit }: WorkUpdateModalProps) {
  const [reportingDate, setReportingDate] = useState('');
  const [workUpdate, setWorkUpdate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reportingDate, workUpdate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Work Update</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Reporting Date</label>
            <input
              type="date"
              value={reportingDate}
              onChange={(e) => setReportingDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Work Update</label>
            <textarea
              value={workUpdate}
              onChange={(e) => setWorkUpdate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}