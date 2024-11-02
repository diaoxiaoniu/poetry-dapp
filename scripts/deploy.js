async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("使用账户部署:", deployer.address);
  console.log("账户余额:", (await deployer.getBalance()).toString());

  console.log("开始部署 Poetry 合约...");
  const Poetry = await ethers.getContractFactory("Poetry");
  console.log("合约工厂创建成功");

  const poetry = await Poetry.deploy();
  console.log("合约部署交易已发送");

  console.log("等待合约部署确认...");
  await poetry.deployed();

  console.log("Poetry 合约部署成功！");
  console.log("合约地址:", poetry.address);

  // 验证合约部署
  console.log("尝试调用合约方法验证部署...");
  const poemCount = await poetry.getPoemCount();
  console.log("当前诗歌数量:", poemCount.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("部署出错:");
    console.error(error);
    process.exit(1);
  }); 