import { mock, instance, verify, when, anything } from "ts-mockito";
import { Map } from "immutable";

import { SharingsPanel } from "../panel_sharings";
import { initUploadMgr } from "../../worker/upload_mgr";
import { ICoreState, newState } from "../core_state";
import { updater } from "../state_updater";
import { MockWorker } from "../../worker/interface";
import { NewMockUsersClient } from "../../client/users_mock";
import { NewMockFilesClient } from "../../client/files_mock";
import { NewMockSettingsClient } from "../../client/settings_mock";
import { makePromise } from "../../test/helpers";

describe("SharingsPanel", () => {
  const initSharingsPanel = (): any => {
    const mockWorkerClass = mock(MockWorker);
    const mockWorker = instance(mockWorkerClass);
    initUploadMgr(mockWorker);

    const coreState = newState();
    const usersCl = NewMockUsersClient("");
    const filesCl = NewMockFilesClient("");
    const settingsCl = NewMockSettingsClient("");

    updater().init(coreState);
    updater().setClients(usersCl, filesCl, settingsCl);

    const sharingsPanel = new SharingsPanel({
      sharingsInfo: coreState.sharingsInfo,
      msg: coreState.msg,
      login: coreState.login,
      ui: coreState.ui,
      update: (updater: (prevState: ICoreState) => ICoreState) => {},
    });

    return {
      sharingsPanel,
      usersCl,
      filesCl,
    };
  };

  test("delete sharing", async () => {
    const { sharingsPanel, usersCl, filesCl } = initSharingsPanel();

    const newSharings = Map<string, string>({
      mock_sharingfolder1: "f123456",
      mock_sharingfolder2: "f123456",
    });

    filesCl.listSharingIDs = jest.fn().mockReturnValueOnce(
      makePromise({
        status: 200,
        statusText: "",
        data: {
          // it seems immutable map will be converted into built-in map automatically
          IDs: newSharings,
        },
      })
    );

    await sharingsPanel.deleteSharing();

    // TODO: check delSharing's input
    expect(updater().props.filesInfo.isSharing).toEqual(false);
    expect(updater().props.sharingsInfo.sharings).toEqual(newSharings);
  });
});
