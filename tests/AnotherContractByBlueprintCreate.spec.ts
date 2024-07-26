import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { AnotherContractByBlueprintCreate } from '../wrappers/AnotherContractByBlueprintCreate';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('AnotherContractByBlueprintCreate', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('AnotherContractByBlueprintCreate');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let anotherContractByBlueprintCreate: SandboxContract<AnotherContractByBlueprintCreate>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        anotherContractByBlueprintCreate = blockchain.openContract(AnotherContractByBlueprintCreate.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await anotherContractByBlueprintCreate.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: anotherContractByBlueprintCreate.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and anotherContractByBlueprintCreate are ready to use
    });
});
