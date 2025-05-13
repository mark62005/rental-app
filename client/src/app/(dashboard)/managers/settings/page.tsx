"use client";

import SettingsForm from "@/components/settings/SettingsForm";
import { TSettingsFormData } from "@/lib/schemas";
import { useGetAuthUserQuery } from "@/state/apis/authApi";
import { useUpdateManagerSettingsMutation } from "@/state/apis/managersApi";

function ManagersSettingsPage() {
	const { data: authUser, isLoading, isError } = useGetAuthUserQuery();
	const [updateManager, { isLoading: isUpdateLoading }] =
		useUpdateManagerSettingsMutation();

	if (isLoading) return <>Loading...</>;
	if (!authUser || isError)
		return <div className="text-destructive">Error fetching user profile.</div>;

	const initialData: TSettingsFormData = {
		name: authUser.userInfo.name,
		email: authUser.userInfo.email,
		phoneNumber: authUser.userInfo.phoneNumber ?? "",
	};

	const handleSubmit = async (data: TSettingsFormData): Promise<void> => {
		await updateManager({
			cognitoId: authUser.cognitoInfo?.userId,
			...data,
		});
	};

	return (
		<SettingsForm
			initialData={initialData}
			onSubmit={handleSubmit}
			userRole="manager"
			isLoading={isUpdateLoading}
		/>
	);
}
export default ManagersSettingsPage;
