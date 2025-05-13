import * as z from "zod";

/* SETTINGS FORM */
export const settingsFormSchema = z.object({
	name: z
		.string({ required_error: "Name is required." })
		.min(2, "Name must be at least 2 characters"),
	email: z
		.string({ required_error: "Email is required." })
		.email("Invalid email address or format."),
	phoneNumber: z
		.string()
		.trim()
		.min(10, "Phone number must be at least 10 digits.")
		.regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format."),
});

export type TSettingsFormData = z.infer<typeof settingsFormSchema>;
