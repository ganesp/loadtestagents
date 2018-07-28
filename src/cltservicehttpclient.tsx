import * as Types from './types';
import WebApi_RestClient = require("VSS/WebApi/RestClient");

export class CLTServiceHttpClient extends WebApi_RestClient.VssHttpClient implements Types.ICltHttpClient {
    public static serviceInstanceId = "6C404D78-EF65-4E65-8B6A-DF19D6361EAE";

    constructor(rootRequestPath: string, options?: WebApi_RestClient.IVssHttpClientOptions) {
        super(rootRequestPath, { showProgressIndicator: true });
    }

    public beginGetAgentGroups(): IPromise<Types.AgentGroup[]> {
        return this._beginRequest({
            area: Types.CltAreaName,
            httpMethod: 'GET',
            apiVersion: "1.0",
            locationId: Types.AgentGroupsLocationId
        });
    }

    public beginGetAgents(agentGroupId: string): IPromise<Types.ILoadTestAgentWebApi[]> {        
        return this._beginRequest({
            area: Types.CltAreaName,
            httpMethod: 'GET',
            apiVersion: "1.0",
            locationId: Types.AgentsLocationId,
            routeValues: {
                agentGroupId: agentGroupId
            }
        });
    }

    public beginDeleteAgents(agentGroupId: string, agentName: string): IPromise<void> {
        var queryValues: any = {agentName: agentName};

        return this._beginRequest({
            area: Types.CltAreaName,
            httpMethod: 'DELETE',
            apiVersion: "1.0",
            locationId: Types.AgentsLocationId,
            routeValues: {
                agentGroupId: agentGroupId
            },
            queryParams: queryValues
        });
    }
}
