module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    ganache: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    },
    chainskills: {
      host: "localhost",
      port: 8545,
      network_id: "4224",
      gas: 4700000,
      from: '0x433e1b5c05ee4483c5b2c637dcadd607770ffb77'
    }
  }
};