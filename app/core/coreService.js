(function () {
    // const remote = require('electron').remote

    var coreService = function ($rootScope, $mdToast, $mdDialog, messages, $interval) {
        var svc = this;

        var currentId = 1;
        svc.newId = function (seed) {
            if (seed) currentId = seed;
            return currentId++;
        }

        function Save(fileName, filePath, category, type) {
            this.id = svc.newId();
            this.path = filePath;
            this.name = fileName;
            this.category = category;
            this.type = type;
            this.time = new Date();
        };

        // ensures all settings are initialized. Will set defaults if missing. 
        // Allows for addition of new settings without breaking settings file
        function init() {
            // data object initialization - this will store all persistent data
            if (typeof svc.data === 'undefined' || svc.data === null)
                svc.data = {};

            // Array of "new Save()"
            if (typeof svc.data.saves === 'undefined' || svc.data.saves === null)
                svc.data.saves = [];

            // Array of strings
            if (typeof svc.data.categories === 'undefined' || svc.data.categories === null)
                svc.data.categories = [];

            // Configurable settings
            if (typeof svc.data.settings === 'undefined' || svc.data.settings === null)
                svc.data.settings = {};
            if (typeof svc.data.settings.saveFileLocation === 'undefined' || svc.data.settings.saveFileLocation === null)
                svc.data.settings.saveFileLocation = null;
            if (typeof svc.data.settings.saveDirectory === 'undefined' || svc.data.settings.saveDirectory === null)
                svc.data.settings.saveDirectory = "saves/";
            if (typeof svc.data.settings.backupFileFormat === 'undefined' || svc.data.settings.backupFileFormat === null)
                svc.data.settings.backupFileFormat = "{month}-{day}-{year}_{hours}-{minutes}-{seconds}";
            if (typeof svc.data.settings.backupNameFormat === 'undefined' || svc.data.settings.backupNameFormat === null)
                svc.data.settings.backupNameFormat = "{month}/{day}/{year} {hours}:{minutes}:{seconds}";

            // Notification settings
            if (typeof svc.data.settings.notificationSound === 'undefined' || svc.data.settings.notificationSound === null)
                svc.data.settings.notificationSound = true;
            if (typeof svc.data.settings.windowsNotification === 'undefined' || svc.data.settings.windowsNotification === null)
                svc.data.settings.windowsNotification = true;
            if (typeof svc.data.settings.notificationSoundVolume === 'undefined' || svc.data.settings.notificationSoundVolume === null)
                svc.data.settings.notificationSoundVolume = 100;

            // Hotkey initialization
            if (typeof svc.data.settings.hotkeys === 'undefined' || svc.data.settings.hotkeys === null)
                svc.data.settings.hotkeys = {};
            if (typeof svc.data.settings.hotkeys.backup === 'undefined' || svc.data.settings.hotkeys.backup === null)
                svc.data.settings.hotkeys.backup = {};
            if (typeof svc.data.settings.hotkeys.restore === 'undefined' || svc.data.settings.hotkeys.restore === null)
                svc.data.settings.hotkeys.restore = {};

            // Backup hotkey
            if (typeof svc.data.settings.hotkeys.backup.modifier1 === 'undefined' || svc.data.settings.hotkeys.backup.modifier1 === null)
                svc.data.settings.hotkeys.backup.modifier1 = "CommandOrControl";
            if (typeof svc.data.settings.hotkeys.backup.modifier2 === 'undefined' || svc.data.settings.hotkeys.backup.modifier2 === null)
                svc.data.settings.hotkeys.backup.modifier2 = "Shift";
            if (typeof svc.data.settings.hotkeys.backup.modifier3 === 'undefined' || svc.data.settings.hotkeys.backup.modifier3 === null)
                svc.data.settings.hotkeys.backup.modifier3 = "B";

            // Restore hotkey
            if (typeof svc.data.settings.hotkeys.restore.modifier1 === 'undefined' || svc.data.settings.hotkeys.restore.modifier1 === null)
                svc.data.settings.hotkeys.restore.modifier1 = "CommandOrControl";
            if (typeof svc.data.settings.hotkeys.restore.modifier2 === 'undefined' || svc.data.settings.hotkeys.restore.modifier2 === null)
                svc.data.settings.hotkeys.restore.modifier2 = "Shift";
            if (typeof svc.data.settings.hotkeys.restore.modifier3 === 'undefined' || svc.data.settings.hotkeys.restore.modifier3 === null)
                svc.data.settings.hotkeys.restore.modifier3 = "R";

            // Category
            if (typeof svc.data.settings.selectedCategory === 'undefined' || svc.data.settings.selectedCategory === null)
                svc.data.settings.selectedCategory = null;

            // Auto-save settings
            if (typeof svc.data.settings.autosave === 'undefined' || svc.data.settings.autosave === null)
                svc.data.settings.autosave = false;
            if (typeof svc.data.settings.autosaveInterval === 'undefined' || svc.data.settings.autosaveInterval === null)
                svc.data.settings.autosaveInterval = 60;
            if (typeof svc.data.settings.autosaveMaxLimit === 'undefined' || svc.data.settings.autosaveMaxLimit === null)
                svc.data.settings.autosaveMaxLimit = false;
            if (typeof svc.data.settings.autosaveMaxCount === 'undefined' || svc.data.settings.autosaveMaxCount === null)
                svc.data.settings.autosaveMaxCount = 10;
            if (typeof svc.data.autosaveStartTime === 'undefined' || svc.data.autosaveStartTime === null)
                svc.data.autosaveStartTime = new Date();
            if (typeof svc.data.autosaveTimeRemaining === 'undefined' || svc.data.autosaveTimeRemaining === null)
                svc.data.autosaveTimeRemaining = null;
        }

        init();

        svc.calculateAutosaveTimeRemaining = function () {
            if (svc.data.settings.autosave && svc.data.autosaveStartTime) {
                var timeLeft = "";
                var dateDiffMinutes = ((svc.data.autosaveStartTime.getTime() + (svc.data.settings.autosaveInterval * 60000)) - new Date().getTime()) / 60000;
                if (dateDiffMinutes <= 1) {
                    timeLeft = "< 1 Minute"
                } else {
                    timeLeft = Math.ceil(dateDiffMinutes).toString() + " Minutes";
                }
                svc.data.autosaveTimeRemaining = timeLeft + " Remaining";
            } else {
                svc.data.autosaveTimeRemaining = null;
            }
        };

        $interval(function () {
            svc.calculateAutosaveTimeRemaining();
        }, 10000);

        svc.functionManager = {
            add: function (functionName, functionDef) {
                svc.functionManager[functionName] = functionDef;
            }
        };

        //Imports
        var fs = require("fs");
        var path = require('path');
        const { app, globalShortcut, dialog, getCurrentWindow } = require('electron').remote;

        //Encode all data to JSON
        svc.saveToJson = function () {
            return JSON.stringify(svc.data);
        };

        //Overwrites all data with parsed json contents
        svc.loadFromJson = function (json) {
            svc.data = JSON.parse(json);
        };

        //Persists data to the settings file
        svc.saveSettings = function () {
            try {
                fs.writeFileSync("settings.json", svc.saveToJson(), 'utf8');
            } catch(ex) {
                dialog.showMessageBox(null, {
                    title: 'Cannot Save',
                    message: 'Could not save to current folder. Please either run the program as admin or install it to a folder that does not require admin permissions.'
                });
                getCurrentWindow().close();
            }
            // fs.createWriteStream("settings.json").write(svc.saveToJson());
        };

        //Loads data from the settings file
        svc.loadSettings = function () {
            svc.loadFromJson(fs.readFileSync("settings.json", "utf8"));
            init();

            //Set latest id
            var maxId = _.max(_.map(svc.data.saves, "id"))
            if (maxId) svc.newId(maxId);
        };

        svc.showSuccessToast = function (text) {
            var toast = $mdToast.simple()
                .textContent(text)
                .position("bottom right")
                .hideDelay(3000);
            // .theme("success-toast");
            $mdToast.show(toast);
        };

        svc.findSave = function (id) {
            return _.find(svc.data.saves, { id: id });
        };

        svc.findSaveIndex = function (id) {
            return _.findIndex(svc.data.saves, { id: id });
        };

        svc.registerShortcuts = function (backupFunction, restoreFunction) {
            var backup = (svc.data.settings.hotkeys.backup.modifier1) + "+" + (svc.data.settings.hotkeys.backup.modifier2 ? (svc.data.settings.hotkeys.backup.modifier2 + "+") : "") + svc.data.settings.hotkeys.backup.modifier3
            var restore = (svc.data.settings.hotkeys.restore.modifier1) + "+" + (svc.data.settings.hotkeys.restore.modifier2 ? (svc.data.settings.hotkeys.restore.modifier2 + "+") : "") + svc.data.settings.hotkeys.restore.modifier3
            globalShortcut.unregisterAll();
            globalShortcut.register(backup, () => {
                if (backupFunction) {
                    backupFunction();
                }
            });

            globalShortcut.register(restore, () => {
                if (restoreFunction) {
                    restoreFunction();
                }
            });
        };

        //get date string based on the format setting
        svc.getDateString = function (date, format) {
            var currentDate = date ? date : new Date();

            var year = currentDate.getFullYear();

            var month = currentDate.getMonth() + 1;
            month = (month > 9 ? "" : "0") + month;

            var day = currentDate.getDate();
            day = (day > 9 ? "" : "0") + day;

            var hours = currentDate.getHours();
            hours = (hours > 9 ? "" : "0") + hours;

            var minutes = currentDate.getMinutes();
            minutes = (minutes > 9 ? "" : "0") + minutes;

            var seconds = currentDate.getSeconds();
            seconds = (seconds > 9 ? "" : "0") + seconds;

            var replacements = {
                "{year}": year,
                "{month}": month,
                "{day}": day,
                "{hours}": hours,
                "{minutes}": minutes,
                "{seconds}": seconds
            };

            var dateFormatString = format ? format : svc.data.settings.backupFileFormat;

            _.forOwn(replacements, function (value, name) {
                dateFormatString = dateFormatString.replace(name, value);
            });

            return dateFormatString;
        };

        svc.notify = function (message) {
            svc.showSuccessToast(message);
            if (svc.data.settings.windowsNotification) {
                var notification = new Notification('Dark Souls Save Manager', {
                    body: message,
                    silent: true
                });
            }
            if (svc.data.settings.notificationSound) {
                document.getElementById('success-notification').play();
            }
        }

        //Returns: path of newly create backup : string
        //Params:
        //  [filePath]: path to file to be backed up. Will pull from saveFileLocation setting if not passed : string
        svc.createBackup = function (opts) {
            // initialize opts if not passed in to allow checking of props without errors
            opts = opts || {};
            var currentDate = new Date();
            var fileName = svc.getDateString(currentDate);
            var saveName = svc.getDateString(currentDate, svc.data.settings.backupNameFormat);
            var backupFileName = svc.data.settings.saveDirectory + fileName + '.bak';
            if (fs.existsSync(backupFileName)) {
                svc.showSuccessToast("You have already created a backup this second. Please wait 1 second and try again.");
                return;
            }

            filePath = opts.filePath || svc.data.settings.saveFileLocation;
            fs.copyFileSync(filePath, backupFileName);
            var fileName = saveName;
            var type = 'manual';
            if (opts && opts.type) type = opts.type;
            var save = new Save(fileName, backupFileName, svc.data.settings.selectedCategory, type);
            svc.data.saves.push(save);

            // Remove oldest autosaves that are higher then the max autosave count
            svc.cleanupAutosaves();

            svc.saveSettings();

            //TODO ensure backup was created successfully
            // if no file path was passed in (save importing)
            if (!opts.filePath) {
                svc.notify(messages.backupCreated);
            }

            svc.selectSave(save.id, null, false);

            return backupFileName;
        };

        svc.restoreSave = function (id, event) {
            var save = _.find(svc.data.saves, { id: id });

            // ensure backup exists
            if (!fs.existsSync(save.path) || fs.readFileSync(save.path).length < 100) {
                svc.showSuccessToast(messages.backupCorrupt);
                return;
            }

            // if normal save seems legitimate (exists and larger than 100 bytes), create a backup.
            if (fs.existsSync(svc.data.settings.saveFileLocation) && fs.readFileSync(svc.data.settings.saveFileLocation).length > 100) {
                fs.copyFileSync(svc.data.settings.saveFileLocation, svc.data.settings.saveFileLocation + '.bak');
            } else {
                svc.showSuccessToast(messages.backupDestSaveCorrupt);
                return;
            }

            //ensure backup exists
            if (fs.existsSync(svc.data.settings.saveFileLocation + '.bak') && fs.readFileSync(svc.data.settings.saveFileLocation + '.bak').length > 100) {
                fs.copyFileSync(save.path, svc.data.settings.saveFileLocation);


                svc.notify(messages.backupRestored);

                return;
            }

            svc.showSuccessToast(messages.backupDestBackupNotFound);
        };

        svc.deleteSave = function (id, event, skipSave, skipFileDelete) {
            var saveIndex = _.findIndex(svc.data.saves, { id: id });
            var save = svc.data.saves[saveIndex];

            if (saveIndex >= 0) {
                svc.data.saves.splice(saveIndex, 1);

                if (!skipFileDelete && fs.existsSync(save.path)) {
                    fs.unlinkSync(save.path);
                }
                if (!fs.existsSync(save.path)) {
                    if (!skipSave) {
                        svc.saveSettings();
                        svc.showSuccessToast(messages.backupDeleted);
                    }
                }
            }
        };

        svc.deleteSaves = function (saves, skipFileDelete) {
            for (var i = 0; i < saves.length; i++) {
                svc.deleteSave(saves[i].id, null, true, skipFileDelete);
            }
            svc.saveSettings();
        }

        svc.renameSave = function (id, newName, event) {
            var save = _.find(svc.data.saves, { id: id });
            save.name = newName;
            svc.saveSettings();
            svc.showSuccessToast(messages.backupRenamed);
        };

        svc.selectSave = function (id, event, showToast) {
            var saveName = "";
            _.forEach(svc.data.saves, function (o) {
                if (o.id === id) {
                    o.selected = true;
                    saveName = o.name;
                } else {
                    o.selected = false;
                }
            });

            if (showToast !== false) {
                svc.showSuccessToast("\"" + saveName + "\"" + " has been set as the primary save");
            }
            svc.saveSettings();
        };

        svc.registerShortcuts = function () {
            var backup = (svc.data.settings.hotkeys.backup.modifier1) + "+" + (svc.data.settings.hotkeys.backup.modifier2 ? (svc.data.settings.hotkeys.backup.modifier2 + "+") : "") + svc.data.settings.hotkeys.backup.modifier3
            var restore = (svc.data.settings.hotkeys.restore.modifier1) + "+" + (svc.data.settings.hotkeys.restore.modifier2 ? (svc.data.settings.hotkeys.restore.modifier2 + "+") : "") + svc.data.settings.hotkeys.restore.modifier3
            globalShortcut.unregisterAll();
            globalShortcut.register(backup, () => {
                svc.createBackup();
            });

            globalShortcut.register(restore, () => {
                var selectedSaveIndex = _.findIndex(svc.data.saves, { selected: true });

                if (selectedSaveIndex > -1) {
                    svc.restoreSave(svc.data.saves[selectedSaveIndex].id);
                } else {
                    svc.showSuccessToast("You must mark a save as primary in order to use the restore shortcut")
                }
            });
        };

        svc.addCategory = function (categoryName, event) {
            svc.data.categories.push(categoryName);
            svc.data.settings.selectedCategory = categoryName;

            svc.saveSettings();
        };

        svc.removeCategory = function (categoryName, event) {
            //remove category from categories
            var index = _.findIndex(svc.data.categories, function (o) { return o === categoryName });
            if (index >= 0) {
                svc.data.categories.splice(index, 1);
            }

            //remove category from all saves
            var saves = _.filter(svc.data.saves, { category: categoryName });
            _.forEach(saves, function (save) {
                save.category = null;
            });

            svc.saveSettings();
        };

        svc.changeCategory = function (saveId, newCategory, event) {
            var save = _.find(svc.data.saves, { id: saveId });
            save.category = newCategory;

            svc.saveSettings();
        };

        svc.startAutosave = function () {
            svc.stopAutosave();
            svc.data.autosaveStartTime = new Date();
            svc.data.settings.autosaveFn = $interval(function () {
                svc.createBackup({ type: 'auto' });
                svc.data.autosaveStartTime = new Date();
            }, svc.data.settings.autosaveInterval * 60000);

            svc.calculateAutosaveTimeRemaining();
        };

        svc.stopAutosave = function () {
            if (svc.data.settings.autosaveFn) {
                $interval.cancel(svc.data.settings.autosaveFn);
                svc.data.settings.autosaveFn = null;
            }
        };

        $rootScope.$watch(function () {
            return [svc.data.settings.autosave, svc.data.settings.autosaveInterval];
        }, function () {
            if (svc.data.settings.autosave === true) {
                svc.startAutosave();
            } else {
                svc.stopAutosave();
            }
        }, true);

        svc.makeAutosavePermanent = function (id, event) {
            var save = _.find(svc.data.saves, { id: id });
            save.type = 'manual';
            svc.saveSettings();
        }

        svc.cleanupAutosaves = function () {
            if (!svc.data.settings.autosaveMaxLimit) return;
            if (svc.data.saves.length === 0) return;
            var autosaves = _.filter(svc.data.saves, x => x.type === 'auto');
            if (autosaves.length > svc.data.settings.autosaveMaxCount) {
                var sliceAmt = svc.data.settings.autosaveMaxCount > 0 ? parseInt(svc.data.settings.autosaveMaxCount) : 0;
                var toRemove = _(autosaves).sortBy(x => x.time).reverse().slice(sliceAmt).value();
                svc.deleteSaves(toRemove);
            }
        };

        svc.updateNotificationVolume = function () {
            document.getElementById('success-notification').volume = (svc.data.settings.notificationSoundVolume / 100);
        }

        // Checks to ensure all save files actually exist
        svc.checkSaves = function () {
            var promises = [];
            for (var i = 0; i < svc.data.saves.length; i++) {
                let save = svc.data.saves[i];
                var promise = new Promise((resolve, reject) => {
                    fs.exists(save.path, (result) => {
                        resolve({
                            exists: result,
                            save: save
                        });
                    });
                });
                promises.push(promise);
            }

            Promise.all(promises).then(function (saves) {
                var missingSaves = saves.filter(x => !x.exists).map(x => x.save);
                if (missingSaves.length === 0) return;
                var htmlContent = '<div>Found missing backup files. Would you like to remove these from the list?</div><br>'
                for (var i = 0; i < missingSaves.length; i++) {
                    var save = missingSaves[i];
                    htmlContent += `
                    <div>
                        <div>
                            Save Name: ${save.name}
                        </div>
                        <div>
                            Expected Save Location: ${path.resolve(save.path)}
                        </div>
                    </div>
                    <br>
                    `
                }
                var confirm = $mdDialog.confirm()
                    .title('Remove Missing Backups')
                    .htmlContent(htmlContent)
                    .ariaLabel('Remove Missing Backups')
                    .ok('Remove Missing Backups')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(function () {
                    svc.deleteSaves(missingSaves, true);
                }, function () {
                    //cancel
                });
            });
        }
    };


    angular
        .module("app")
        .service("core", ["$rootScope", "$mdToast", "$mdDialog", "messages", "$interval", coreService]);
})();