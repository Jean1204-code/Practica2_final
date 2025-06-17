import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import type Genero_1 from "./com/practica2/base/models/Genero.js";
import client_1 from "./connect-client.default.js";
async function create_1(nombre: string | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("GeneroServices", "create", { nombre }, init); }
async function listAllGenerosRaw_1(init?: EndpointRequestInit_1): Promise<Array<Genero_1 | undefined> | undefined> { return client_1.call("GeneroServices", "listAllGenerosRaw", {}, init); }
async function listGenero_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("GeneroServices", "listGenero", {}, init); }
async function update_1(id: number | undefined, nombre: string | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("GeneroServices", "update", { id, nombre }, init); }
export { create_1 as create, listAllGenerosRaw_1 as listAllGenerosRaw, listGenero_1 as listGenero, update_1 as update };
