export const LoginPagePrompt: ILoginPagePrompt = {
  confirmPasswordEmpty: "Please re-input your password",
  confirmPasswordWrong: "Passwords wrong, please re-enter",
  lengthOver6: "Password length must be over 6",
  messageLoginSuccessful: "login successful",
  messageRegisterSuccessful: "register successful",
  messageUsernameExist: "Username already exists",
  messageUsernameNotExist: "Username does not exist",
  messageWrongPassword: "Wrong password",
  promptCancel: "you canceled",
  promptKey: "please input your email:",
  promptSuccess: "An email will be sent to your email dress",
  promptValue: "marry.email@xxx.xxx",
  tips: "please input your password",
};
interface ILoginPagePrompt {
  confirmPasswordEmpty: string;
  confirmPasswordWrong: string;
  lengthOver6: string;
  messageLoginSuccessful: string;
  messageRegisterSuccessful: string;
  messageUsernameExist: string;
  messageUsernameNotExist: string;
  messageWrongPassword: string;
  promptCancel: string;
  promptKey: string;
  promptSuccess: string;
  promptValue: string;
  tips: string;
}
