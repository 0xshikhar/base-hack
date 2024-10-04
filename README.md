
# NebulaID

## Test it yourself!
1. Clone this repo, install [rust](https://www.rust-lang.org/tools/install), [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) and [foundry](https://getfoundry.sh/)
2. Run the offchain TLSN verifier: `cd  tlsn-verifier; cargo r -r`
3. In another terminal, install yarn dependencies: `cd  semaphore; yarn`
4. Compile the Semaphore smart contracts: `cd apps/contracts; yarn compile`
5. Run the webapp and the Semaphore smart contracts: `cd ../..; yarn dev`
6. Browse http://localhost:3000 and have fun!
