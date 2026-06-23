import { ResetPasswordForm } from "./reset-password-form";

type Params = { params: Promise<{ token: string }> };

export default async function ResetPasswordPage({ params }: Params) {
  const { token } = await params;
  return <ResetPasswordForm token={token} />;
}
