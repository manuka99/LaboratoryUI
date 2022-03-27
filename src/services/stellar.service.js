import StellarSdk from "stellar-sdk";
import {
  BLOCKCHAIN_NETWORK_URI,
  BLOCKCHAIN_NETWORK_NAME,
  BLOCKCHAIN_NETWORK_BASE_RESERVE_VALUE,
  BLOCKCHAIN_NETWORK_BASE_FEE_VALUE
} from "@/services/config";
const server = new StellarSdk.Server(BLOCKCHAIN_NETWORK_URI);
import { camelCaseToCapitalizeWords, toCamelCaseV1 } from "@/util/common";

export const SubmitTransactionsAPI = async xdr => {
  return new Promise((resolve, reject) => {
    const server = new StellarSdk.Server(BLOCKCHAIN_NETWORK_URI);
    const transaction = new StellarSdk.Transaction(
      xdr,
      BLOCKCHAIN_NETWORK_NAME
    );
    server
      .submitTransaction(transaction)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

const getBalance = (account, currency) => {
  let balance = 0;
  if (currency == "XLM") {
    balance = Number.parseFloat(
      account.balances.find(b => b.asset_type == "native").balance
    );
  } else {
    balance = Number.parseFloat(
      account.balances.find(b => b.asset_code == currency).balance
    );
  }
  return balance;
};

const getAllBalances = account => {
  var assets = {};
  for (let index = 0; index < account.balances.length; index++) {
    const asset = account.balances[index];
    if (asset.asset_type == "native") assets.native = asset.balance;
    else assets[`${asset.asset_code}-${asset.asset_issuer}`] = asset.balance;
  }
  return assets;
};

const CalculateAccountReserves = account => {
  var reserves = 0;
};

export const GetAccountNativeBalance = async id => {
  return new Promise(resolve => {
    server
      .loadAccount(id)
      .then(account => resolve(getBalance(account, "XLM")))
      .catch(() => resolve(null));
  });
};

export const GetAccount = async id => {
  return new Promise(resolve => {
    server
      .loadAccount(id)
      .then(account => resolve(account))
      .catch(() => resolve(null));
  });
};

// submit txn
export const SubmitXdr = async xdr => {
  return new Promise((resolve, reject) => {
    const transaction = StellarSdk.TransactionBuilder.fromXDR(
      xdr,
      BLOCKCHAIN_NETWORK_NAME
    );
    server
      .submitTransaction(transaction)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

// group operations based on signers
export const GroupTxOpsSigners = (
  txnXdr,
  includeAllOp = false,
  isFormat = false
) => {
  const tx = StellarSdk.TransactionBuilder.fromXDR(
    txnXdr,
    BLOCKCHAIN_NETWORK_NAME
  );

  const txSource = tx.source;
  const xdrOperations = {};

  if (includeAllOp) xdrOperations["All Operations"] = tx.operations;

  xdrOperations[txSource] = [];

  // add operations based on account
  for (let index = 0; index < tx.operations.length; index++) {
    const operation = tx.operations[index];

    // detamine operation source
    var source = txSource;
    if (operation.source) source = operation.source;

    // if sponsoring add its sponsoring operations
    if (operation.type == "beginSponsoringFutureReserves") {
      var sponsoringEndOpId = tx.operations
        .slice(index + 1)
        .findIndex(
          op =>
            op.type == "endSponsoringFutureReserves" &&
            op.source == operation.sponsoredId
        );
      if (sponsoringEndOpId != -1) {
        sponsoringEndOpId = index + sponsoringEndOpId + 1;
        operation["sponsoringOperations"] = tx.operations.slice(
          index + 1,
          sponsoringEndOpId
        );
      }
    }

    // add to list
    if (!xdrOperations[source]) xdrOperations[source] = [];
    xdrOperations[source].push(operation);
  }

  // format filtered operations
  if (isFormat) {
    for (let index2 = 0; index2 < Object.keys(xdrOperations).length; index2++) {
      var key = Object.keys(xdrOperations)[index2];
      var value = xdrOperations[key];
      var formattedOperations = FormatTXOperations(value);
      xdrOperations[key] = formattedOperations;
    }
  }

  return xdrOperations;
};

export const FormatTXOperations = operations => {
  const newOps = [];
  for (let index = 0; index < operations.length; index++) {
    var operation = operations[index];
    operation.type = camelCaseToCapitalizeWords(operation.type);
    try {
      const fOp = FormatTXValues(operation);
      operation = fOp;
    } catch (error) {}
    newOps.push(operation);
  }
  return newOps;
};

export const FormatTXValues = param => {
  if (param instanceof Uint8Array) return Buffer.from(param).toString("hex");
  else if (Buffer.isBuffer(param)) return param.toString();
  else if (Array.isArray(param)) {
    var newArray = [];
    for (let index = 0; index < param.length; index++) {
      const element = param[index];
      const value = FormatTXValues(element);
      newArray.push(value);
    }
    return newArray;
  } else if (param instanceof Object) {
    var newOb = {};
    // const stringified = JSON.stringify(param);
    // const parsed = JSON.parse(stringified);
    for (let index = 0; index < Object.keys(param).length; index++) {
      const key = Object.keys(param)[index];
      const value = FormatTXValues(param[key]);
      const newKey = camelCaseToCapitalizeWords(key);
      newOb[newKey] = value;
    }
    return newOb;
  } else return param;
};

// CalculateTxAccountReserves
export const CalculateTxAccountReserves = async (accountID, txnXdr) => {
  const tx = StellarSdk.TransactionBuilder.fromXDR(
    txnXdr,
    BLOCKCHAIN_NETWORK_NAME
  );
  const operations = tx.operations;
  if (!operations) return null;

  const account = await GetAccount(accountID);
  // if (!account) return null;

  const txSource = tx.source;
  var reserves = 0;

  for (let index = 0; index < operations.length; ) {
    const operation = operations[index];
    const operationSource = operation.source ? operation.source : txSource;
    operation.source = operationSource;

    if (operation.type == "beginSponsoringFutureReserves") {
      // get the end of sponsoring
      var sponsoringEndOpId = operations
        .slice(index + 1)
        .findIndex(
          op =>
            op.type == "endSponsoringFutureReserves" &&
            op.source == operation.sponsoredId
        );

      // start of the endSponsoringFutureReserves index
      if (sponsoringEndOpId != -1) {
        sponsoringEndOpId = index + sponsoringEndOpId + 1;
      } else sponsoringEndOpId = operations.length - 1;

      if (accountID != operationSource) {
        // if the current account has not initiated the sponsor, then skip it
        index = sponsoringEndOpId + 1;
        continue;
      } else {
        // add the reserves
        const sponsoringOperations = operations.slice(
          index + 1,
          sponsoringEndOpId
        );

        for (let index2 = 0; index2 < sponsoringOperations.length; index2++) {
          const sponsoringOperation = sponsoringOperations[index2];
          reserves =
            reserves +
            CalculateOperationReserves(account, sponsoringOperation, false);
          index++;
        }
        index++;
        continue;
      }
    }

    if (accountID == operationSource)
      reserves =
        reserves + CalculateOperationReserves(account, operation, false);

    index++;
  }

  // console.log(reserves);

  return reserves;
};

export const CalculateOperationReserves = (
  account,
  operation,
  isCompareSource = true
) => {
  var reserves = 0;

  if (isCompareSource && (!account || account.account_id != operation.source))
    return reserves;

  switch (operation.type) {
    case "createAccount":
      reserves = 2;
      break;

    case "manageData":
      if (
        !account ||
        (operation.value &&
          !Object.keys(account.data_attr).includes(operation.name))
      )
        reserves = 1;
      break;

    case "changeTrust":
      if (
        !account ||
        (operation.limit > 0 &&
          account.balances.findIndex(
            cnt =>
              cnt.asset_code == operation.line.code &&
              cnt.asset_issuer == operation.line.issuer
          ) == -1)
      )
        reserves = 1;
      break;

    case "setOptions":
      if (!operation.signer) break;

      var opSignerEntries = Object.entries(operation.signer);
      var opSignerType = MapOpSignerTypeToAPI(opSignerEntries[0][0]);
      var opSignerValue = opSignerEntries[0][1];
      var opSignerWeight = opSignerEntries[1][1];

      if (opSignerWeight == 0) break;

      if (opSignerValue instanceof Uint8Array)
        opSignerValue = Buffer.from(opSignerValue).toString("hex");

      if (
        !account ||
        account.signers.findIndex(cnt => {
          var { type, key } = cnt;
          if (type == "sha256_hash")
            key = StellarSdk.StrKey.decodeSha256Hash(key).toString("hex");
          if (type == "preauth_tx")
            key = StellarSdk.StrKey.decodePreAuthTx(key).toString("hex");
          return type == opSignerType && key == opSignerValue;
        }) == -1
      )
        reserves = 1;
      break;
    case "createClaimableBalance":
      reserves = operation.claimants.length;
      break;

    case "manageSellOffer":
      const { offerId, amount } = operation;
      if (offerId == 0 && amount > 0) reserves = 1;
      break;

    case "createPassiveSellOffer":
      reserves = 1;
      break;

    default:
      break;
  }
  return reserves * parseFloat(BLOCKCHAIN_NETWORK_BASE_RESERVE_VALUE);
};

const MapOpSignerTypeToAPI = opSignerType => {
  var apiSignerType = null;
  switch (opSignerType) {
    case "ed25519PublicKey":
      apiSignerType = "ed25519_public_key";
      break;
    case "sha256Hash":
      apiSignerType = "sha256_hash";
      break;
    case "preAuthTx":
      apiSignerType = "preauth_tx";
      break;
    default:
      break;
  }

  return apiSignerType;
};

// get transaction rish for account
export const AccountRiskLevelForTransaction = async (accountID, txnXdr) => {
  const tx = StellarSdk.TransactionBuilder.fromXDR(
    txnXdr,
    BLOCKCHAIN_NETWORK_NAME
  );
  const operations = tx.operations;
  if (!operations) return null;

  const account = await GetAccount(accountID);
  if (!account) return null;

  const txSource = tx.source;

  var signerRisk = 0;

  for (let index = 0; index < operations.length; index++) {
    const operation = operations[index];
    const operationSource = operation.source ? operation.source : txSource;
    operation.source = operationSource;

    if (accountID != operationSource) continue;

    var operationRisk = null;

    // 1 - low, 2 - medium, 3-high

    switch (operation.type) {
      case "createAccount":
        operationRisk = 2;
        break;
      case "payment":
        operationRisk = 2;
        break;
      case "pathPaymentStrictSend":
        operationRisk = 2;
        break;
      case "pathPaymentStrictReceive":
        operationRisk = 2;
        break;
      case "manageBuyOffer":
        operationRisk = 2;
        break;
      case "manageSellOffer":
        operationRisk = 2;
        break;
      case "createPassiveSellOffer":
        operationRisk = 2;
        break;
      case "setOptions":
        operationRisk =
          Object.entries(operation)
            .map(
              entry =>
                !["type", "source"].includes(entry[0]) && entry[1] && entry
            )
            .filter(n => n).length == 0
            ? 2
            : 3;
        break;
      case "changeTrust":
        operationRisk = 2;
        break;
      case "allowTrust":
        operationRisk = 1;
        break;
      case "accountMerge":
        operationRisk = 3;
        break;
      case "manageData":
        operationRisk = 2;
        break;
      case "bumpSequence":
        operationRisk = 1;
        break;
      case "createClaimableBalance":
        operationRisk = 2;
        break;
      case "claimClaimableBalance":
        operationRisk = 1;
        break;
      case "beginSponsoringFutureReserves":
        operationRisk = 2;
        break;
      case "endSponsoringFutureReserves":
        operationRisk = 2;
        break;
      case "revokeSponsorship":
        operationRisk = 2;
        break;
      case "clawback":
        operationRisk = 2;
        break;
      case "clawbackClaimableBalance":
        operationRisk = 2;
        break;
      case "setTrustLineFlags":
        operationRisk = 1;
        break;
      case "liquidityPoolDeposit":
        operationRisk = 2;
        break;
      case "liquidityPoolWithdraw":
        operationRisk = 2;
        break;
      default:
        break;
    }

    if (!operationRisk) continue;
    else if (!signerRisk || operationRisk > signerRisk)
      signerRisk = operationRisk;
  }

  return signerRisk;

  switch (signerRisk) {
    case 1:
      return "low";
    case 2:
      return "medium";
    case 3:
      return "high";
    default:
      return null;
  }
};

// get transaction pre auth signatures
export const TransactionPreAuthSignatures = async txnXdr => {
  const tx = StellarSdk.TransactionBuilder.fromXDR(
    txnXdr,
    BLOCKCHAIN_NETWORK_NAME
  );
  const txHash = tx.hash().toString("hex");
  const signers = Object.keys(GroupTxOpsSigners(txnXdr));
  const preAuthSigners = {};
  for (let index = 0; index < signers.length; index++) {
    const signer = signers[index];
    let account = await GetAccount(signer);
    if (account && account.signers) {
      const thresholds = account.thresholds;
      const sign = account.signers.find(signerV2 => {
        if (signerV2.type != "preauth_tx") return false;
        let signerV2Key = StellarSdk.StrKey.decodePreAuthTx(
          signerV2.key
        ).toString("hex");
        return signerV2Key == txHash;
      });
      if (sign)
        preAuthSigners[signer] = {
          thresholds,
          sign
        };
    }
  }
  return preAuthSigners;
};

// XDR Transactions

export const SponsoringTxBuilder = async (
  sponsorID,
  sponsoredKeypair,
  startingBalance
) => {
  const sponsor = await GetAccount(sponsorID);
  if (!sponsor)
    throw new Error(
      "Error: Account does not exist, fund your account and try again."
    );

  var tx = new StellarSdk.TransactionBuilder(sponsor, {
    fee: BLOCKCHAIN_NETWORK_BASE_FEE_VALUE,
    networkPassphrase: BLOCKCHAIN_NETWORK_NAME
  })
    .addOperation(
      StellarSdk.Operation.beginSponsoringFutureReserves({
        sponsoredId: sponsoredKeypair.publicKey
      })
    )
    .addOperation(
      StellarSdk.Operation.createAccount({
        destination: sponsoredKeypair.publicKey,
        startingBalance
      })
    )
    .addOperation(
      StellarSdk.Operation.endSponsoringFutureReserves({
        source: sponsoredKeypair.publicKey
      })
    )
    .setTimeout(StellarSdk.TimeoutInfinite)
    .build();

  const sponsoredStellarKeypair = StellarSdk.Keypair.fromSecret(
    sponsoredKeypair.secretKey
  );

  tx.sign(sponsoredStellarKeypair);

  return tx.toXDR();
};
