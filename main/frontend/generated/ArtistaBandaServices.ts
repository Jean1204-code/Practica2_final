import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import client_1 from "./connect-client.default.js";
async function listAll_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("ArtistaBandaServices", "listAll", {}, init); }
async function order_1(attribute: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("ArtistaBandaServices", "order", { attribute, type }, init); }
async function search_1(attribute: string | undefined, text: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("ArtistaBandaServices", "search", { attribute, text, type }, init); }
export { listAll_1 as listAll, order_1 as order, search_1 as search };
