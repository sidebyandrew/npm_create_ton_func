import { toNano } from '@ton/core';
import { MemeclubFactory } from '../wrappers/MemeclubFactory';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run2(provider: NetworkProvider) {


    // ⚠️ 每个合约有2个核心数据， code（编译后的代码） 和 data（初始化数据）
    // const init = { code, data };

    // 初始化数据构造 config
    let config = {id:Math.floor(Math.random()*10000000),counter:1};

    //  代码编译成 Cell
    let codeCell = await compile('MemeclubFactory');
    let memeclubFactory =
        MemeclubFactory.createFromConfig(config, codeCell);

    let openedContract = provider.open(memeclubFactory);

    await openedContract.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(openedContract.address);
    console.log('ID', await openedContract.getID());
}
export async function run(provider: NetworkProvider) {
    const memeclubFactory = provider.open(
        MemeclubFactory.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000), // [0, 9999] 个 ID，很容易碰撞的
                counter: 0,
            },
            await compile('MemeclubFactory')
        )
    );

    await memeclubFactory.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(memeclubFactory.address);

    console.log('ID', await memeclubFactory.getID());
}
