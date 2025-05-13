"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsFormProps } from "@/types/app/component-props";
import { settingsFormSchema, TSettingsFormData } from "@/lib/schemas";
import { capitalize } from "@/lib/utils";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CustomFormField } from "@/components/shared/form/CustomFormField";

function SettingsForm({
	initialData,
	onSubmit,
	userRole,
	isLoading,
}: SettingsFormProps) {
	const [editMode, setEditMode] = useState(false);
	const form = useForm<TSettingsFormData>({
		resolver: zodResolver(settingsFormSchema),
		defaultValues: initialData,
	});

	const toggleEditMode = () => {
		setEditMode(!editMode);
		if (editMode) {
			form.reset(initialData);
		}
	};

	const handleSubmit = async (data: TSettingsFormData) => {
		await onSubmit(data);
		setEditMode(false);
	};

	return (
		<div className="pt-8 pb-5 px-8">
			<div className="mb-5">
				<h1 className="text-xl font-semibold">
					{capitalize(userRole)} Settings
				</h1>

				<p className="text-sm text-gray-500 mt-1">
					Manage your account preferences and personal information
				</p>
			</div>

			<div className="bg-white rounded-xl p-6">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					>
						<CustomFormField
							name="name"
							label="Name"
							placeholder="Enter your name"
							disabled={!editMode}
						/>
						<CustomFormField
							name="email"
							label="Email"
							type="email"
							placeholder="Enter your email"
							disabled={!editMode}
						/>
						<CustomFormField
							name="phoneNumber"
							label="Phone Number"
							placeholder="(123) 123-1234"
							disabled={!editMode}
						/>

						<div className="pt-4 flex justify-between">
							<Button
								type="button"
								onClick={toggleEditMode}
								disabled={isLoading}
								className="bg-secondary-500 text-gray-50 hover:bg-secondary-500/90"
							>
								{editMode ? "Cancel" : "Edit"}
							</Button>

							{editMode && (
								<Button
									type="submit"
									disabled={isLoading}
									className="bg-gray-700 text-gray-50 hover:bg-gray-700/90"
								>
									Save Changes
								</Button>
							)}
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
export default SettingsForm;
