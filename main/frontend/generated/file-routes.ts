import { createRoute as createRoute_1 } from "@vaadin/hilla-file-router/runtime.js";
import type { AgnosticRoute as AgnosticRoute_1 } from "@vaadin/hilla-file-router/types.js";
import * as Page_1 from "../views/@index.js";
import * as Layout_1 from "../views/@layout.js";
import * as Page_2 from "../views/artista-list.js";
import * as Page_3 from "../views/banda-list.js";
import * as Page_4 from "../views/Cancion-list.js";
import * as Page_5 from "../views/task-list.js";
const routes: readonly AgnosticRoute_1[] = [
    createRoute_1("", Layout_1, [
        createRoute_1("", Page_1),
        createRoute_1("artista-list", Page_2),
        createRoute_1("banda-list", Page_3),
        createRoute_1("Cancion-list", Page_4),
        createRoute_1("task-list", Page_5)
    ])
];
export default routes;
