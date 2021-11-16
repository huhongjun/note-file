// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { NoteDecorationProvider } from './note';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "note-file" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('note-file.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from note-file!');
	});
	context.subscriptions.push(disposable);

	let fdp = NoteDecorationProvider.instance;
	fdp.updateFileDecoration();

	let watcher = vscode.workspace.createFileSystemWatcher('**/.vscode/file-notes.json', false /*ignoreCreateEvents*/, false /*ignoreChangeEvents*/, false /*ignoreDeleteEvents*/);
	watcher.onDidChange((e: vscode.Uri) => fdp.updateFileDecoration());
	watcher.onDidDelete((e: vscode.Uri) => vscode.window.showInformationMessage('delete'));
	watcher.onDidCreate((e: vscode.Uri) => vscode.window.showInformationMessage('create'));


	let setNote = vscode.commands.registerCommand("note-file.setNote", (uri: vscode.Uri) => { fdp.inputNote(uri) });
	context.subscriptions.push(setNote);
}

// this method is called when your extension is deactivated
export function deactivate() { }
