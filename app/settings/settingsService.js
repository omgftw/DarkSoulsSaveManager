//Migrated to core service

// var settingsService = function ($mdToast) {
//     var svc = this;

//     svc.saveFileLocation = null;
//     svc.saveDirectory = "saves/";
//     svc.backupFileFormat = "{month}-{day}-{year}_{hours}-{minutes}-{seconds}";
//     svc.backupNameFormat = "{month}/{day}/{year} {hours}:{minutes}:{seconds}";

    
//     svc.data = {};
//     svc.data.saves = [];

//     svc.data.saveFileLocation = null;
//     svc.data.saveDirectory = "saves/";
//     svc.data.backupFileFormat = "{month}-{day}-{year}_{hours}-{minutes}-{seconds}";
//     svc.data.backupNameFormat = "{month}/{day}/{year} {hours}:{minutes}:{seconds}";

//     svc.data.hotkeys = {};
//     svc.data.hotkeys.backup = {};
//     svc.data.hotkeys.restore = {};

//     svc.data.hotkeys.backup.modifier1 = "CommandOrControl";
//     svc.data.hotkeys.backup.modifier2 = "Shift";
//     svc.data.hotkeys.backup.modifier3 = "B";

//     svc.data.hotkeys.restore.modifier1 = "CommandOrControl";
//     svc.data.hotkeys.restore.modifier2 = "Shift";
//     svc.data.hotkeys.restore.modifier3 = "R";

//     var fs = require("fs");
//     const {app, globalShortcut} = require('electron').remote

//     svc.getSaveData = function () {
//         var saveData = {
//             saveFileLocation: svc.saveFileLocation,
//             saveDirectory: svc.saveDirectory,
//             backupFileFormat: svc.backupFileFormat,
//             backupNameFormat: svc.backupNameFormat,
//             data: svc.data
//         };

//         return JSON.stringify(saveData)
//     };

//     svc.setSaveData = function (json) {
//         var data = JSON.parse(json);
//         svc.saveFileLocation = data.saveFileLocation;
//         svc.saveDirectory = data.saveDirectory;
//         svc.backupFileFormat = data.backupFileFormat;
//         svc.backupNameFormat = data.backupNameFormat;
//         svc.data = data.data;
//     };

//     svc.saveSettings = function () {
//         fs.createWriteStream("settings.json").write(svc.getSaveData());
//     };

//     svc.loadSettings = function () {
//         svc.setSaveData(fs.readFileSync("settings.json"));
//     };

//     svc.showSuccessToast = function (text) {
//         var toast = $mdToast.simple()
//             .textContent(text)
//             .position("bottom right")
//             .hideDelay(3000);
//         // .theme("success-toast");
//         $mdToast.show(toast);
//     }

//     svc.registerShortcuts = function (backupFunction, restoreFunction) {
//         var backup = (svc.data.hotkeys.backup.modifier1) + "+" + (svc.data.hotkeys.backup.modifier2 ? (svc.data.hotkeys.backup.modifier2 + "+") : "") + svc.data.hotkeys.backup.modifier3
//         var restore = (svc.data.hotkeys.restore.modifier1) + "+" + (svc.data.hotkeys.restore.modifier2 ? (svc.data.hotkeys.restore.modifier2 + "+") : "") + svc.data.hotkeys.restore.modifier3
//         globalShortcut.unregisterAll();
//         globalShortcut.register(backup, () => {
//             if (backupFunction) {
//                 backupFunction();
//             }
//         });

//         globalShortcut.register(restore, () => {
//             if (restoreFunction) {
//                 restoreFunction();
//             }
//         });
//     };
// };


// angular
//     .module("app")
//     .service("settings", ["$mdToast", settingsService]);