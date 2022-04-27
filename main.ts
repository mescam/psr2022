import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { AppServicePlan, AzurermProvider, FunctionApp, ResourceGroup, StorageAccount } from "@cdktf/provider-azurerm";

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const location = "westeurope";

    new AzurermProvider(this, "AzureRMProvider", {
      features: {}
    });

    const rg = new ResourceGroup(this, "RG", {
      name: "rg-jakubwozniak-sandbox-003",
      location
    });

    const sa = new StorageAccount(this, "SA", {
      accountReplicationType: "LRS",
      resourceGroupName: rg.name,
      name: "sajakubwozniak004",
      location,
      accountTier: "Standard"
    });

    const appserviceplan = new AppServicePlan(this, "AppServicePlan",{
      resourceGroupName: rg.name,
      name: "appserviceplan-jakubwozniak-sandbox-003",
      location,
      sku: {
        tier: "Dynamic",
        size: "Y1",
      },
      kind: "functionapp",
      reserved: true
    });

    new FunctionApp(this, "FunctionApp", {
      appServicePlanId: appserviceplan.id,
      resourceGroupName: rg.name,
      location,
      name: "functionapp-jakubwozniak-sandbox-003",
      storageAccountName: sa.name,
      storageAccountAccessKey: sa.primaryAccessKey,
      version: "~2",
      osType: "linux"
    });
    
  }
}

const app = new App();
new MyStack(app, "cdktf-app2");
app.synth();
