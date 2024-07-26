import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type AnotherContractByBlueprintCreateConfig = {};

export function anotherContractByBlueprintCreateConfigToCell(config: AnotherContractByBlueprintCreateConfig): Cell {
    return beginCell().endCell();
}

export class AnotherContractByBlueprintCreate implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new AnotherContractByBlueprintCreate(address);
    }

    static createFromConfig(config: AnotherContractByBlueprintCreateConfig, code: Cell, workchain = 0) {
        const data = anotherContractByBlueprintCreateConfigToCell(config);
        const init = { code, data };
        return new AnotherContractByBlueprintCreate(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
