var messagesService = function ($mdToast) {
    var svc = this;

    svc.backupCreated = "Save backup created";
    svc.backupRestored = "Save successfully restored";
    svc.backupCorrupt = "The save failed to restore. The backup file might be corrupt or missing.";
    svc.backupDestBackupNotFound = "The save failed to restore. Failed to create a backup of the current save before restoration. Will not continue to prevent save corruption.";
    svc.backupDestSaveCorrupt = "The save failed to restore. Failed to create a backup of the current save before restoration. Will not continue to prevent save corruption.";
    svc.backupDeleted = "Save successfully deleted";
    svc.backupRenamed = "Save renamed successfully";
    svc.saveImported = "Save imported as ";
};


angular
    .module("app")
    .service("messages", ["$mdToast", messagesService]);