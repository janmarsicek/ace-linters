import {ServiceManager} from "ace-linters/services/service-manager";

let manager = new ServiceManager(self);

manager.registerService("html", {
    module: () => import("ace-linters/services/html/html-service"),
    className: "HtmlService",
    modes: "html"
});
