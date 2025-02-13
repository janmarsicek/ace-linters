import "ace-code/esm-resolver";
import * as event from "ace-code/src/lib/event";
import {HashHandler} from "ace-code/src/keyboard/hash_handler";
import * as keyUtil from "ace-code/src/lib/keys";
import {jsonContent} from "../docs-example/json-example";

import {json5Content, json5Schema} from "../docs-example/json5-example";

import {createEditorWithLSP} from "../utils";
import {AceLanguageClient} from "ace-linters/build/ace-language-client";
import {LanguageClientConfig} from "ace-linters/types/types/language-service";


let modes = [
    {name: "json", mode: "ace/mode/json", content: jsonContent, options: {jsonSchemaUri: "common-form.schema.json"}},
    {name: "json5", mode: "ace/mode/json5", content: json5Content, options: {jsonSchemaUri: json5Schema}},
]

const serverData: LanguageClientConfig = {
    module: () => import("ace-linters/build/language-client"),
    modes: "json|json5",
    type: "socket",
    socket: new WebSocket("ws://127.0.0.1:3000/exampleServer"),
}

let languageProvider = AceLanguageClient.for(serverData);
let i = 0;
for (let mode of modes) {
    createEditorWithLSP(mode, i, languageProvider);
    i++;
}

let menuKb = new HashHandler([
    {
        bindKey: "Ctrl-Shift-B",
        name: "format",
        exec: function () {
            languageProvider.format();
        }
    }
]);

event.addCommandKeyListener(window, function (e, hashId, keyCode) {
    let keyString = keyUtil.keyCodeToString(keyCode);
    let command = menuKb.findKeyCommand(hashId, keyString);
    if (command) {
        command.exec();
        e.preventDefault();
    }
});
