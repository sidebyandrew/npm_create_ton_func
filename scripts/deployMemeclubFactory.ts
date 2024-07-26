import { toNano } from '@ton/core';
import { MemeclubFactory } from '../wrappers/MemeclubFactory';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const memeclubFactory = provider.open(
        MemeclubFactory.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('MemeclubFactory')
        )
    );

    await memeclubFactory.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(memeclubFactory.address);

    console.log('ID', await memeclubFactory.getID());
}
