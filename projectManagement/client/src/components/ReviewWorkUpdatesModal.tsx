import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductionWorkUpdate {
  id: number;
  date: string;
  workUpdate: string;
}

interface ReviewWorkUpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  workPlanId: number;
  productionWorkUpdates: ProductionWorkUpdate[]; // Pass productionWorkUpdates as a prop
}

export default function ReviewWorkUpdatesModal({
  isOpen,
  onClose,
  productionWorkUpdates,
}: ReviewWorkUpdatesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Work Updates</h2>
        <Table>
          <TableHeader className="bg-[#2A515B]">
            <TableRow>
              <TableHead className="text-white text-center">Date</TableHead>
              <TableHead className="text-white text-center">Work Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productionWorkUpdates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                  No work updates found
                </TableCell>
              </TableRow>
            ) : (
              productionWorkUpdates.map((update) => (
                <TableRow key={update.id} className="text-center">
                  <TableCell className="border border-[#e5e7eb]">{update.date}</TableCell>
                  <TableCell className="border border-[#e5e7eb]">{update.workUpdate}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}