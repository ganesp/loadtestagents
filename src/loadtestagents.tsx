import * as React from 'react';
import {
  DetailsList,
  DetailsListLayoutMode,
  ConstrainMode,
  Selection,
  SelectionMode,
  IColumn
} from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { Background } from './background';
import { ILoadTestAgent } from './types';
import { Overlay } from './Overlay';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem, ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';
import { IconType } from 'office-ui-fabric-react/lib/Icon';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { Button, ButtonType } from 'office-ui-fabric-react/lib/Button';
import Utils_Core = require("VSS/Utils/Core");

var delegate = Utils_Core.delegate;

export interface ILoadTestAgentsState {
  columns: IColumn[];
  items: ILoadTestAgent[];
  allItems: ILoadTestAgent[];
  selectionDetails: string;
  isModalSelection: boolean;
  isCompactMode: boolean;
  isRefreshing: boolean;
  isDeleting: boolean;
  isDeleteDialogOpen: boolean;
  isWarningDialogOpen: boolean;
}

export class LoadTestAgents extends React.Component<any, ILoadTestAgentsState> {
  private _selection: Selection;
  private _blogLink: string = "https://blogs.msdn.microsoft.com/devops/2016/09/27/run-cloud-based-load-tests-using-your-own-machines-a-k-a-bring-your-own-subscription/";

  constructor(props: any) {
    super(props);

    const _columns: IColumn[] = [
      {
        key: 'column1',
        name: 'Agent Name',
        fieldName: 'agentName',
        minWidth: 200,
        maxWidth: 250,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true
      },
      {
        key: 'column2',
        name: 'Agent Group',
        fieldName: 'agentGroupName',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsable: true,
        data: 'string',
        onColumnClick: this._onColumnClick,
        onRender: (item: ILoadTestAgent) => {
          return (
            <span>
              { item.agentGroupName }
            </span>
          );
        },
        isPadded: true
      },
      {
        key: 'column3',
        name: 'State',
        fieldName: 'agentState',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsable: true,
        data: 'number',
        onColumnClick: this._onColumnClick,
        onRender: (item: ILoadTestAgent) => {
          return (
            <span>
              { item.agentState }
            </span>
          );
        }
      },
      {
        key: 'column4',
        name: 'Last heartbeat',
        fieldName: 'lastHeartbeat',
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
        onColumnClick: this._onColumnClick,
        data: 'number',
        onRender: (item: ILoadTestAgent) => {
          return (
            <span>
              { item.lastHeartbeat }
            </span>
          );
        },
        isPadded: true
      }
    ];

    this._selection = new Selection({
      onSelectionChanged: () => {
        this.setState({
          selectionDetails: this._getSelectionDetails(),
          isModalSelection: this._selection.isModal()
        });
      }
    });

    this.state = {
      items: [],
      allItems: [],
      columns: _columns,
      selectionDetails: this._getSelectionDetails(),
      isModalSelection: this._selection.isModal(),
      isCompactMode: false,
      isRefreshing: true,
      isDeleting: false,
      isDeleteDialogOpen: false,
      isWarningDialogOpen: false
    };
  }

  public render() {
    const { columns, isCompactMode, items, selectionDetails } = this.state;
    var commandBarItems: IContextualMenuItem[] = [];
    commandBarItems.push( 
        {
          key: "search-box",
          name: "Search",
          onRender: () => {
            return (
              <div style={{ marginTop: '4px', display: 'inline-block', minWidth: '200px' }}>
                <SearchBox
                  onChange={ this._onChangeText }
                />
              </div>
              )
          }
        },
        {
          key: "divider1",
          itemType: ContextualMenuItemType.Divider
        },
        { 
          key: "refresh-button", 
          name: "Refresh", 
          itemType: ContextualMenuItemType.Normal,
          iconProps: { iconType: IconType.Default, iconName: "Refresh" },
          disabled: this._isBusy(),
          onClick: () => {          
            this.setState({ items: [], allItems: [], columns: columns, isRefreshing: true });
          }
        },
        {
          key: "divider2",
          itemType: ContextualMenuItemType.Divider
        },
        { 
          key: "delete-button", 
          name: "Delete", 
          itemType: ContextualMenuItemType.Normal,
          iconProps: { iconType: IconType.Default, iconName: "Delete" },
          disabled: this._isBusy(),
          onClick: () => {
            var agentsToDelete = this.getAgentsToDelete();
            var isValidOperation: boolean = true;

            if(!agentsToDelete || agentsToDelete.length === 0){
              isValidOperation = false;
            }

            agentsToDelete.forEach((agent)=>{
              if(agent.agentState !== "Offline"){
                isValidOperation = false;
              }
            });

            if(isValidOperation) {
              this.setState({ isDeleteDialogOpen: true });
            } else {
              this.setState({ isWarningDialogOpen: true });
            }
          }
        },
        {
          key: "divider3",
          itemType: ContextualMenuItemType.Divider
        },
        { 
          key: "learnmore-button", 
          name: "Learn more", 
          itemType: ContextualMenuItemType.Normal,
          iconProps: { iconType: IconType.Default, iconName: "Info" },
          onClick: () => {
            window.open(this._blogLink,'_blank');
          }
        }
      );

    var onDeleteCancel = delegate(this, this.onDeleteCancel);
    var onDeleteAccepted = delegate(this, this.onDeleteAccepted);
    var onWarningAccepted = delegate(this, this.onWarningAccepted);
    var onDeleteCompleted = delegate(this, this.onDeleteCompleted);
    var onRefreshCompleted = delegate(this, this.onRefreshCompleted);
    var getAgentsToDelete = delegate(this, this.getAgentsToDelete);

    return (
      <div>
          <CommandBar
            items={commandBarItems}
           />
        <Overlay 
          spinnerText="Loading agent list..."
          visible={ this.state.isRefreshing }
          >          
        </Overlay>
        <Dialog
            title='Delete load test agents'
            type={ DialogType.close }
            isOpen={ this.state.isWarningDialogOpen }
            isBlocking={true}
          >
          One or more agents are not in offline state. Please stop the VSTSLoadAgentService on the agent or delete the machine/VM and retry.
          <DialogFooter>
            <Button 
              buttonType={ ButtonType.primary } 
              onClick={ onWarningAccepted }
            >OK</Button>
          </DialogFooter>
        </Dialog>
        <Dialog
            title='Delete load test agents'
            type={ DialogType.close }
            isOpen={ this.state.isDeleteDialogOpen }
            isBlocking={true}
            onDismiss={ onDeleteCancel }
          >
          Are you sure you want to delete these agents?
          <DialogFooter>
            <Button 
              buttonType={ ButtonType.primary } 
              onClick={ onDeleteAccepted }
            >Delete</Button>
            <Button 
              onClick={ onDeleteCancel }
            >Cancel</Button>
          </DialogFooter>
        </Dialog>
        <MarqueeSelection selection={ this._selection }>
          <DetailsList
            items={ items }
            compact={ false }
            columns={ columns }
            selectionMode={ SelectionMode.multiple }
            setKey='set'
            isHeaderVisible={ true }
            selection={ this._selection }
            selectionPreservedOnEmptyClick={ true }
            onItemInvoked={ this._onItemInvoked }
            enterModalSelectionOnTouch={ true }
            constrainMode={ConstrainMode.unconstrained}
            layoutMode={DetailsListLayoutMode.justified}
          />
        </MarqueeSelection>
        <Background
          isRefresh={ this.state.isRefreshing }
          isDeleting={ this.state.isDeleting }
          onRefreshCompleted={ onRefreshCompleted }
          onDeleteCompleted={ onDeleteCompleted }
          getAgentsToDelete={ getAgentsToDelete }
        />
      </div>
    );
  }

  public onDeleteCancel() {
    this.setState({ isDeleteDialogOpen: false, isDeleting: false });
  }

  public onWarningAccepted() {
    this.setState({ isWarningDialogOpen: false });
  }

  public onDeleteAccepted() {
    this.setState({ isDeleteDialogOpen: false, isDeleting: true });
  }

  public onDeleteCompleted(deletedAgents: ILoadTestAgent[]) {

    var newSelectedItems = this.state.items.filter((agent) => {
      return !this.isAgentDeleted(agent, deletedAgents);
    });
    
    var newItems = this.state.allItems.filter((agent) => {
      return !this.isAgentDeleted(agent, deletedAgents);
    });

    this.setState({ items: newSelectedItems, allItems: newItems, isDeleting: false });
  }

  private isAgentDeleted(agent: ILoadTestAgent, deletedAgents: ILoadTestAgent[]) : boolean {
    var deleted = deletedAgents.filter((deletedAgent)=>{
      return deletedAgent.agentGroupName === agent.agentGroupName && deletedAgent.agentName === agent.agentName;
    });
    return !(deleted === undefined || deleted.length === 0);
  }

  public getAgentsToDelete() : ILoadTestAgent[] {
    var agentsToDelete: ILoadTestAgent[] = [];
    var selection = this._selection.getSelection();
    selection.forEach((row, index) => {
      agentsToDelete.push(selection[index] as ILoadTestAgent);
    });
    return agentsToDelete;
  }

  public onRefreshCompleted (agents: ILoadTestAgent[]) : void {
    const { columns } = this.state;
    this.setState({ items: agents, allItems: agents, columns: columns, isRefreshing: false });
  }

  public componentDidUpdate(previousProps: any, previousState: ILoadTestAgentsState) {
    if (previousState.isModalSelection !== this.state.isModalSelection) {
      this._selection.setModal(this.state.isModalSelection);
    }
  }

  private _isBusy() : boolean
  {
    return this.state.isRefreshing || this.state.isDeleting
  }

  private _onChangeText = (text: any): void => {
    text = text ? text.toLowerCase() : text;
    this.setState({ 
      items: text ? 
        this.state.allItems.filter(
          agent => 
            (agent.agentName.toLowerCase().indexOf(text) > -1 
            || agent.agentGroupName.toLowerCase().indexOf(text) > -1
            || agent.agentState.toLowerCase().indexOf(text) > -1)
          ) 
      : this.state.allItems });
  }

  private _onItemInvoked(item: any): void {
    alert(`Item invoked: ${item.name}`);
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as any).name;
      default:
        return `${selectionCount} items selected`;
    }
  }

  private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const { columns, items } = this.state;
    let newItems: ILoadTestAgent[] = items.slice();
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter((currCol: IColumn, idx: number) => {
      return column.key === currCol.key;
    })[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    newItems = this._sortItems(newItems, currColumn.fieldName, currColumn.isSortedDescending);
    this.setState({
      columns: newColumns,
      items: newItems
    });
  }

  private _sortItems = (items: ILoadTestAgent[], sortBy: string, descending = false): ILoadTestAgent[] => {
    if (descending) {
      return items.sort((a: ILoadTestAgent, b: ILoadTestAgent) => {
        if (a[sortBy] < b[sortBy]) {
          return 1;
        }
        if (a[sortBy] > b[sortBy]) {
          return -1;
        }
        return 0;
      });
    } else {
      return items.sort((a: ILoadTestAgent, b: ILoadTestAgent) => {
        if (a[sortBy] < b[sortBy]) {
          return -1;
        }
        if (a[sortBy] > b[sortBy]) {
          return 1;
        }
        return 0;
      });
    }
  }
}
