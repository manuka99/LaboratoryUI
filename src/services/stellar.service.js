import StellarSdk from "stellar-sdk";
import { BLOCKCHAIN_NETWORK_URI } from "@/services/config";
const server = new StellarSdk.Server(BLOCKCHAIN_NETWORK_URI);

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
