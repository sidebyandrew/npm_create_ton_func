import { toNano } from '@ton/core';
import { AnotherContractByBlueprintCreate } from '../wrappers/AnotherContractByBlueprintCreate';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const anotherContractByBlueprintCreate = provider.open(AnotherContractByBlueprintCreate.createFromConfig({}, await compile('AnotherContractByBlueprintCreate')));

    await anotherContractByBlueprintCreate.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(anotherContractByBlueprintCreate.address);

    // run methods on `anotherContractByBlueprintCreate`
}
