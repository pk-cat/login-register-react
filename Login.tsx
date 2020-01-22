import { ILogger, ILoggerFactory } from "@tiama/logging";
import * as React from "react";
import "./login.scss";
import { LoginPagePrompt } from "./LoginPagePrompt";
export interface ILoginProps {
  /** A mandatory API, is used for log */
  loggerFactory: ILoggerFactory;
}
export interface ILoginState {
  /** confirm password */
  confirmPassword: string;
  /** if confirm password wrong ,display something */
  confirmPasswordTips: string;
  /** when user click register or login button, display loading image or not */
  displayLoading: boolean;
  /**
   * if value equal 0, hidden message,
   * if value equal 1, message container move in,
   * if value equal 2, message container move out
   */
  displayMessage: number;
  /** if value is 0 ,form is for login in, if value is 1, that means form is for registering */
  formState: number;
  logger: ILogger;
  /** Display user login or registration results as a message */
  message: string;
  /** password */
  password: string;
  /** if password wrong ,display something */
  passwordTips: string;
  /** remember password checkbox is selected or not */
  rememberPassword: boolean;
  /** user login or registration results, value equal true, means status success, false means fail */
  result: boolean;
  /** if enter confirm password is empty, this value equal true */
  displayConfirmPasswordTips: boolean;
  /** if enter password is empty, this value equal true */
  displayPasswordTips: boolean;
  /** if enter username is empty, this value equal true */
  displayUsernameTips: boolean;
  /** username */
  username: string;
}
export class Login extends React.Component<ILoginProps, ILoginState> {
  constructor(props: ILoginProps) {
    super(props);
    this.state = {
      confirmPassword: "",
      confirmPasswordTips: LoginPagePrompt.confirmPasswordEmpty,
      displayConfirmPasswordTips: false,
      displayLoading: false,
      displayMessage: 0,
      displayPasswordTips: false,
      displayUsernameTips: false,
      formState: 0,
      logger: props.loggerFactory.build("Login"),
      message: LoginPagePrompt.messageLoginSuccessful,
      password: "",
      passwordTips: LoginPagePrompt.tips,
      rememberPassword: false,
      result: true,
      username: "",
    };
    this.changeConfirmPassword = this.changeConfirmPassword.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.getUserEmail = this.getUserEmail.bind(this);
    this.handleDisplayLoading = this.handleDisplayLoading.bind(this);
    this.handleDisplayPasswordTips = this.handleDisplayPasswordTips.bind(this);
    this.handleGoToOtherPage = this.handleGoToOtherPage.bind(this);
    this.handleMessageMoveOut = this.handleMessageMoveOut.bind(this);
    this.loginIn = this.loginIn.bind(this);
    this.register = this.register.bind(this);
    this.resetAllState = this.resetAllState.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.toggleFormState = this.toggleFormState.bind(this);
    this.toggleRememberPassword = this.toggleRememberPassword.bind(this);
    this.successfulLoginOrRegister = this.successfulLoginOrRegister.bind(this);
  }

  /** when component will un mount, reset all state */
  public componentWillUnmount() {
    this.resetAllState();
  }

  // render
  public render() {
    const loadingImage = require("./LoginImage/loading.svg");
    const formStateWords = this.state.formState === 0 ? "Login in" : "Register";
    const loadingClassName = this.state.displayLoading
      ? "tes-components-login-loading"
      : "tes-components-login-hiddenLoading";
    return (
      <div className="tes-components-login">
        <form className="tes-components-login-forms">
          <label className="tes-components-login-state">{formStateWords}</label>
          {/* Username */}
          {this.renderUsername()}
          {/* Password */}
          {this.renderPassword()}
          {/*Confirm Password  */}
          {this.renderConfirmPassword()}
          {/* Remember Me and forget password*/}
          {this.renderRememberMeAndForgetPassword()}
          {/* submit/loginIn/register */}
          {this.renderSubmitButton()}
          {/* toggle 'register now' and 'login in'  */}
          {this.renderToggleButton()}
        </form>

        {/* loading image */}
        <div className={loadingClassName}>
          <img role="presentation" src={loadingImage} alt="" />
        </div>
        {/* message */}
        {this.renderMessage()}
      </div>
    );
  }

  /** change and update state of confirm password */
  private changeConfirmPassword(event: { target: { value: any } }) {
    const value = event.target.value;
    this.setState({ displayConfirmPasswordTips: false });
    if (value === "") {
      this.setState({ displayConfirmPasswordTips: true });
    }
    this.setState({ confirmPassword: value });
  }

  /** change and update state of password */
  private changePassword(event: { target: { value: any } }) {
    const value = event.target.value;
    this.setState({ displayPasswordTips: false });
    if (value === "") {
      this.setState({ displayPasswordTips: true });
    }
    this.setState({ password: value });
  }

  /** change and update state of username */
  private changeUsername(event: { target: { value: any } }) {
    const value = event.target.value;
    this.setState({ displayUsernameTips: false });
    if (value === "") {
      this.setState({ displayUsernameTips: true });
    }
    this.setState({ username: value });
  }

  /** a window.prompt , user can input email dress */
  private getUserEmail() {
    const person = prompt(LoginPagePrompt.promptKey, LoginPagePrompt.promptValue);
    if (person === null || person === "") {
      return LoginPagePrompt.promptCancel;
    } else {
      return LoginPagePrompt.promptSuccess;
    }
  }
  /** display loading image */
  private handleDisplayLoading(LoginTip: string, results: boolean) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.setState({
          displayLoading: false,
          displayMessage: 1,
          message: LoginPagePrompt[LoginTip],
          result: results,
        });
        resolve("done");
      }, 900);
    });
  }

  /** when user input password.length  is less than 6, display password tips */
  private handleDisplayPasswordTips() {
    this.setState({
      displayPasswordTips: true,
      passwordTips: LoginPagePrompt.lengthOver6,
    });
  }
  /** after login/register successful, go to other page */
  private handleGoToOtherPage() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.resetAllState();
      }, 800);
      resolve("");
    });
  }
  /** make the top message move out */
  private handleMessageMoveOut() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.setState({ displayMessage: 2 });
        resolve("done");
      }, 1500);
    });
  }

  /** make sure username and password isn't empty then send request to backend for login in */
  private loginIn() {
    this.state.logger.debug(
      "login in",
      `password: ${this.state.password}`,
      `username: ${this.state.username}`,
    );
    if (this.state.password !== "" && this.state.username !== "") {
      if (this.state.password.length < 6) {
        this.handleDisplayPasswordTips();
      } else if (
        this.state.password === "qwe123" &&
        this.state.username === "1"
      ) {
        this.setState({ displayLoading: true }, async () => {
          this.successfulLoginOrRegister("messageLoginSuccessful");
        });
      } else if (this.state.username !== "1") {
        this.setState({ displayLoading: true }, async () => {
          await this.handleDisplayLoading("messageUsernameNotExist", false);
          await this.handleMessageMoveOut();
        });
      } else {
        this.setState({ displayLoading: true }, async () => {
          await this.handleDisplayLoading("messageWrongPassword", false);
          await this.handleMessageMoveOut();
        });
      }
    } else if (this.state.password === "" || this.state.username === "") {
      this.setState({
        displayPasswordTips: this.state.password === "",
        displayUsernameTips: this.state.username === "",
      });
    }
  }

  /** render confirmPassword */
  private renderConfirmPassword() {
    const confirmPasswordClassName =
      this.state.formState === 0
        ? "tes-components-login-hidden tes-components-login-input"
        : "tes-components-login-input";
    const confirmPasswordImage = require("./LoginImage/confirmPassword.svg");
    const confirmPasswordTipsClassName = this.state.displayConfirmPasswordTips
      ? "tes-components-login-displayTips"
      : "tes-components-login-tips";
    return (
      <>
        <div className={confirmPasswordClassName}>
          <input
            type="password"
            name="tes-components-login-ConfirmPassword"
            id="tes-components-login-ConfirmPassword"
            placeholder="Confirm Password"
            value={this.state.confirmPassword}
            onChange={this.changeConfirmPassword}
          />
          <img role="presentation" alt="" src={confirmPasswordImage} />
        </div>
        <div className={confirmPasswordTipsClassName}>
          {this.state.confirmPasswordTips}
        </div>
      </>
    );
  }
  /** render message on top, when user click forget password or login or register, it will display this message */
  private renderMessage() {
    // message className
    const messageClassName =
      this.state.displayMessage === 0
        ? "tes-components-login-message-container-hidden"
        : this.state.displayMessage === 1
        ? "tes-components-login-message-container tes-components-login-message-move-in"
        : "tes-components-login-message-container tes-components-login-message-move-out";
    // message icon className
    const messageIconClassName = this.state.result
      ? "tes-components-login-icon-success"
      : "tes-components-login-icon-fail";
    return (
      <>
        <div className={messageClassName}>
          {/* icon */}
          <div>
            <span className={messageIconClassName} />
            <span className="tes-components-login-word-success">
              {this.state.message}
            </span>
          </div>
        </div>
      </>
    );
  }
  /** render password input and icon */
  private renderPassword() {
    const passwordImage = require("./LoginImage/password.svg");
    const passwordTipsClassName = this.state.displayPasswordTips
      ? "tes-components-login-display-passwordTips"
      : "tes-components-login-hidden-passwordTips";
    return (
      <>
        <div className="tes-components-login-input">
          <input
            type="password"
            name="tes-components-login-password"
            id="tes-components-login-password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.changePassword}
          />
          <img role="presentation" alt="" src={passwordImage} />
        </div>
        <div className={passwordTipsClassName}>{this.state.passwordTips}</div>
      </>
    );
  }
  /** render remember me and forget password button */
  private renderRememberMeAndForgetPassword() {
    const rememberMeClassName = this.state.rememberPassword
      ? "tes-components-login-rememberMe-checkImage"
      : "tes-components-login-rememberMe-unCheckImage";
    const rememberPasswordClassName =
      this.state.formState === 0
        ? "tes-components-login-rememberMe"
        : "tes-components-login-hidden";
    return (
      <>
        <div className={rememberPasswordClassName}>
          <p
            role="button"
            onClick={this.toggleRememberPassword}
            className="tes-components-login-rememberMe-CheckBox"
          >
            <i className={rememberMeClassName} />
            <span className="tes-components-login-rememberMe-CheckBox-word">
              Remember Me
            </span>
          </p>
          {/* Forgot password */}
          <p>
            <span role="button" onClick={this.sendEmail}>
              <a href="#" onClick={e => e.preventDefault()}>
                Forgot password
              </a>
            </span>
          </p>
        </div>
      </>
    );
  }
  /** render a submit button, when user click this button ,submit the form */
  private renderSubmitButton() {
    return this.state.formState === 0 ? (
      <button
        type="button"
        className="tes-components-login-button"
        onClick={this.loginIn}
      >
        Login
      </button>
    ) : (
      <button
        type="button"
        className="tes-components-login-button"
        onClick={this.register}
      >
        Register
      </button>
    );
  }
  /** render toggle button, when user click this button, toggle form state between 'register' and 'login' */
  private renderToggleButton() {
    // toggle formState words
    const toggleFormStateWords =
      this.state.formState === 0 ? "register now" : "login in";
    return (
      <>
        <p className="tes-components-login-registerNow">
          <span>Or</span>
          <span role="button" onClick={this.toggleFormState}>
            <a href="#" onClick={e => e.preventDefault()} role="button">
              {toggleFormStateWords}
            </a>
          </span>
        </p>
      </>
    );
  }
  /** render username input and icon */
  private renderUsername() {
    const usernameImage = require("./LoginImage/username.svg");
    const usernameTipClassName = this.state.displayUsernameTips
      ? "tes-components-login-display-usernameTips"
      : "tes-components-login-hidden-usernameTips";
    return (
      <>
        <div className="tes-components-login-input">
          <input
            type="text"
            name="tes-components-login-username"
            id="tes-components-login-username"
            placeholder="Username"
            value={this.state.username}
            onChange={this.changeUsername}
          />
          <img role="presentation" alt="" src={usernameImage} />
        </div>
        <div className={usernameTipClassName}>Please input your username!</div>
      </>
    );
  }

  /** make sure username and password isn't empty then send request to backend for register */
  private register() {
    this.state.logger.debug(
      "register",
      `confirmPassword: ${this.state.confirmPassword}`,
      `password:${this.state.password}`,
      `username:${this.state.username}`,
    );
    if (
      this.state.confirmPassword !== "" &&
      this.state.password !== "" &&
      this.state.username !== ""
    ) {
      if (this.state.password.length < 6) {
        this.handleDisplayPasswordTips();
      } else if (this.state.confirmPassword !== this.state.password) {
        this.setState({
          confirmPasswordTips: LoginPagePrompt.confirmPasswordWrong,
          displayConfirmPasswordTips: true,
        });
      } else {
        if (this.state.username === "1") {
          this.setState({ displayLoading: true }, async () => {
            await this.handleDisplayLoading("messageUsernameExist", false);
            await this.handleMessageMoveOut();
          });
        } else if (this.state.username !== "1") {
          this.setState({ displayLoading: true }, async () => {
            this.successfulLoginOrRegister("messageRegisterSuccessful");
          });
        }
      }
    } else if (
      this.state.confirmPassword === "" ||
      this.state.password === "" ||
      this.state.username === ""
    ) {
      this.setState({
        displayConfirmPasswordTips: this.state.confirmPassword === "",
        displayPasswordTips: this.state.password === "",
        displayUsernameTips: this.state.username === "",
      });
    }
  }

  /** reset all state as initial value */
  private resetAllState() {
    this.setState({
      confirmPassword: "",
      confirmPasswordTips: LoginPagePrompt.confirmPasswordEmpty,
      displayConfirmPasswordTips: false,
      displayLoading: false,
      displayMessage: 0,
      displayPasswordTips: false,
      displayUsernameTips: false,
      formState: 0,
      message: LoginPagePrompt.messageLoginSuccessful,
      password: "",
      passwordTips: LoginPagePrompt.tips,
      rememberPassword: false,
      result: true,
      username: "",
    });
  }

  /** when user forget password,input the email path, then simulate a message: there will be an email */
  private sendEmail() {
    this.setState(
      {
        displayMessage: 1,
        message: this.getUserEmail(),
        result: true,
      },
      () => {
        setTimeout(() => {
          this.setState({ displayMessage: 2 });
        }, 1800);
      },
    );
  }

  /**
   * if form as a login form, it will display login successful
   * if form ad a register form, it will display register successful
   */
  private async successfulLoginOrRegister(message: string) {
    await this.handleDisplayLoading(message, true);
    await this.handleMessageMoveOut();
    await this.handleGoToOtherPage();
  }
  /** toggle form state of login or register */
  private toggleFormState() {
    const formState = this.state.formState === 0 ? 1 : 0;
    this.setState({
      confirmPassword: "",
      confirmPasswordTips: LoginPagePrompt.confirmPasswordEmpty,
      displayConfirmPasswordTips: false,
      displayLoading: false,
      displayMessage: 0,
      displayPasswordTips: false,
      displayUsernameTips: false,
      formState,
      message: LoginPagePrompt.messageLoginSuccessful,
      password: "",
      passwordTips: LoginPagePrompt.tips,
      rememberPassword: false,
      result: true,
      username: "",
    });
  }

  /** toggle remember password checkbox state of checked */
  private toggleRememberPassword() {
    this.state.logger.debug(
      "rememberPassword state changed",
      !this.state.rememberPassword,
    );
    this.setState({ rememberPassword: !this.state.rememberPassword });
  }
}
