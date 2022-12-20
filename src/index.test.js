async function 卡米狗試著回話(context) {
    // 先取 local 裡設定的最後一個，取不到才用 global 的

    const answer = '123';

    await context.sendText(answer);
    return;
}