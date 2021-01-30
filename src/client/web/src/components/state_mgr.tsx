import * as React from "react";

import { ICoreState, init } from "./core_state";
import { RootFrame } from "./root_frame";

export interface Props {}
export interface State extends ICoreState {}

export class StateMgr extends React.Component<Props, State, {}> {
  constructor(p: Props) {
    super(p);
    this.state = init();
  }

  update = (apply: (prevState: ICoreState) => ICoreState): void => {
    this.setState(apply(this.state));
  };

  render() {
    return (
      <RootFrame
        authPane={this.state.panel.authPane}
        displaying={this.state.panel.displaying}
        update={this.update}
        browser={this.state.panel.browser}
        panes={this.state.panel.panes}
      />
    );
  }
}
