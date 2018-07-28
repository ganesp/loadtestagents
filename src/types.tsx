export interface ILoadTestAgent {
    [key: string]: any;
    agentGroupId: string;
    agentName: string;
    iconName: string;
    agentGroupName: string;
    lastHeartbeat: string;
    agentState: string;
}

export interface ILoadTestAgentWebApi {
    name: string;
    agentGroupName: string;
    agentGroupId: string;
    lastHeartBeat: string;
    state: string;
}

export interface AgentGroup {
    groupName: string;
    groupId: string;
}

export interface ICltHttpClient {
    beginGetAgents(agentGroupId: string): IPromise<ILoadTestAgentWebApi[]>;
    beginGetAgentGroups(): IPromise<AgentGroup[]>;
    beginDeleteAgents(agentGroupId: string, agentName: string): IPromise<void>;
}

export var CltAreaName = "clt";
export var AgentGroupsLocationId = "ab8d91c1-12d9-4ec5-874d-1ddb23e17720";
export var AgentsLocationId = "87e4b63d-7142-4b50-801e-72ba9ff8ee9b";
