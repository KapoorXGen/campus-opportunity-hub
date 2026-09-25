import { z } from "zod";

export const opportunitySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description is too short"),
  organization: z.string().min(2, "Organization is required"),

  type: z.enum([
    "internship",
    "job",
    "hackathon",
    "scholarship",
    "competition",
    "workshop",
    "conference",
    "other",
  ]),

  location: z.string().optional(),

  workMode: z.enum(["remote", "hybrid", "onsite"]),

  eligibility: z.string().optional(),

  skills: z.array(z.string()).default([]),

  stipend: z.string().optional(),

  salary: z.string().optional(),

  applicationUrl: z.string().url("Invalid application URL"),

  deadline: z.coerce.date().optional(),

  startDate: z.coerce.date().optional(),

  status: z
    .enum(["draft", "published", "expired", "archived"])
    .default("draft"),
});