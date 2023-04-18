import {BaseService} from "../base-service";
import * as lsp from "vscode-languageserver-protocol";
import {PHP} from "./lib/php";
import {LanguageService, PhpServiceOptions} from "../../types";

export class PhpService extends BaseService<PhpServiceOptions> implements LanguageService {
    $service;

    constructor(mode: string) {
        super(mode);
    }

    async doValidation(document: lsp.TextDocumentIdentifier): Promise<lsp.Diagnostic[]> {
        let value = this.getDocumentValue(document.uri);
        if (!value)
            return [];
        if (this.getOption(document.uri, "inline")) {
            value = "<?" + value + "?>";
        }
        var tokens = PHP.Lexer(value, {short_open_tag: 1});
        let errors: lsp.Diagnostic[] = [];
        try {
            new PHP.Parser(tokens);
        } catch (e) {
            errors.push({
                range: {
                    start: {
                        line: e.line - 1,
                        character: 0
                    },
                    end: {
                        line: e.line - 1,
                        character: 0
                    }
                },
                message: e.message.charAt(0).toUpperCase() + e.message.substring(1),
                severity: 1
            });
        }
        return errors;
    }

}
