import { z } from 'zod';

// Define Zod schema for Project attributes
const preSiteVisitPlanSchema = z.object({
 projectName: z.string().min(1, 'Project Name is required'),
 projectId: z.number().min(1, 'Total Area is required'),
  projectAddress: z.string().min(1, 'Project Address is required'),
  clientName: z.string().min(1, 'client Name is required'),
  clientContact: z.string().min(1, 'client Number  is required'),
  visitDateTime: z.string().min(1, 'visit Date Time is required'),
});
export { preSiteVisitPlanSchema   };
