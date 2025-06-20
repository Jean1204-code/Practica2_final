import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import client_1 from "./connect-client.default.js";
async function create_1(nombre: string | undefined, fecha: string | undefined, id_banda: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("AlbumServices", "create", { nombre, fecha, id_banda }, init); }
async function listAlbum_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("AlbumServices", "listAlbum", {}, init); }
async function listBandaCombo_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("AlbumServices", "listBandaCombo", {}, init); }
async function update_1(id: number | undefined, nombre: string | undefined, fecha: string | undefined, id_banda: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("AlbumServices", "update", { id, nombre, fecha, id_banda }, init); }
export { create_1 as create, listAlbum_1 as listAlbum, listBandaCombo_1 as listBandaCombo, update_1 as update };
