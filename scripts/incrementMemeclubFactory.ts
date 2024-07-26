import { Address, toNano } from '@ton/core';
import { MemeclubFactory } from '../wrappers/MemeclubFactory';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run2(provider: NetworkProvider, args: string[]) {
    // ⚠️： 执行 npx blueprint run 后，
    // 会扫描 scripts 目录中的可执行 TypeScript 脚本
    //     ? Choose file to use incrementMemeclubFactory
    //     ? Which network do you want to use?
    //     ? Which network do you want to use? testnet
    //     ? Which wallet are you using? (Use arrow keys)
    //     ? Which wallet are you using? TON Connect compatible mobile wallet
    // 等待用户选择脚本文件名
    // 等待用户选择网络
    // 等待用户钱包模式（决定签名时交互方式）

    //uiProvider 用于界面交互
    let ui = provider.ui();

    // 这一行中的“await ui.input('MemeclubFactory address')” 比较有意思，它会等待一个用户输入
    let source = args.length > 0 ? args[0] : await ui.input('MemeclubFactory address');
    let address = Address.parse(source);

    // 判断合约是否部署了, 调用区块链网络查询
    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    // 根据地址打开合约（⚠️这里只是绑定了合约地址和合约的 wrappers 代码）
    const memeclubFactory =
        provider.open(MemeclubFactory.createFromAddress(address));

    // 根据地址和 TypeScript wrappers code，调用合约 get method
    const counterBefore = await memeclubFactory.getCounter();

    // send Increase 消息
    await memeclubFactory.sendIncrease(provider.sender(), {
        increaseBy: 1,
        value: toNano('0.05'),
    });

    ui.write('Waiting for counter to increase...');



}

export async function run(provider: NetworkProvider, args: string[]) {

    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('MemeclubFactory address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const memeclubFactory = provider.open(MemeclubFactory.createFromAddress(address));

    const counterBefore = await memeclubFactory.getCounter();

    await memeclubFactory.sendIncrease(provider.sender(), {
        increaseBy: 1,
        value: toNano('0.05'),
    });

    ui.write('Waiting for counter to increase...');

    let counterAfter = await memeclubFactory.getCounter();
    let attempt = 1;
    while (counterAfter === counterBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        counterAfter = await memeclubFactory.getCounter();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
