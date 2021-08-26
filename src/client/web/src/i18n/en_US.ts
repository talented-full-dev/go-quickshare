import { Map } from "immutable";

export const msgs: Map<string, string> = Map({
  "stateMgr.cap.fail": "failed to get captcha id",
  "browser.upload.del.fail": "Failed to delete uploadini item",
  "browser.folder.add.fail": "Folder name can not be empty",
  "browser.del.fail": "Please select file or folder to delete at first",
  "browser.move.fail": "Source directory is same as destination directory",
  "browser.share.add.fail": "Failed to enable sharing",
  "browser.share.del.fail": "Failed to disable sharing",
  "browser.share.del": "Stop sharing",
  "browser.share.add": "Share it",
  "browser.share.title": "Sharings",
  "browser.folder.name": "Folder name",
  "browser.folder.add": "Add Folder",
  "browser.upload": "Upload",
  "browser.delete": "Delete",
  "browser.paste": "Paste",
  "browser.select": "Select",
  "browser.deselect": "Deselect",
  "browser.selectAll": "Select All",
  "browser.stop": "Stop",
  "browser.disable": "Disable",
  "browser.location": "Location",
  "browser.item.title": "Items",
  "panes.close": "Close",
  "login.logout.fail": "Failed to log out",
  "login.username": "User Name",
  "login.captcha": "Captcha",
  "login.pwd": "Password",
  "login.login": "Login",
  "login.logout": "Logout",
  "settings.pwd.notSame": "Input passwords are not identical",
  "settings.pwd.empty": "Password can not be empty",
  "settings.pwd.notChanged": "New Password can be identical to old password",
  update: "Update",
  "settings.pwd.old": "current password",
  "settings.pwd.new1": "new password",
  "settings.pwd.new2": "input again password",
  settings: "Settings",
  admin: "Admin",
  "update.ok": "Succeeded to update",
  "update.fail": "Failed to update",
  "delete.fail": "Failed to delete",
  "delete.ok": "Succeeded to delete",
  delete: "Delete",
  spaceLimit: "Space Limit",
  uploadLimit: "Upload Speed Limit",
  downloadLimit: "Download Speed Limit",
  "add.fail": "Failed to create",
  "add.ok": "Succeeded to create",
  "role.delete.warning":
    "After deleting this role, some of users may not be able to login.",
  "user.id": "User ID",
  "user.add": "Add User",
  "user.name": "User Name",
  "user.role": "User Role",
  "user.password": "User Password",
  add: "Add",
  "admin.users": "Users",
  "role.add": "Add Role",
  "role.name": "Role Name",
  "admin.roles": "Roles",
});
