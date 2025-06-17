import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import client_1 from "./connect-client.default.js";
async function createBanda_1(nombre: string | undefined, fecha: string | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("BandaService", "createBanda", { nombre, fecha }, init); }
async function listBanda_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("BandaService", "listBanda", {}, init); }
async function updateBanda_1(id: number | undefined, nombre: string | undefined, fecha: string | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("BandaService", "updateBanda", { id, nombre, fecha }, init); }
export { createBanda_1 as createBanda, listBanda_1 as listBanda, updateBanda_1 as updateBanda };
