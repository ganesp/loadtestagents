# Load Test Agents - a VSTS extension to manage self-provisioned load test agents

[Cloud-based Load Testing Service](https://www.visualstudio.com/features/vso-cloud-load-testing-vs) can be used for performance and scale testing of an application by generating load from Azure. 
You can configure your own machines (physical/VMs) with Cloud-based Load Testing service (CLT) to do a load test run or you can provision the rig in your Azure subscription. This is primarily useful when you want to load test an application which is not publicly accessible or you want to have more control over the load test agents. 

To get more context around this, please refer: 
[Run cloud-based load tests using your own machines (a.k.a. Bring your own subscription)](https://blogs.msdn.microsoft.com/devops/2016/09/27/run-cloud-based-load-tests-using-your-own-machines-a-k-a-bring-your-own-subscription/)

To manage these self-provisioned load test agents, users can download a PowerShell script from: 
[Download powershell script to list down the registered machines](https://elsprodch2su1.blob.core.windows.net/ets-containerfor-loadagentresources/bootstrap/ManageVSTSCloudLoadAgent.ps1)

However, some of the operations supported by the script can be done using VSTS CLT REST APIs so we encapsulated these in a VSTS extension: **[Load Test Agents](https://marketplace.visualstudio.com/items?itemName=ganesp.loadtest-agents-extension)**, making it easier for users to list and delete load test agents without the need to move away from the VSTS portal.
