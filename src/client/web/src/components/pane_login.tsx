import * as React from "react";
import { List } from "immutable";

import { ICoreState } from "./core_state";
import { updater } from "./state_updater";

export interface Props {
  userRole: string;
  authed: boolean;
  captchaID: string;
  update?: (updater: (prevState: ICoreState) => ICoreState) => void;
}

export interface State {
  user: string;
  pwd: string;
  captchaInput: string;
}

export class AuthPane extends React.Component<Props, State, {}> {
  private update: (updater: (prevState: ICoreState) => ICoreState) => void;
  constructor(p: Props) {
    super(p);
    this.update = p.update;
    this.state = {
      user: "",
      pwd: "",
      captchaInput: "",
    };
  }

  changeUser = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ user: ev.target.value });
  };

  changePwd = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ pwd: ev.target.value });
  };

  changeCaptcha = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ captchaInput: ev.target.value });
  };

  login = async () => {
    return updater()
      .login(
        this.state.user,
        this.state.pwd,
        this.props.captchaID,
        this.state.captchaInput
      )
      .then((ok: boolean): Promise<any> => {
        if (ok) {
          this.update(updater().updateLogin);
          this.setState({ user: "", pwd: "", captchaInput: "" });
          // close all the panes
          updater().displayPane("");
          this.update(updater().updatePanes);

          // refresh
          return Promise.all([
            updater().setHomeItems(),
            updater().refreshUploadings(),
            updater().isSharing(updater().props.browser.dirPath.join("/")),
            updater().listSharings(),
            updater().self(),
          ]);
        } else {
          this.setState({ user: "", pwd: "", captchaInput: "" });
          alert("Failed to login.");

          return updater().getCaptchaID();
        }
      })
      .then(() => {
        this.update(updater().updateBrowser);
      });
  };

  logout = () => {
    updater()
      .logout()
      .then((ok: boolean) => {
        if (ok) {
          this.update(updater().updateLogin);
        } else {
          alert("Failed to logout.");
        }
      });
  };

  refreshCaptcha = async () => {
    return updater()
      .getCaptchaID()
      .then(() => {
        this.props.update(updater().updateLogin);
      });
  };

  render() {
    return (
      <span>
        <div
          className="container"
          style={{ display: this.props.authed ? "none" : "block" }}
        >
          <div className="padding-l">
            <div className="flex-list-container">
              <div className="flex-list-item-l">
                <input
                  name="user"
                  type="text"
                  onChange={this.changeUser}
                  value={this.state.user}
                  className="black0-font margin-t-m margin-b-m margin-r-m"
                  placeholder="user name"
                />
                <input
                  name="pwd"
                  type="password"
                  onChange={this.changePwd}
                  value={this.state.pwd}
                  className="black0-font margin-t-m margin-b-m"
                  placeholder="password"
                />
              </div>
              <div className="flex-list-item-r">
                <button
                  onClick={this.login}
                  className="green0-bg white-font margin-t-m margin-b-m"
                >
                  Log in
                </button>
              </div>
            </div>

            <div className="flex-list-container">
              <div className="flex-list-item-l">
                <input
                  name="captcha"
                  type="text"
                  onChange={this.changeCaptcha}
                  value={this.state.captchaInput}
                  className="black0-font margin-t-m margin-b-m margin-r-m"
                  placeholder="captcha"
                />
                <img
                  src={`/v1/captchas/imgs?capid=${this.props.captchaID}`}
                  className="captcha"
                  onClick={this.refreshCaptcha}
                />
              </div>
              <div className="flex-list-item-l"></div>
            </div>
          </div>
        </div>

        <span style={{ display: this.props.authed ? "inherit" : "none" }}>
          <button onClick={this.logout} className="grey1-bg white-font">
            Log out
          </button>
        </span>
      </span>
    );
  }
}
