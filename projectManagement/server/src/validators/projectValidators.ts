import { z } from 'zod';

// Define Zod schema for Project attributes
const ProjectSchema = z.object({
  projectType: z.string().min(1, 'Project Type is required'),
  projectName: z.string().min(1, 'Project Name is required'),
  totalArea: z.string().min(1, 'Total Area is required'),
  projectAddress: z.string().min(1, 'Project Address is required'),
  clientName: z.string().min(1, 'Client Name is required'),
  clientAddress: z.string().min(1, 'Client Address is required'),
  clientContact: z.string().min(1, 'Client Contact is required'),
  clientEmail: z.string().email('Invalid email format'),
  creatorName: z.string().min(1, 'Creator Name is required'),
  creatorEmail: z.string().email('Invalid email format'),
  requirementDetails: z.string().min(1, 'Requirement Details are required'),
});

const AssignedToSchema = z.object({
  eid: z.number().min(1, 'eid Type is required'),
  pid: z.string().min(1, 'pid Name is required'),
  eName: z.string().min(1, 'eName Area is required'),
});

export { ProjectSchema ,AssignedToSchema  };
