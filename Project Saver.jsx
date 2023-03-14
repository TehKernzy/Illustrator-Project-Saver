/*
* Script Name: Project Saver
* Author: Keaton Burns
* Contact Info: Keatonisatwork@gmail.com
* Date: 3/14/2023
* Version: 1.0
* Description: Saves AI file in Project Folder
*/

// Project Folderpath
var parentFolderPath = "E:/Projects";
var userName = "JOhn"

// Run Script
mainScript();

// Get folders in Project Folder:
function getSubfolderNames(parentFolderPath) {
  var parentFolder = new Folder(parentFolderPath);
  var subfolders = parentFolder.getFiles(function (file) {
    return file instanceof Folder;
  });
  
  var folderNames = [];
  for (var i = 0; i < subfolders.length; i++) {
    var currentFolder = subfolders[i];
    folderNames.push(currentFolder.name);
  }
  
  return folderNames;
}
// Main Interface:
function mainScript() {
    getSubfolderNames("E:/Projects")
    // Main Dialog Window
    var popUp = new Window("dialog"); 
        popUp.text = userName + "'s Project Saver v1"; 
        popUp.orientation = "row"; 
        popUp.alignChildren = ["center","top"]; 
        popUp.spacing = 10; 
        popUp.margins = 16; 

    // Project Container
    var leftGroup = popUp.add("group", undefined, {name: "leftGroup"}); 
        leftGroup.orientation = "column"; 
        leftGroup.alignChildren = ["fill","center"]; 
        leftGroup.spacing = 10; 
        leftGroup.margins = 0; 

    // Outlined Box in Project Container
    var projectPanel = leftGroup.add("panel", undefined, undefined, {name: "projectPanel"}); 
        projectPanel.text = "Projects"; 
        projectPanel.orientation = "column"; 
        projectPanel.alignChildren = ["left","top"]; 
        projectPanel.spacing = 10; 
        projectPanel.margins = 10; 

var dropDown = projectPanel.add("dropdownlist", undefined, undefined, {name: "dropDown"}); 
dropDown.selection = 0; 
dropDown.preferredSize.width = 150; 

// populate the dropdown with folder names
var folderPath = "C:/Projects";
var folderNames = [];

var projectFolder = new Folder(folderPath);
if (projectFolder.exists) {
    var subfolders = projectFolder.getFiles(function (file) {return file instanceof Folder;});

    // sort subfolders by date modified in descending order
    subfolders.sort(function(a, b) {
        return b.modified - a.modified;
    });

    for (var i = 0; i < subfolders.length; i++) {
        var folderName = subfolders[i].displayName;
        folderNames.push(folderName);
    }
}

for (var i = 0; i < folderNames.length; i++) {
    dropDown.add("item", folderNames[i]);
}

// select the first item in the dropdown (i.e. the most recently modified/added folder)
dropDown.selection = 0;

    // New Project Button
    var creatNewButton = leftGroup.add("button", undefined, undefined, {name: "creatNewButton"}); 
        creatNewButton.text = "Create New Project";
        creatNewButton.onClick = function() {
            popUp.close();
            createNewProject();
        }

    // File Name Container
    var rightGroup = popUp.add("group", undefined, {name: "rightGroup"}); 
        rightGroup.orientation = "column"; 
        rightGroup.alignChildren = ["fill","center"]; 
        rightGroup.spacing = 10; 
        rightGroup.margins = 0; 

    // Outlined Box in File Name Group
    var filePanel = rightGroup.add("panel", undefined, undefined, {name: "filePanel"}); 
        filePanel.text = "File Name"; 
        filePanel.orientation = "column"; 
        filePanel.alignChildren = ["left","top"]; 
        filePanel.spacing = 10; 
        filePanel.margins = 10; 

    // File Name Field
    var fileName = filePanel.add('edittext {properties: {name: "fileName"}}'); 
        fileName.preferredSize.width = 200; 

    // Okay and Cancel Button
    var mainButtonGroup = rightGroup.add("group", undefined, {name: "mainButtonGroup"}); 
        mainButtonGroup.orientation = "row"; 
        mainButtonGroup.alignChildren = ["center","center"]; 
        mainButtonGroup.spacing = 10; 
        mainButtonGroup.margins = 0; 

    // Okay Button
    var mainCancButton = mainButtonGroup.add("button", undefined, undefined, {name: "mainCancButton"}); 
        mainCancButton.text = "Cancel"; 
        mainCancButton.preferredSize.width = 100; 

    // Cancel Button
    var mainOkayButton = mainButtonGroup.add("button", undefined, undefined, {name: "mainOkayButton"}); 
        mainOkayButton.text = "Okay"; 
        mainOkayButton.preferredSize.width = 100;
        mainOkayButton.onClick = function() {
            // alert("C:/Projects/" + dropDown.selection.text + "/" + fileName.text + ".ai");
            var file = new File("C:/Projects/" + dropDown.selection.text + "/" + fileName.text + ".ai");
            saveAsAiFile(file);
            popUp.close();
        }

    popUp.show();
}
// Saves AI File:
function saveAsAiFile(file) {
    var aiSaveOpts = new IllustratorSaveOptions();
        aiSaveOpts.embedLinkedFiles = true;
        aiSaveOpts.fontSubsetThreshold = 0.0;
        aiSaveOpts.pdfCompatible = true;
        aiSaveOpts.compressed = false;
        aiSaveOpts.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;
    
    app.activeDocument.saveAs(file, aiSaveOpts);
}
// New Project Folder Creation
function createNewProject() {
    // Create New Project Window
    var newProjectDialog = new Window("dialog", "New Project");
        newProjectDialog.alignChildren = "center";
        newProjectDialog.orientation = "column";
        newProjectDialog.margins = 20;

    // New Project Prompt
    var nameLabel = newProjectDialog.add("statictext", undefined, "Enter the name of the new project:");
    var nameField = newProjectDialog.add("edittext", undefined, "");
        nameField.characters = 20;

    // Okay and Cancel Button
    var buttonsGroup = newProjectDialog.add("group", undefined);
        buttonsGroup.alignment = "center";

    // Okay Button
    var okButton = buttonsGroup.add("button", undefined, "OK");
        okButton.onClick = function() {
        var projectName = nameField.text;
        if (projectName) {
            var projectFolder = new Folder("C:/Projects/" + projectName);
            if (!projectFolder.exists) {
                projectFolder.create();
                folderNames.push(projectName);
            }
        }
        newProjectDialog.close();
        mainScript();
        };

    // Cancel Button
    var cancelButton = buttonsGroup.add("button", undefined, "Cancel");
        cancelButton.onClick = function() {
        newProjectDialog.close();
        mainScript();
        };

    newProjectDialog.show();
    }
