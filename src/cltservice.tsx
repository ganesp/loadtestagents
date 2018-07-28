import * as Types from './types';
import VssContext = require("VSS/Context");
import Service = require("VSS/Service");
import Contracts_Platform = require("VSS/Common/Contracts/Platform");
import {CLTServiceHttpClient} from "./cltservicehttpclient";

export class CltService extends Service.VssService {
    public static webContext: Contracts_Platform.WebContext;
    public static connection: Service.VssConnection;
    private _httpClient: Types.ICltHttpClient;

    public initializeConnection(tfsConnection: Service.VssConnection) {
        super.initializeConnection(tfsConnection);
        this._httpClient = tfsConnection.getHttpClient<CLTServiceHttpClient>(CLTServiceHttpClient, CLTServiceHttpClient.serviceInstanceId);
    }

    public getHttpClient(): Types.ICltHttpClient {
        return this._httpClient;
    }

    public static getInstance(): CltService {
        if (!CltService._instance) {
            CltService.webContext = VssContext.getDefaultWebContext();
            CltService.connection = new Service.VssConnection(CltService.webContext);
            CltService._instance = CltService.connection.getService<CltService>(CltService);
        }
        return CltService._instance;
    }

    private static _instance: CltService;
}
