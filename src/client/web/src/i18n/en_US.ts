import { Map } from "immutable";

export const msgs: Map<string, string> = Map({
  "stateMgr.cap.fail": "failed to get captcha id",
  "browser.upload.del.fail": "Failed to delete uploading item",
  "browser.folder.add.fail": "Folder name can not be empty",
  "browser.del.fail": "Please select file or folder to delete at first",
  "browser.move.fail": "Source directory is same as destination directory",
  "browser.share.add.fail": "Failed to enable sharing",
  "browser.share.del.fail": "Failed to disable sharing",
  "browser.share.del": "Stop Sharing",
  "browser.share.add": "Share Folder",
  "browser.share.title": "Sharings",
  "browser.share.desc": "All folders which are shared",
  "browser.upload.title": "Uploadings",
  "browser.upload.desc": "All files which are in uploading",
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
  "browser.used": "Used Space",
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
  "settings.pwd.old": "Old password",
  "settings.pwd.new1": "New password",
  "settings.pwd.new2": "Confirm new password",
  "settings.chooseLan": "Choose Language",
  "settings.pwd.update": "Update Password",
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
  zhCN: "简体中文",
  enUS: "English (US)",
  "move.fail": "Failed to move",
  "share.404.title": "No folder is in sharing",
  "share.404.desc": "You can share a folder in the items tab",
  "upload.404.title": "No uploading is in the progress",
  "upload.404.desc": "You can upload a file in the items tab",
  detail: "Detail",
  refresh: "Refresh",
  "refresh-hint": "Please refresh later to see the result",
  "pane.login": "Login",
  "pane.admin": "Administration",
  "pane.settings": "Settings",
  "logout.confirm": "Are you going to logout?",
  unauthed: "Unauthorized action",
  "err.tooManyUploads": "Can not upload more than 1000 files at once",
  "user.profile": "User Profile",
  "user.downLimit": "Download Speed Limit",
  "user.upLimit": "Upload Speed Limit",
  "user.spaceLimit": "Space Limit",
  "cfg.siteName": "Site Name",
  "cfg.siteDesc": "Site Description",
  "cfg.bg": "Background",
  "cfg.bg.url": "Background URL",
  "cfg.bg.repeat": "Repeat",
  "cfg.bg.pos": "Position",
  "cfg.bg.align": "Align",
  reset: "Reset",
  "bg.url.alert": "Image URL is too short or too long",
  "bg.pos.alert": "Position only supports: top, bottom, left, right, center",
  "bg.repeat.alert":
    "Repeat only supports: repeat-x, repeat-y, repeat, space, round, no-repeat",
  "bg.align.alert": "Align only supports: scroll, fixed, local",
  "prefer.theme": "Theme",
  "prefer.theme.url": "Theme URL",
  "settings.customLan": "Customized Language Pack",
  "settings.lanPackURL": "Language Pack URL",
  "op.fail": "Operation Failed",
  "op.confirm": "Do you confirm to apply the action?",
});
