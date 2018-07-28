import * as React from 'react';
import { AgentGroup, ILoadTestAgent } from './types'
import { CltService } from "./cltservice";

export interface IBackgroundProps
{
    isRefresh: boolean;
    isDeleting: boolean;    
    onRefreshCompleted: IArgsFunctionR<any>;
    onDeleteCompleted: IArgsFunctionR<any>;
    getAgentsToDelete: IArgsFunctionR<any>;
}

export class Background extends React.Component<IBackgroundProps, {}> {
    constructor(props){
        super(props);
    }

    componentWillReceiveProps(nextProps: IBackgroundProps){
        if(nextProps.isRefresh){
            this.refresh();
        }

        if(nextProps.isDeleting){
            var agentsToDelete = nextProps.getAgentsToDelete();    
            this.deleteAgents(agentsToDelete);
        }
    }

    componentWillMount() {
        this.refresh();
    }

    public deleteAgents(agentsToDelete: ILoadTestAgent[]) {
        var deferreds = [];
        var self = this;
        agentsToDelete.forEach(agent => {
            deferreds.push(
            CltService.getInstance().getHttpClient().beginDeleteAgents(agent.agentGroupId, agent.agentName));
        });

        $.when.apply($, deferreds).done(function(){
            self.props.onDeleteCompleted(agentsToDelete);
        });
    }

    public refresh(){
        CltService.getInstance().getHttpClient().beginGetAgentGroups().then((agentGroups) => {
            if(agentGroups && agentGroups.length > 0){
                var deferreds = [];
                var self = this;
                agentGroups.forEach((agentGroup) => {
                    deferreds.push(
                        self.getAgents(agentGroup)
                    );
                });
                
                $.when.apply($, deferreds).done(function(){
                    var allAgents: ILoadTestAgent[] = [];
                    for (var i = 0; i < arguments.length; i++) {
                        var agents = arguments[i];
                        agents && agents.forEach(agent => {
                           allAgents.push(agent);
                        });
                    }
                    self.props.onRefreshCompleted(allAgents);
                });
            }
        });
    }

    private getAgents(agentGroup: AgentGroup) {
        var deferred = $.Deferred();
        CltService.getInstance().getHttpClient().beginGetAgents(agentGroup.groupId).then((agents) => {
            var loadtestAgents: ILoadTestAgent[] = [];
            if(agents && agents.length > 0) {
                agents.forEach((agent) => {
                    loadtestAgents.push({
                        agentName: agent.name,
                        iconName: "",
                        agentGroupName: agentGroup.groupName,
                        lastHeartbeat: agent.lastHeartBeat,
                        agentState: agent.state,
                        agentGroupId: agent.agentGroupId
                    });
                });
            }
            deferred.resolve(loadtestAgents);
        });
        return deferred.promise([]);
    }

    render(){
        return (<div />);
    }
}
