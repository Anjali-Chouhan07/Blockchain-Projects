async function main() {
  const Cert = await ethers.getContractFactory("CertificateVerification");
  const cert = await Cert.deploy();
  await cert.deployed();

  console.log("CertificateVerification deployed to:", cert.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
