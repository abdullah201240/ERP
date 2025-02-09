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

const DesignPlanValidator = z.object({
  id: z.number().optional(), // Optional because it's auto-incremented
  projectId: z.number().min(1, "Project ID is required."),
  assignee: z.number().min(1, "Assignee is required."),
  stepName: z.string().min(1, "Step name is required."),
  stepType: z.string().min(1, "Step type is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
  remarks: z.string().optional(), // Optional field
});

const DesignPlanUpdateValidator = z.object({
  id: z.number().optional(), // Optional because it's auto-incremented
  assignee: z.number().optional(),
  stepName: z.string().min(1, "Step name is required."),
  stepType: z.string().min(1, "Step type is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
  remarks: z.string().optional(), // Optional field
});


export {DesignPlanUpdateValidator, ProjectSchema ,AssignedToSchema,DesignPlanValidator  };
